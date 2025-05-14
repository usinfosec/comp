'use client';

import { useState, useMemo, useEffect } from 'react';
import PageLayout from "@/app/components/PageLayout";
import { CreateControlDialog } from './components/CreateControlDialog';
import type { FrameworkEditorControlTemplate } from '@prisma/client';
import { useRouter } from 'next/navigation';
import type { 
  FrameworkEditorControlTemplateWithRelatedData, 
  ControlsPageGridData, 
  SortDirection,
  ControlsPageSortableColumnKey, 
  SortableColumnOption, 
} from './types';
import { useChangeTracking, simpleUUID } from './hooks/useChangeTracking';
import { ActionCell } from './components/ActionCell';
import { TableToolbar } from '../../components/TableToolbar';
import { useTableSearchSort } from '../../hooks/useTableSearchSort';
import type { SortConfig } from '../../types/common';
import { countListColumn, type ItemWithName } from './components/CountListCell';

import {
  DataSheetGrid,
  textColumn,
  keyColumn,
  Column,
  CellProps,
} from 'react-datasheet-grid';
import 'react-datasheet-grid/dist/style.css';

interface ControlsClientPageProps {
  initialControls: FrameworkEditorControlTemplateWithRelatedData[];
}

const sortableColumnsOptions: SortableColumnOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'description', label: 'Description' },
];

const controlsSearchableKeys: ControlsPageSortableColumnKey[] = ['name', 'description'];
const controlsSortConfig: SortConfig<ControlsPageSortableColumnKey> = {
  name: 'string',
  description: 'string',
  policyTemplatesLength: 'number',
  requirementsLength: 'number',
  taskTemplatesLength: 'number',
};

// Mock data for searchable items
const mockPoliciesDb: ItemWithName[] = [
  { id: 'policy-001', name: 'Global Data Privacy Policy' },
  { id: 'policy-002', name: 'Internal Security Standards' },
  { id: 'policy-003', name: 'Remote Work Access Policy' },
  { id: 'policy-004', name: 'Incident Response Plan' },
  { id: 'policy-005', name: 'Acceptable Use Policy' },
];

const mockRequirementsDb: ItemWithName[] = [
  { id: 'req-001', name: 'REQ-DATA-001: Data Encryption at Rest' },
  { id: 'req-002', name: 'REQ-ACCESS-005: Multi-Factor Authentication' },
  { id: 'req-003', name: 'REQ-AUDIT-002: Quarterly Log Review' },
  { id: 'req-004', name: 'REQ-NETWORK-007: Firewall Configuration Standards' },
];

const mockTaskTemplatesDb: ItemWithName[] = [
  { id: 'task-001', name: 'Onboarding: Security Awareness Training' },
  { id: 'task-002', name: 'Monthly: Vulnerability Scanning' },
  { id: 'task-003', name: 'Quarterly: User Access Review' },
  { id: 'task-004', name: 'Annual: Disaster Recovery Test' },
];

// Mock fetch functions
const getAllMockPolicies = async (): Promise<ItemWithName[]> => {
  console.log('Fetching all mock policies...');
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPoliciesDb;
};

const getAllMockRequirements = async (): Promise<ItemWithName[]> => {
  console.log('Fetching all mock requirements...');
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockRequirementsDb;
};

const getAllMockTaskTemplates = async (): Promise<ItemWithName[]> => {
  console.log('Fetching all mock task templates...');
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockTaskTemplatesDb;
};

export function ControlsClientPage({ initialControls }: ControlsClientPageProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const router = useRouter();
    
    const initialGridData: ControlsPageGridData[] = useMemo(() => {
      return initialControls.map(control => ({
        id: control.id || simpleUUID(),
        name: control.name ?? null,
        description: control.description ?? null,
        policyTemplates: control.policyTemplates?.map(pt => ({ id: pt.id, name: pt.name })) ?? [],
        requirements: control.requirements?.map(r => ({ id: r.id, name: r.name })) ?? [],
        taskTemplates: control.taskTemplates?.map(tt => ({ id: tt.id, name: tt.name })) ?? [],
        policyTemplatesLength: control.policyTemplates?.length ?? 0,
        requirementsLength: control.requirements?.length ?? 0,
        taskTemplatesLength: control.taskTemplates?.length ?? 0,
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
    
    const {
      searchTerm,
      setSearchTerm,
      sortColumnKey,
      setSortColumnKey,
      sortDirection,
      toggleSortDirection,
      processedData,
    } = useTableSearchSort<ControlsPageGridData, ControlsPageSortableColumnKey>(
      dataForGrid,
      controlsSearchableKeys,
      controlsSortConfig
    );

    // Handler for when an item is linked via CountListCell
    // This is mostly for logging or any side effects beyond cell data update handled by setRowData
    const handleItemLinked = (linkedItem: ItemWithName, itemType: string) => {
      console.log(`Item of type '${itemType}' linked:`, linkedItem.name);
      // Potentially trigger other actions if needed. The grid data itself
      // is updated by CountListCell calling setRowData, which then flows through
      // DataSheetGrid's onChange -> handleGridChange.
    };

    const columns: Column<ControlsPageGridData>[] = [
      { ...keyColumn('name', textColumn), title: 'Name', minWidth: 150 },
      { ...keyColumn('description', textColumn), title: 'Description', minWidth: 250 },
      {
        ...keyColumn('policyTemplates', countListColumn({
          getAllSearchableItems: getAllMockPolicies,
          onLinkItem: (item) => handleItemLinked(item, 'Policy'),
          itemTypeLabel: 'Policy',
        })), 
        title: 'Linked Policies', 
        minWidth: 200 
      },
      {
        ...keyColumn('requirements', countListColumn({
          getAllSearchableItems: getAllMockRequirements,
          onLinkItem: (item) => handleItemLinked(item, 'Requirement'),
          itemTypeLabel: 'Requirement',
        })), 
        title: 'Linked Requirements', 
        minWidth: 200 
      },
      {
        ...keyColumn('taskTemplates', countListColumn({
          getAllSearchableItems: getAllMockTaskTemplates,
          onLinkItem: (item) => handleItemLinked(item, 'Task Template'),
          itemTypeLabel: 'Task Template',
        })), 
        title: 'Linked Tasks', 
        minWidth: 200 
      },
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
            />
            
            <DataSheetGrid
              value={processedData}
              onChange={handleGridChange}
              columns={columns}
              rowClassName={getRowClassName}
              createRow={() => ({
                id: simpleUUID(),
                name: '' /* Default to empty string */,
                description: '' /* Default to empty string */,
                policyTemplates: [],
                requirements: [],
                taskTemplates: [],
                policyTemplatesLength: 0,
                requirementsLength: 0,
                taskTemplatesLength: 0,
              })}
              duplicateRow={({rowData}) => ({ ...rowData, id: simpleUUID() })}
            />
            
            <CreateControlDialog 
                isOpen={isCreateDialogOpen} 
                onOpenChange={setIsCreateDialogOpen} 
                onControlCreated={() => {
                  setIsCreateDialogOpen(false);
                  router.refresh(); // Consider if this is still needed or if local state updates are sufficient
                }}
            />
        </PageLayout>
    );
} 