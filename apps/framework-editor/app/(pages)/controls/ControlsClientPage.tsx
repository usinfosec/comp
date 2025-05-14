'use client';

import PageLayout from "@/app/components/PageLayout";
import { useMemo, useState } from 'react';
import { TableToolbar } from '../../components/TableToolbar';
import { useTableSearchSort } from '../../hooks/useTableSearchSort';
import type { SortConfig } from '../../types/common';
import { relationalColumn, type ItemWithName } from './components/RelationalCell';
import { CreateControlDialog } from './components/CreateControlDialog';
import { simpleUUID, useChangeTracking } from './hooks/useChangeTracking';
import type {
    ControlsPageGridData,
    ControlsPageSortableColumnKey,
    FrameworkEditorControlTemplateWithRelatedData,
    SortableColumnOption
} from './types';
import {
  getAllPolicyTemplates, getAllRequirements, getAllTaskTemplates,
  linkPolicyTemplateToControl, unlinkPolicyTemplateFromControl,
  linkRequirementToControl, unlinkRequirementFromControl,
  linkTaskTemplateToControl, unlinkTaskTemplateFromControl
} from './actions';
import { toast } from 'sonner';

import {
    Column,
    DataSheetGrid,
    dateColumn,
    keyColumn,
    textColumn
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

interface ControlsClientPageProps {
  initialControls: FrameworkEditorControlTemplateWithRelatedData[];
}

const sortableColumnsOptions: SortableColumnOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'description', label: 'Description' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'updatedAt', label: 'Updated At' },
];

const controlsSearchableKeys: ControlsPageSortableColumnKey[] = ['name', 'description'];
const controlsSortConfig: SortConfig<ControlsPageSortableColumnKey> = {
  name: 'string',
  description: 'string',
  policyTemplatesLength: 'number',
  requirementsLength: 'number',
  taskTemplatesLength: 'number',
  createdAt: 'number',
  updatedAt: 'number',
};

export function ControlsClientPage({ initialControls }: ControlsClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    
    const initialGridData: ControlsPageGridData[] = useMemo(() => {
      return initialControls.map(control => {
        let cDate: Date | null = null;
        if (control.createdAt) {
          // Handles if control.createdAt is Date obj or valid date string
          const parsedCDate = new Date(control.createdAt);
          if (!isNaN(parsedCDate.getTime())) { // Check if it's a valid date
            cDate = parsedCDate;
          }
        }

        let uDate: Date | null = null;
        if (control.updatedAt) {
          // Handles if control.updatedAt is Date obj or valid date string
          const parsedUDate = new Date(control.updatedAt);
          if (!isNaN(parsedUDate.getTime())) { // Check if it's a valid date
            uDate = parsedUDate;
          }
        }

        return {
          id: control.id || simpleUUID(),
          name: control.name ?? null,
          description: control.description ?? null,
          policyTemplates: control.policyTemplates?.map(pt => ({ id: pt.id, name: pt.name })) ?? [],
          requirements: control.requirements?.map(r => ({ id: r.id, name: r.name })) ?? [],
          taskTemplates: control.taskTemplates?.map(tt => ({ id: tt.id, name: tt.name })) ?? [],
          policyTemplatesLength: control.policyTemplates?.length ?? 0,
          requirementsLength: control.requirements?.length ?? 0,
          taskTemplatesLength: control.taskTemplates?.length ?? 0,
          createdAt: cDate,
          updatedAt: uDate,
        };
      });
    }, [initialControls]);

    const { 
      dataForGrid, 
      handleGridChange, 
      getRowClassName, 
      handleCommit, 
      handleCancel, 
      isDirty,
      createdRowIds,
      updatedRowIds,
      deletedRowIds,
      changesSummaryString
    } = useChangeTracking(initialGridData);
    
    const {
      searchTerm,
      setSearchTerm,
      sortColumnKey,
      setSortColumnKey,
      sortDirection,
      toggleSortDirection,
      processedData: sortedDataWithPotentialTimestamps,
    } = useTableSearchSort<ControlsPageGridData, ControlsPageSortableColumnKey>(
      dataForGrid,
      controlsSearchableKeys,
      controlsSortConfig,
      'createdAt',
      'asc'
    );

    // Convert timestamps back to Date objects if useTableSearchSort changed them
    const dataForDisplay = useMemo(() => {
      return sortedDataWithPotentialTimestamps.map(row => {
        const newRow = { ...row };
        // If createdAt/updatedAt became a number (timestamp) after sorting, convert back to Date
        if (typeof newRow.createdAt === 'number') {
          newRow.createdAt = new Date(newRow.createdAt);
        }
        if (typeof newRow.updatedAt === 'number') {
          newRow.updatedAt = new Date(newRow.updatedAt);
        }
        return newRow;
      });
    }, [sortedDataWithPotentialTimestamps]);

    const columns: Column<ControlsPageGridData>[] = [
      { ...keyColumn('name', textColumn), title: 'Name', minWidth: 150 },
      { ...keyColumn('description', textColumn), title: 'Description', minWidth: 250 },
      {
        ...(relationalColumn<ControlsPageGridData, 'policyTemplates'> ({
          itemsKey: 'policyTemplates',
          getAllSearchableItems: getAllPolicyTemplates,
          linkItemAction: async (controlId, policyTemplateId) => {
            try {
              await linkPolicyTemplateToControl(controlId, policyTemplateId);
              toast.success("Policy template linked successfully.");
            } catch (error) {
              toast.error(`Failed to link policy template: ${error instanceof Error ? error.message : String(error)}`);
              // Do not re-throw, error is handled with a toast
            }
          },
          unlinkItemAction: async (controlId, policyTemplateId) => {
            try {
              await unlinkPolicyTemplateFromControl(controlId, policyTemplateId);
              toast.success("Policy template unlinked successfully.");
            } catch (error) {
              toast.error(`Failed to unlink policy template: ${error instanceof Error ? error.message : String(error)}`);
            }
          },
          itemTypeLabel: 'Policy',
          createdRowIds: createdRowIds,
        })),
        id: 'policyTemplates',
        title: 'Linked Policies', 
        minWidth: 200 
      },
      {
        id: 'requirements',
        title: 'Linked Requirements', 
        minWidth: 200,
        ...(relationalColumn<ControlsPageGridData, 'requirements'> ({
          itemsKey: 'requirements',
          getAllSearchableItems: getAllRequirements,
          linkItemAction: async (controlId, requirementId) => {
            try {
              await linkRequirementToControl(controlId, requirementId);
              toast.success("Requirement linked successfully.");
            } catch (error) {
              toast.error(`Failed to link requirement: ${error instanceof Error ? error.message : String(error)}`);
            }
          },
          unlinkItemAction: async (controlId, requirementId) => {
            try {
              await unlinkRequirementFromControl(controlId, requirementId);
              toast.success("Requirement unlinked successfully.");
            } catch (error) {
              toast.error(`Failed to unlink requirement: ${error instanceof Error ? error.message : String(error)}`);
            }
          },
          itemTypeLabel: 'Requirement',
          createdRowIds: createdRowIds,
        })), 
      },
      {
        id: 'taskTemplates',
        title: 'Linked Tasks', 
        minWidth: 200,
        ...(relationalColumn<ControlsPageGridData, 'taskTemplates'> ({
          itemsKey: 'taskTemplates',
          getAllSearchableItems: getAllTaskTemplates,
          linkItemAction: async (controlId, taskTemplateId) => {
            try {
              await linkTaskTemplateToControl(controlId, taskTemplateId);
              toast.success("Task template linked successfully.");
            } catch (error) {
              toast.error(`Failed to link task template: ${error instanceof Error ? error.message : String(error)}`);
            }
          },
          unlinkItemAction: async (controlId, taskTemplateId) => {
            try {
              await unlinkTaskTemplateFromControl(controlId, taskTemplateId);
              toast.success("Task template unlinked successfully.");
            } catch (error) {
              toast.error(`Failed to unlink task template: ${error instanceof Error ? error.message : String(error)}`);
            }
          },
          itemTypeLabel: 'Task Template',
          createdRowIds: createdRowIds,
        })), 
      },
      { ...keyColumn('createdAt', dateColumn), title: 'Created At', minWidth: 180, disabled: true },
      { ...keyColumn('updatedAt', dateColumn), title: 'Updated At', minWidth: 180, disabled: true },
    ];
    
    return (
        <PageLayout breadcrumbs={[{ label: "Controls", href: "/controls" }]}>
            <TableToolbar
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              sortColumnKey={sortColumnKey}
              onSortColumnKeyChange={(key) => setSortColumnKey(key as ControlsPageSortableColumnKey | null)}
              sortDirection={sortDirection}
              onSortDirectionChange={toggleSortDirection}
              sortableColumnOptions={sortableColumnsOptions}
              showCommitCancel={true}
              isDirty={isDirty}
              onCommit={handleCommit}
              onCancel={handleCancel}
              showCreateButton={true}
              onCreateClick={() => setIsCreateDialogOpen(true)}
              createButtonLabel="Create New Control"
              commitButtonDetailText={changesSummaryString}
            />
            
            <DataSheetGrid
              value={dataForDisplay}
              height={600}
              onChange={handleGridChange}
              columns={columns}
              rowClassName={getRowClassName}
              createRow={() => ({
                id: simpleUUID(),
                name: 'Control Name',
                description: 'Control Description',
                policyTemplates: [],
                requirements: [],
                taskTemplates: [],
                policyTemplatesLength: 0,
                requirementsLength: 0,
                taskTemplatesLength: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
              })}
              duplicateRow={({rowData}) => ({ 
                ...rowData, 
                id: simpleUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
              })}
            />
            
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                }}
            />
        </PageLayout>
    );
} 