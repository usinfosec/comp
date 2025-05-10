'use client'

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@comp/ui/input';
import { Button } from '@comp/ui/button';
import { ScrollArea } from '@comp/ui/scroll-area';
import { Loader2, PlusCircleIcon, Link2OffIcon } from 'lucide-react';
import { Separator } from '@comp/ui/separator';
import { Badge } from '@comp/ui/badge'; // Import Badge for default display if needed

// Base item structure expected by this component
export interface SearchableItemForLinking {
  id: string;
  name: string;
  frameworkName?: string; // Make frameworkName optional and explicit for type safety
  framework?: { id: string; name: string | null }; // Keep original nested structure if needed
  [key: string]: any; // Allow other properties
}

interface SearchAndLinkListProps {
  itemTypeLabel: string; // e.g., "requirement"
  linkedItemIds: Set<string>; // IDs of currently linked items
  currentLinkedItemsDetails: SearchableItemForLinking[]; // Full details of currently linked items for display
  getAllItemsFunction: () => Promise<SearchableItemForLinking[]>; // Changed from searchFunction
  onLinkItem: (item: SearchableItemForLinking) => Promise<void>;
  onUnlinkItem: (item: SearchableItemForLinking) => Promise<void>;
  renderItemDisplay?: (item: SearchableItemForLinking) => React.ReactNode; // For custom item rendering (name + badge)
}

export function SearchAndLinkList({
  itemTypeLabel,
  linkedItemIds,
  currentLinkedItemsDetails,
  getAllItemsFunction, // Changed from searchFunction
  onLinkItem,
  onUnlinkItem,
  renderItemDisplay,
}: SearchAndLinkListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableItems, setAvailableItems] = useState<SearchableItemForLinking[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true); // For the initial fetch of all items
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoadingInitial(true);
      try {
        const results = await getAllItemsFunction();
        setAvailableItems(results);
      } catch (error) {
        console.error(`Error fetching all ${itemTypeLabel}s:`, error);
        setAvailableItems([]);
      }
      setIsLoadingInitial(false);
    };
    fetchAll();
  }, [getAllItemsFunction, itemTypeLabel]); // getAllItemsFunction identity is important

  const filteredAvailableItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return availableItems;
    }
    return availableItems.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      // Compound search: check frameworkName if it exists (itemTypeLabel check is an alternative here too)
      const frameworkNameMatch = item.frameworkName && item.frameworkName.toLowerCase().includes(term);
      return nameMatch || frameworkNameMatch;
    });
  }, [availableItems, searchTerm]);

  const unlinkedItemsToDisplay = useMemo(() => {
    return filteredAvailableItems.filter(item => !linkedItemIds.has(item.id));
  }, [filteredAvailableItems, linkedItemIds]);

  const defaultItemDisplay = (item: SearchableItemForLinking) => (
    <span className='truncate' title={item.name}>{item.name}</span>
  );

  const handleLink = async (item: SearchableItemForLinking) => {
    setIsLoadingAction(item.id);
    try {
      await onLinkItem(item);
    } catch (error) {
      console.error(`Error linking ${itemTypeLabel}:`, error);
    }
    setIsLoadingAction(null);
  };

  const handleUnlink = async (item: SearchableItemForLinking) => {
    setIsLoadingAction(item.id);
    try {
      await onUnlinkItem(item);
    } catch (error) {
      console.error(`Error unlinking ${itemTypeLabel}:`, error);
    }
    setIsLoadingAction(null);
  };

  return (
    <div className="space-y-4 flex flex-col min-h-0">
      <div>
        <h3 className="text-md font-medium mb-2 text-muted-foreground">Currently Linked {itemTypeLabel}s ({currentLinkedItemsDetails.length})</h3>
        {currentLinkedItemsDetails.length > 0 ? (
          <ScrollArea className="h-[150px] pr-3 border rounded-sm shrink-0">
            <ul className="space-y-1 p-2">
              {currentLinkedItemsDetails.map((item) => (
                <li key={item.id} className="text-sm p-1.5 flex justify-between items-center rounded-sm hover:bg-muted/50">
                  {renderItemDisplay ? renderItemDisplay(item) : defaultItemDisplay(item)}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleUnlink(item)} 
                    disabled={isLoadingAction === item.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 px-2 h-auto py-1 rounded-sm ml-2 shrink-0 flex items-center"
                  >
                    <span className="flex items-center justify-center h-4 w-4">
                      {isLoadingAction === item.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Link2OffIcon className="h-4 w-4" />}
                    </span>
                    Unlink
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="h-[150px] flex items-center justify-center text-sm text-muted-foreground text-center p-2 border rounded-sm bg-muted/20">No {itemTypeLabel}s are currently linked.</p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col min-h-0">
        <h3 className="text-md font-medium mb-2 text-muted-foreground">Find & Link New {itemTypeLabel}s</h3>

          <>
            <Input 
              type="search"
              placeholder={`Search ${availableItems.length} ${itemTypeLabel.toLowerCase()}s by name or framework...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3 rounded-sm shrink-0"
            />
            {unlinkedItemsToDisplay.length === 0 && searchTerm.trim() && (
              <p className="h-[150px] flex items-center justify-center text-sm text-muted-foreground text-center p-2 border rounded-sm shrink-0">No unlinked {itemTypeLabel}s found matching "{searchTerm}".</p>
            )}
            {unlinkedItemsToDisplay.length === 0 && !searchTerm.trim() && availableItems.length === 0 && (
              <p className="h-[150px] flex items-center justify-center text-sm text-muted-foreground text-center p-2 border rounded-sm shrink-0">No available {itemTypeLabel}s found in the database.</p>
            )}
            {unlinkedItemsToDisplay.length === 0 && !searchTerm.trim() && availableItems.length > 0 && (
              <p className="h-[150px] flex items-center justify-center text-sm text-muted-foreground text-center p-2 border rounded-sm shrink-0">All available {itemTypeLabel}s are already linked.</p> 
            )}

            {unlinkedItemsToDisplay.length > 0 && (
              <ScrollArea className="h-[150px] pr-3 border rounded-sm shrink-0">
                <ul className="space-y-1 p-2">
                  {unlinkedItemsToDisplay.map((item) => (
                    <li key={item.id} className="text-sm p-1.5 flex justify-between items-center rounded-sm hover:bg-muted/50">
                      {renderItemDisplay ? renderItemDisplay(item) : defaultItemDisplay(item)}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLink(item)} 
                        disabled={isLoadingAction === item.id || linkedItemIds.has(item.id)}
                        className="text-primary hover:text-primary hover:bg-primary/10 gap-1 px-2 h-auto py-1 rounded-sm ml-2 shrink-0 flex items-center"
                      >
                        <span className="flex items-center justify-center h-4 w-4">
                          {isLoadingAction === item.id ? <Loader2 className="animate-spin h-4 w-4" /> : <PlusCircleIcon className="h-4 w-4" />}
                        </span>
                        Link
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </>

      </div>
    </div>
  );
} 