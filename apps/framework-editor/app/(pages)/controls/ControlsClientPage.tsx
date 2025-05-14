'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import PageLayout from "@/app/components/PageLayout";
import { CreateControlDialog } from './components/CreateControlDialog';
import type { FrameworkEditorControlTemplate } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@comp/ui/button';
import { SortAsc, SortDesc, Search as SearchIcon } from 'lucide-react';
import { Input } from '@comp/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@comp/ui/select';

import {
  DataSheetGrid,
  textColumn,
  keyColumn,
  Column,
  CellProps,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

// Local Operation type based on documentation usage
type DSGOperation = 
  | { type: 'CREATE'; fromRowIndex: number; toRowIndex: number }
  | { type: 'UPDATE'; fromRowIndex: number; toRowIndex: number }
  | { type: 'DELETE'; fromRowIndex: number; toRowIndex: number };

interface FrameworkEditorControlTemplateWithRelatedData extends FrameworkEditorControlTemplate {
  policyTemplates?: { id: string; name: string }[];
  requirements?: { id: string; name: string }[];
  taskTemplates?: { id: string; name: string }[];
}

interface ControlsClientPageProps {
  initialControls: FrameworkEditorControlTemplateWithRelatedData[];
}

type GridData = {
  id: string;
  name: string | null;
  description: string | null;
  policyTemplatesCount: string | null;
  requirementsCount: string | null;
  taskTemplatesCount: string | null;
};

type SortableColumn = 'name' | 'description' | 'policyTemplatesCount' | 'requirementsCount' | 'taskTemplatesCount';
type SortDirection = 'asc' | 'desc';

const sortableColumnsOptions: { value: SortableColumn; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'description', label: 'Description' },
  { value: 'policyTemplatesCount', label: 'Policy Templates' },
  { value: 'requirementsCount', label: 'Requirements' },
  { value: 'taskTemplatesCount', label: 'Task Templates' },
];

// Simple UUID generator for new rows
const simpleUUID = () => crypto.randomUUID();

// Custom Hook for Change Tracking
const useChangeTracking = (initialData: GridData[]) => {
  const [data, setData] = useState<GridData[]>(initialData);
  const [prevData, setPrevData] = useState<GridData[]>(initialData);

  // Persist sets across re-renders using useMemo with an empty dependency array
  // or useRef if preferred, but useMemo works fine here for sets.
  const createdRowIds = useMemo(() => new Set<string>(), []);
  const updatedRowIds = useMemo(() => new Set<string>(), []);
  const deletedRowIds = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    // Reset data and tracking when initialData changes (e.g., after router.refresh())
    setData(initialData);
    setPrevData(initialData);
    // Ensure sets are cleared when initialData itself changes, not just on first mount of the hook with initialData
    createdRowIds.clear();
    updatedRowIds.clear();
    deletedRowIds.clear();
  }, [initialData, createdRowIds, updatedRowIds, deletedRowIds]); // Dependencies ensure reset if initialData identity changes


  const handleGridChange = useCallback((newValue: GridData[], operations: DSGOperation[]) => {
    // It's crucial to use a functional update for `data` if operations depend on the previous state of `data`
    // For DELETE, `data` (the state before this onChange) is used.
    setData(currentDataState => {
      let workingNewValue = [...newValue]; // Copy of newValue to potentially modify (for re-inserting deleted rows for styling)
      const originalDataForDelete = [...currentDataState]; // Data before this specific change operation

      operations.forEach(op => {
        if (op.type === 'CREATE') {
          // `slice` on `newValue` (or `workingNewValue`) because these rows are already in it
          workingNewValue.slice(op.fromRowIndex, op.toRowIndex).forEach(row => {
            if (row.id) createdRowIds.add(row.id);
          });
        } else if (op.type === 'UPDATE') {
          workingNewValue.slice(op.fromRowIndex, op.toRowIndex).forEach(row => {
            if (row.id && !createdRowIds.has(row.id) && !deletedRowIds.has(row.id)) {
              updatedRowIds.add(row.id);
            }
          });
        } else if (op.type === 'DELETE') {
          let keptRowsForDisplay = 0;
          // `slice` on `originalDataForDelete` because these rows are gone from `newValue`
          originalDataForDelete.slice(op.fromRowIndex, op.toRowIndex).forEach((deletedRow, i) => {
            if (!deletedRow.id) return;

            updatedRowIds.delete(deletedRow.id);
            if (createdRowIds.has(deletedRow.id)) {
              createdRowIds.delete(deletedRow.id);
            } else {
              deletedRowIds.add(deletedRow.id);
              // Re-insert into workingNewValue for styling purposes, as per example
              workingNewValue.splice(op.fromRowIndex + keptRowsForDisplay++, 0, originalDataForDelete[op.fromRowIndex + i]);
            }
          });
        }
      });
      return workingNewValue; // This becomes the new `data` state
    });
  }, [createdRowIds, updatedRowIds, deletedRowIds]);

  const getRowClassName = useCallback(({ rowData }: { rowData: GridData }) => {
    if (!rowData || !rowData.id) return '';
    if (deletedRowIds.has(rowData.id)) return 'row-deleted';
    if (createdRowIds.has(rowData.id)) return 'row-created';
    if (updatedRowIds.has(rowData.id)) return 'row-updated';
    return '';
  }, [createdRowIds, updatedRowIds, deletedRowIds]);

  const handleCommit = useCallback(() => {
    // Placeholder for actual API calls
    console.log('Committing changes:', {
      created: Array.from(createdRowIds),
      updated: Array.from(updatedRowIds),
      deleted: Array.from(deletedRowIds),
    });
    
    const newData = data.filter(row => !row.id || !deletedRowIds.has(row.id));
    setData(newData);
    setPrevData(newData); // Update prevData to the new committed state
    createdRowIds.clear();
    updatedRowIds.clear();
    deletedRowIds.clear();
    // Potentially trigger a refetch or notify parent if needed
  }, [data, createdRowIds, updatedRowIds, deletedRowIds]);

  const handleCancel = useCallback(() => {
    setData(prevData); // Revert to the last committed or initial state
    createdRowIds.clear();
    updatedRowIds.clear();
    deletedRowIds.clear();
  }, [prevData, createdRowIds, updatedRowIds, deletedRowIds]);

  const isDirty = createdRowIds.size > 0 || updatedRowIds.size > 0 || deletedRowIds.size > 0;

  return {
    dataForGrid: data,
    handleGridChange,
    getRowClassName,
    handleCommit,
    handleCancel,
    isDirty,
  };
};

// Custom Cell Component for Actions
const ActionCell: React.FC<CellProps<GridData, any>> = ({ rowData }) => {
  const router = useRouter();
  if (!rowData) return null;
  const handleNavigate = () => router.push(`/controls/${rowData.id}`);
  return (
    <div className="flex w-full p-1">
      <Button onClick={handleNavigate} disabled={!rowData} size="sm" variant="outline" className='w-full' title={`View details for ${rowData.name || 'control'}`}>
        View →
      </Button>
    </div>
  );
};

export function ControlsClientPage({ initialControls }: ControlsClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    
    const initialGridData = useMemo(() => {
      return initialControls.map(control => ({
        id: control.id || simpleUUID(), // Ensure ID exists, crucial for tracking
        name: control.name ?? null,
        description: control.description ?? null,
        policyTemplatesCount: (control.policyTemplates?.length ?? 0).toString(),
        requirementsCount: (control.requirements?.length ?? 0).toString(),
        taskTemplatesCount: (control.taskTemplates?.length ?? 0).toString(),
      }));
    }, [initialControls]);

    const { 
      dataForGrid, 
      handleGridChange, 
      getRowClassName, 
      handleCommit, 
      handleCancel, 
      isDirty 
    } = useChangeTracking(initialGridData);
    
    const processedData = useMemo(() => {
      let dataToProcess = [...dataForGrid]; // Use data from the change tracking hook

      if (searchTerm.trim() !== '') {
        dataToProcess = dataToProcess.filter(item => 
          (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (sortColumn) {
        dataToProcess.sort((a, b) => {
          const valA = a[sortColumn];
          const valB = b[sortColumn];
          let comparison = 0;
          if (valA === null && valB === null) comparison = 0;
          else if (valA === null) comparison = sortDirection === 'asc' ? -1 : 1;
          else if (valB === null) comparison = sortDirection === 'asc' ? 1 : -1;
          else if (['policyTemplatesCount', 'requirementsCount', 'taskTemplatesCount'].includes(sortColumn)) {
            const numA = parseInt(valA as string); // valA is string | null, ensure it's string
            const numB = parseInt(valB as string); // valB is string | null, ensure it's string
            comparison = numA - numB;
          } else {
            comparison = (valA as string).localeCompare(valB as string);
          }
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
      return dataToProcess;
    }, [dataForGrid, searchTerm, sortColumn, sortDirection]);


    const columns: Column<GridData>[] = [
      { ...keyColumn('name', textColumn), title: 'Name' },
      { ...keyColumn('description', textColumn), title: 'Description' },
      { ...keyColumn('policyTemplatesCount', textColumn), title: 'Policy Templates' },
      { ...keyColumn('requirementsCount', textColumn), title: 'Requirements' },
      { ...keyColumn('taskTemplatesCount', textColumn), title: 'Task Templates' },
      {
        id: 'actions',
        title: 'Actions',
        component: ActionCell,
        width: 1,
        minWidth: 100,
      }
    ];
    
    return (
        <PageLayout breadcrumbs={[{ label: "Controls", href: "/controls" }]}>
            <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center flex-grow">
                <Input
                  type="text"
                  placeholder="Search controls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow sm:flex-grow-0 sm:w-auto" // Adjust grow properties
                  leftIcon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
                />
                <div className="flex gap-2 items-center">
                  <Select 
                    value={sortColumn ?? '__NONE__'}
                    onValueChange={(value) => setSortColumn(value === '__NONE__' ? null : value as SortableColumn)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__NONE__">None</SelectItem>
                      {sortableColumnsOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    disabled={!sortColumn}
                    title={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                  >
                    {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    <span className="sr-only">Toggle sort direction</span>
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 items-center mt-4 sm:mt-0">
                 <Button 
                  onClick={handleCommit} 
                  disabled={!isDirty}
                  variant="default"
                >
                  Commit Changes
                </Button>
                <Button 
                  onClick={handleCancel} 
                  disabled={!isDirty}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                >
                  Create New Control
                </Button>
              </div>
            </div>
            
            <DataSheetGrid
              value={processedData}
              onChange={handleGridChange} // Use the hook's onChange
              columns={columns}
              rowClassName={getRowClassName} // Use the hook's rowClassName
              createRow={() => ({ // Add createRow prop
                id: simpleUUID(), // Generate new ID
                name: '', // Default values for new row
                description: '',
                policyTemplatesCount: '0',
                requirementsCount: '0',
                taskTemplatesCount: '0',
              })}
              duplicateRow={({rowData}) => ({ ...rowData, id: simpleUUID() })} // Add duplicateRow
            />
            
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                  router.refresh(); // Refreshes initialControls, hook will reset
                }}
            />
        </PageLayout>
    );
} 