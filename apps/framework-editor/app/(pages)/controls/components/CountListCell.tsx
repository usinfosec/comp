import { Button } from '@comp/ui/button';
import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for createPortal
import type { CellProps, Column } from 'react-datasheet-grid';
import { PlugIcon, Plus } from 'lucide-react';

// Interface for items that can be displayed as pills
export interface ItemWithName {
  id: string; // Or any unique key per item
  name: string;
}

// Define props for CountListCell including search functionalities
interface CountListCellProps extends CellProps<ItemWithName[], any> {
  getAllSearchableItems: () => Promise<ItemWithName[]>;
  onLinkItem: (item: ItemWithName) => void;
  itemTypeLabel: string;
}

/**
 * CountListCell is a React component designed for use with react-datasheet-grid.
 * It displays items as pills. When inactive, it shows a clipped single line.
 * When active, it uses a portal to show an expanded view with all items and an Add button.
 */
export const CountListCell = React.memo(
  ({
    rowData,
    active,
    getAllSearchableItems,
    onLinkItem,
    itemTypeLabel,
  }: CountListCellProps) => {
    const items = rowData || [];
    const cellRef = useRef<HTMLDivElement>(null);
    const [popoverStyles, setPopoverStyles] = useState<React.CSSProperties>({});
    const [isPortalVisible, setIsPortalVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // State for search functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [allSearchableItems, setAllSearchableItems] = useState<ItemWithName[]>([]);
    const [filteredItems, setFilteredItems] = useState<ItemWithName[]>([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // Effect to fetch all items when search mode is activated
    useEffect(() => {
      if (isSearching && active && mounted) {
        if (allSearchableItems.length === 0) { // Fetch only if not already fetched
          setIsLoadingSearch(true);
          getAllSearchableItems()
            .then((fetchedItems) => {
              setAllSearchableItems(fetchedItems);
              setFilteredItems(fetchedItems); // Initially, all items are filtered
            })
            .catch(console.error) // Basic error handling
            .finally(() => setIsLoadingSearch(false));
        } else {
          // If already fetched, just ensure filteredItems is up-to-date with current search term (e.g. if term was persisted)
          setFilteredItems(
            allSearchableItems.filter(item => 
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }
      }
    }, [isSearching, active, mounted, getAllSearchableItems, allSearchableItems.length, searchTerm]); // Added allSearchableItems.length and searchTerm

    // Effect to filter items when searchTerm changes
    useEffect(() => {
      if (searchTerm === '') {
        setFilteredItems(allSearchableItems);
      } else {
        setFilteredItems(
          allSearchableItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
    }, [searchTerm, allSearchableItems]);

    useEffect(() => {
      if (active && cellRef.current && mounted) {
        const rect = cellRef.current.getBoundingClientRect();
        setPopoverStyles({
          position: 'absolute',
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          minWidth: rect.width,
          maxWidth: Math.max(rect.width * 1.5, 350), 
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '2px', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
          zIndex: 1050, 
          padding: '8px',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '8px',
          maxHeight: '300px', 
        });
        setIsPortalVisible(true);
      } else {
        setIsPortalVisible(false);
        setIsSearching(false); 
        setSearchTerm(''); // Reset search term when cell becomes inactive
      }
    }, [active, mounted]);

    const pillBaseStyle: React.CSSProperties = {
      backgroundColor: '#f0f0f0',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.875em',
      whiteSpace: 'nowrap',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      flexShrink: 0,
    };

    const addButtonStyle: React.CSSProperties = {
      flexShrink: 0,
    };

    const InactiveView = () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          gap: '4px',
          padding: '5px',
        }}
      >
        {items.map((item) => (
          <span key={item.id} style={pillBaseStyle}>
            {item.name}
          </span>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { 
            // When inactive view's add is clicked, just activate the cell. 
            // The `active` prop changing will trigger the popover and search logic if configured.
            // This assumes react-datasheet-grid handles focusing/activating the cell on click.
            // If not, we might need to call a focus() method from DSG if available.
           }} 
          style={{...addButtonStyle, marginLeft: items.length > 0 ? '4px' : '0'}}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    );

    const handleSelectItem = (itemToLink: ItemWithName) => {
      onLinkItem(itemToLink);
      setSearchTerm('');
      setIsSearching(false);
      // Optional: Maybe refresh allSearchableItems or filteredItems if linking changes their status
      // but typically the parent component updating rowData will cause a re-render.
    };

    const ActivePortalContent = () => (
      <div 
        style={popoverStyles} 
        onMouseDown={(e) => e.stopPropagation()}
      >
        {isSearching ? (
          <>
            <input 
              type="text" 
              placeholder={`Search ${itemTypeLabel}s...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }}
              autoFocus
            />
            {isLoadingSearch ? (
              <p>Loading...</p>
            ) : (
              <div style={{ flexGrow: 1, overflowY: 'auto', minHeight: '100px' }}>
                {filteredItems.length === 0 && searchTerm !== '' && <p>No {itemTypeLabel}s found.</p>}
                {filteredItems.map((item) => {
                  const isLinked = items.some(linkedItem => linkedItem.id === item.id);
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectItem(item)}
                      disabled={isLinked}
                      style={{ display:'block', width: '100%', textAlign: 'left', marginBottom: '4px' }}
                    >
                      {item.name} {isLinked && "(Linked)"}
                    </Button>
                  );
                })}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => { setIsSearching(false); setSearchTerm(''); }} style={{...addButtonStyle, marginTop: '8px'}}>
              Back to Pills
            </Button>
          </>
        ) : (
          <>
            {items.length > 0 && (
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  alignItems: 'flex-start',
                  overflowY: 'auto', 
                  maxHeight: 'calc(300px - 40px - 8px - 8px)',
                }}
              >
                {items.map((item) => (
                  <span key={item.id} style={pillBaseStyle}>
                    {item.name}
                  </span>
                ))}
              </div>
            )}
            <Button 
              variant="outline" 
              className="" 
              size="sm" 
              onClick={() => setIsSearching(true)}
              style={addButtonStyle}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    );

    return (
      <>
        <div ref={cellRef} style={{ height: '100%', width: '100%', position: 'relative' }}>
          <InactiveView />
        </div>
        {mounted && isPortalVisible && active && document.body &&
          ReactDOM.createPortal(<ActivePortalContent />, document.body)}
      </>
    );
  }
);

CountListCell.displayName = 'CountListCell';

/**
 * countListColumn is a helper function to create a react-datasheet-grid column configuration
 * for displaying a list of ItemWithName objects as pills using the CountListCell component.
 */
export const countListColumn = (customProps: Omit<CountListCellProps, keyof CellProps<ItemWithName[], any>>) : Partial<Column<ItemWithName[], any>> => ({
  // Wrap CountListCell to correctly pass both DSG props and custom props
  component: (props: CellProps<ItemWithName[], any>) => (
    <CountListCell {...props} {...customProps} />
  ),
  copyValue: ({ rowData }) => rowData?.map(item => item.name).join(', ') || null,
}); 