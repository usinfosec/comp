import React, { useEffect, useRef, useState } from 'react';
import type { CellProps, Column } from 'react-datasheet-grid';
import ReactDOM from 'react-dom'; // Import ReactDOM for createPortal

// ItemWithName interface is removed as this cell now handles a single string.

// TRowDataType is the type of the entire row object
// TStringKey is a key of TRowDataType that points to string | null
interface TextAreaCellComponentProps<TRowDataType extends { id?: string }, TStringKey extends keyof TRowDataType> 
  extends CellProps<TRowDataType, TRowDataType> { 
  stringKey: TStringKey; 
  createdRowIds?: Set<string>;
  // itemTypeLabel is removed as it's not relevant for a simple textarea
}

/**
 * TextAreaCellComponent is the inner implementation for the cell.
 * It displays items as pills. When inactive, it shows a clipped single line.
 * When active (and not pending creation), it uses a portal for an expanded view showing a textarea.
 */
const TextAreaCellComponent = <TRowDataType extends { id?: string }, TStringKey extends keyof TRowDataType>(
  props: TextAreaCellComponentProps<TRowDataType, TStringKey>
) => {
    const {
        rowData,
        active,
        stringKey,
        createdRowIds,
        setRowData,
        stopEditing,
    } = props;

    const cellValue = (rowData?.[stringKey] as unknown as string | null) || '';
    
    const cellRef = useRef<HTMLDivElement>(null);
    const [popoverStyles, setPopoverStyles] = useState<React.CSSProperties>({});
    const [isPortalVisible, setIsPortalVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [internalTextValue, setInternalTextValue] = useState(cellValue);

    const isPendingCreation = createdRowIds?.has(rowData?.id ?? '');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!isPortalVisible) {
            setInternalTextValue(cellValue);
        }
    }, [cellValue, isPortalVisible]);

    useEffect(() => {
        if (active && cellRef.current && mounted && !isPendingCreation) {
            const rect = cellRef.current.getBoundingClientRect();
            setPopoverStyles({
                position: 'absolute',
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                minWidth: Math.max(rect.width, 250), 
                maxWidth: Math.max(rect.width * 1.5, 400), 
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '2px', 
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                zIndex: 1050, 
                padding: '8px', 
                display: 'flex', 
                flexDirection: 'column',
                maxHeight: '200px', 
            });
            
            setInternalTextValue(cellValue);
            setIsPortalVisible(true);
        } else {
            if (isPortalVisible) { 
                if (mounted && !isPendingCreation && internalTextValue !== cellValue) {
                    if (rowData && setRowData) {
                        setRowData({ ...rowData, [stringKey]: internalTextValue });
                    }
                }
            }
            setIsPortalVisible(false); 
        }
    }, [active, mounted, isPendingCreation, stringKey, rowData, setRowData, cellValue, isPortalVisible]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInternalTextValue(event.target.value);
    };
    
    const handleTextareaBlur = () => {
        if (internalTextValue !== cellValue && rowData && setRowData && !isPendingCreation) {
            setRowData({ ...rowData, [stringKey]: internalTextValue });
        }
    };

    const InactiveView = () => (
        <div
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap', // User's preference from attached file
                padding: '5px',
                opacity: isPendingCreation ? 0.5 : 1, 
                cursor: isPendingCreation ? 'not-allowed' : 'default',
                backgroundColor: isPendingCreation ? '#f8f9fa' : 'transparent',
            }}
            onClickCapture={isPendingCreation ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
        >
            {isPendingCreation ? (
                <span style={{ fontStyle: 'italic', color: '#6c757d' }}>
                    Save row to edit
                </span>
            ) : (cellValue || <span style={{ fontStyle: 'italic', color: '#aaa' }}>Empty</span>)}
        </div>
    );

    const ActivePortalContent = () => (
        <div 
            style={popoverStyles} 
            onMouseDown={(e) => e.stopPropagation()} 
        >
            {isPendingCreation ? (
                <span style={{ fontStyle: 'italic', color: '#6c757d', padding: '8px', alignSelf: 'center', textAlign: 'center' }}>
                    Save row to enable editing.
                </span>
            ) : (
                <textarea
                    value={internalTextValue}
                    onChange={handleTextChange}
                    onBlur={handleTextareaBlur}
                    style={{
                        width: '100%',
                        height: '100%', 
                        minHeight: '100px', 
                        border: '1px solid #ced4da',
                        borderRadius: '2px',
                        padding: '8px',
                        fontFamily: 'inherit', 
                        fontSize: '0.875em',
                        resize: 'none',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                    }}
                    autoFocus
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            setInternalTextValue(cellValue);
                            stopEditing?.({nextRow: false});
                        }
                    }}
                />
            )}
        </div>
    );

    return (
        <>
            <div ref={cellRef} style={{ height: '100%', width: '100%', position: 'relative' }}>
                <InactiveView />
            </div>
            {mounted && active && isPortalVisible && ReactDOM.createPortal(
                <ActivePortalContent />, 
                document.body
            )}
        </>
    );
};

export const TextAreaCell = React.memo(TextAreaCellComponent) as {
    <TRowDataType extends { id?: string }, TStringKey extends keyof TRowDataType>(
        // Ensure TRowDataType[TStringKey] is compatible with string | null
        props: TextAreaCellComponentProps<TRowDataType, TStringKey> & { cellData?: string | null } 
    ): React.ReactElement;
    displayName?: string;
};

TextAreaCell.displayName = 'TextAreaCell';

/**
 * \`textAreaColumn\` is a factory function that creates a \`react-datasheet-grid\` column configuration
 * for displaying a list of ItemWithName objects as pills (inactive) or in a textarea (active)
 * using the TextAreaCell component.
 */
export const textAreaColumn = <TRowDataType extends { id?: string }, TStringKey extends keyof TRowDataType>(
    // CustomProps should now reflect the simplified TextAreaCellComponentProps
    customProps: Omit<TextAreaCellComponentProps<TRowDataType, TStringKey>, keyof CellProps<TRowDataType, TRowDataType> | 'cellData' | 'setRowData'> & { stringKey: TStringKey }
): Partial<Column<TRowDataType, TRowDataType>> => ({
    component: (dsgCellProps: CellProps<TRowDataType, TRowDataType>) => {
        // Pass the specific stringKey to the component
        return <TextAreaCell {...dsgCellProps} {...customProps} />;
    },
    keepFocus: true, // Important for portal interaction
    // The cell's direct value for copy/paste, etc., might need to be considered.
    // If `stringKey` points to `rowData[stringKey]`, DSG might handle it if column.key === stringKey.
    // This setup treats the whole row as cell data for the component, which is fine.
}); 