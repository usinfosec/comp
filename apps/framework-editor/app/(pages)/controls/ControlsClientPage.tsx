'use client';

import { useState, useMemo, useEffect } from 'react';
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

// Custom Cell Component for Actions
const ActionCell: React.FC<CellProps<GridData, any>> = ({ rowData }) => {
  const router = useRouter();

  if (!rowData) {
    return null;
  }
  const handleNavigate = () => {
    router.push(`/controls/${rowData.id}`);
  };
  return (
    <div className="flex w-full p-1">
      <Button 
        onClick={handleNavigate} 
        disabled={!rowData}
        size="sm"
        variant="outline"
        className='w-full'
        title={`View details for ${rowData.name || 'control'}`}
      >
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
    
    // Map initialControls to GridData format (memoized)
    const baseGridData = useMemo(() => {
      return initialControls.map(control => ({
        id: control.id,
        name: control.name ?? null,
        description: control.description ?? null,
        policyTemplatesCount: (control.policyTemplates?.length ?? 0).toString(),
        requirementsCount: (control.requirements?.length ?? 0).toString(),
        taskTemplatesCount: (control.taskTemplates?.length ?? 0).toString(),
      }));
    }, [initialControls]);

    // Process data: filter and sort (memoized)
    const processedData = useMemo(() => {
      let dataToProcess = [...baseGridData];

      // Filter
      if (searchTerm.trim() !== '') {
        dataToProcess = dataToProcess.filter(item => 
          (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Sort
      if (sortColumn) {
        dataToProcess.sort((a, b) => {
          const valA = a[sortColumn];
          const valB = b[sortColumn];

          let comparison = 0;
          if (valA === null && valB === null) comparison = 0;
          else if (valA === null) comparison = sortDirection === 'asc' ? -1 : 1;
          else if (valB === null) comparison = sortDirection === 'asc' ? 1 : -1;
          else if (['policyTemplatesCount', 'requirementsCount', 'taskTemplatesCount'].includes(sortColumn)) {
            const numA = parseInt(valA);
            const numB = parseInt(valB);
            comparison = numA - numB;
          } else { // string comparison for name, description
            comparison = (valA as string).localeCompare(valB as string);
          }
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
      return dataToProcess;
    }, [baseGridData, searchTerm, sortColumn, sortDirection]);
    
    // State for DataSheetGrid to allow its internal changes (e.g. direct cell edits)
    // and to be updated when processedData changes.
    const [gridDisplayData, setGridDisplayData] = useState<GridData[]>(processedData);

    useEffect(() => {
        setGridDisplayData(processedData);
    }, [processedData]);


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
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Input
                type="text"
                placeholder="Search controls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow"
                leftIcon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <div className="flex gap-2 items-center">
                <Select 
                  value={sortColumn ?? '__NONE__'}
                  onValueChange={(value) => setSortColumn(value === '__NONE__' ? null : value as SortableColumn)}
                >
                  <SelectTrigger className="w-[180px]">
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
              <Button 
                onClick={() => setIsCreateDialogOpen(true)} 
              >
                Create New Control
              </Button>
            </div>
            
            <DataSheetGrid
              value={gridDisplayData}
              onChange={setGridDisplayData}
              columns={columns}
            />
            
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                  router.refresh();
                }}
            />
        </PageLayout>
    );
} 