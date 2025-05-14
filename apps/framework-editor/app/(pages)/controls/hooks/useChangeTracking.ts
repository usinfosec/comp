import { useState, useMemo, useEffect, useCallback } from 'react';
// Import types from the new types.ts file
import type { ControlsPageGridData, DSGOperation } from '../types'; 
import { createControl, updateControlDetails, deleteControl } from '../actions';
import type { FrameworkEditorControlTemplate } from '@prisma/client';

// Define result types for creation operations to help with type inference
type CreationSuccessResult = { success: true; tempId: string; newId: string; newControl: FrameworkEditorControlTemplate };
type CreationFailureResult = { success: false; tempId: string; error: any };
type CreationOperationResult = CreationSuccessResult | CreationFailureResult;

// GridData type definition, co-located as it's tightly coupled with the hook's data
export type GridData = {
  id: string;
  name: string | null;
  description: string | null;
  policyTemplatesCount: string | null;
  requirementsCount: string | null;
  taskTemplatesCount: string | null;
};

// simpleUUID can remain here or be moved to a general utils file later if used elsewhere
export const simpleUUID = () => crypto.randomUUID();

export const useChangeTracking = (initialData: ControlsPageGridData[]) => {
  const [data, setData] = useState<ControlsPageGridData[]>(initialData);
  const [prevData, setPrevData] = useState<ControlsPageGridData[]>(initialData);

  const createdRowIds = useMemo(() => new Set<string>(), []);
  const updatedRowIds = useMemo(() => new Set<string>(), []);
  const deletedRowIds = useMemo(() => new Set<string>(), []);

  useEffect(() => {
    setData(initialData);
    setPrevData(initialData);
    createdRowIds.clear();
    updatedRowIds.clear();
    deletedRowIds.clear();
  }, [initialData, createdRowIds, updatedRowIds, deletedRowIds]);

  const handleGridChange = useCallback((newValue: ControlsPageGridData[], operations: DSGOperation[]) => {
    setData(currentDataState => {
      let workingNewValue = [...newValue];
      const originalDataForDelete = [...currentDataState];

      operations.forEach(op => {
        if (op.type === 'CREATE') {
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
          originalDataForDelete.slice(op.fromRowIndex, op.toRowIndex).forEach((deletedRow, i) => {
            if (!deletedRow.id) return;
            updatedRowIds.delete(deletedRow.id);
            if (createdRowIds.has(deletedRow.id)) {
              createdRowIds.delete(deletedRow.id);
            } else {
              deletedRowIds.add(deletedRow.id);
              workingNewValue.splice(op.fromRowIndex + keptRowsForDisplay++, 0, originalDataForDelete[op.fromRowIndex + i]);
            }
          });
        }
      });
      return workingNewValue;
    });
  }, [createdRowIds, updatedRowIds, deletedRowIds]);

  const getRowClassName = useCallback(({ rowData }: { rowData: ControlsPageGridData }) => {
    if (!rowData || !rowData.id) return '';
    if (deletedRowIds.has(rowData.id)) return 'row-deleted';
    if (createdRowIds.has(rowData.id)) return 'row-created';
    if (updatedRowIds.has(rowData.id)) return 'row-updated';
    return '';
  }, [createdRowIds, updatedRowIds, deletedRowIds]);

  const handleCommit = useCallback(async () => {
    let workingData = [...data];

    // --- Handle Creations ---
    const creationOps = Array.from(createdRowIds).map(tempId => {
      const row = workingData.find(r => r.id === tempId);
      if (row && row.name) {
        return createControl({ name: row.name, description: row.description })
          .then((newControl: FrameworkEditorControlTemplate) => ({ success: true, tempId, newId: newControl.id, newControl } as CreationSuccessResult))
          .catch(error => {
            console.error(`Failed to create control (tempId: ${tempId}):`, error);
            return { success: false, tempId, error } as CreationFailureResult;
          });
      }
      console.warn(`Skipping creation for row with tempId ${tempId} due to missing data or name.`);
      return Promise.resolve({ success: false, tempId, error: new Error("Missing data or name for creation") } as CreationFailureResult);
    });
    const creationResults = await Promise.allSettled(creationOps);

    // --- Handle Updates (excluding newly created or already deleted items) ---
    const idsToUpdateActually = Array.from(updatedRowIds).filter(id => !createdRowIds.has(id) && !deletedRowIds.has(id));
    const updateOps = idsToUpdateActually.map(id => {
      const row = workingData.find(r => r.id === id);
      if (row && row.name) {
        return updateControlDetails(id, { name: row.name, description: row.description || "" })
          .then(() => ({ success: true, id }))
          .catch(error => {
            console.error(`Failed to update control (id: ${id}):`, error);
            return { success: false, id, error };
          });
      }
      console.warn(`Skipping update for row with id ${id} due to missing data or name.`);
      return Promise.resolve({ success: false, id, error: new Error("Missing data or name for update") });
    });
    const updateResults = await Promise.allSettled(updateOps);

    // --- Handle Deletions ---
    const deletionOps = Array.from(deletedRowIds).map(id => {
      if (createdRowIds.has(id) && 
          !creationResults.some(res => 
            res.status === 'fulfilled' && 
            (res.value as CreationOperationResult).success && 
            (res.value as CreationSuccessResult).tempId === id && 
            (res.value as CreationSuccessResult).newId
          )
      ) {
        // If it was a created item that didn't successfully get a server ID (e.g. creation failed or was skipped, or it's still pending somehow)
        console.log(`Client-side deletion of temporary item: ${id}`);
        return Promise.resolve({ success: true, id, clientSideDelete: true });
      }
      return deleteControl(id)
        .then(() => ({ success: true, id }))
        .catch(error => {
          console.error(`Failed to delete control (id: ${id}):`, error);
          return { success: false, id, error };
        });
    });
    const deletionResults = await Promise.allSettled(deletionOps);

    // --- Consolidate Data and Update State ---
    // 1. Update IDs for successful creations and collect created data
    const serverCreatedRows = new Map<string, ControlsPageGridData>();
    creationResults.forEach(res => {
      if (res.status === 'fulfilled') {
        const creationValue = res.value as CreationOperationResult;
        if (creationValue.success) {
          // Now TypeScript knows creationValue is CreationSuccessResult
          const { tempId, newId } = creationValue;
          const originalRow = workingData.find(r => r.id === tempId);
          if (originalRow) {
            serverCreatedRows.set(newId, { 
                ...originalRow, 
                id: newId,
                // For newly created items, counts are 0 as relations are not established yet.
                policyTemplates: [], 
                requirements: [],
                taskTemplates: [],
            });
          }
          createdRowIds.delete(tempId);
        }
      }
    });

    // 2. Remove successfully updated items from tracking set
    updateResults.forEach(res => {
      if (res.status === 'fulfilled' && res.value.success && res.value.id) {
        updatedRowIds.delete(res.value.id);
      }
    });

    // 3. Prepare final list of data, handling deletions and incorporating server-created items
    const actuallyDeletedIds = new Set<string>();
    deletionResults.forEach(res => {
      if (res.status === 'fulfilled' && res.value.success && res.value.id) {
        actuallyDeletedIds.add(res.value.id);
        deletedRowIds.delete(res.value.id);
        createdRowIds.delete(res.value.id); // If it was created then deleted
        updatedRowIds.delete(res.value.id); // If it was updated then deleted
      }
    });

    // Rebuild workingData: start with existing, filter deleted, then replace temp IDs with server IDs for created items
    let finalProcessedData: ControlsPageGridData[] = [];
    workingData.forEach(row => {
        if (actuallyDeletedIds.has(row.id)) return; // Skip if deleted

        // Check if this row corresponds to a successfully created item (identified by its original tempId)
        let wasSuccessfullyCreated = false;
        for (const res of creationResults) {
            if (res.status === 'fulfilled') {
                const creationValue = res.value as CreationOperationResult;
                if (creationValue.success && creationValue.tempId === row.id && creationValue.newId) {
                    // This row was a temp row that got created. Its data is on serverCreatedRows map.
                    finalProcessedData.push(serverCreatedRows.get(creationValue.newId)!);                    
                    wasSuccessfullyCreated = true;
                    break;
                }
            }
        }
        if (!wasSuccessfullyCreated) {
            finalProcessedData.push(row);
        }
    });

    setData(finalProcessedData);
    setPrevData(finalProcessedData);

    console.log('Commit completed. Remaining dirty items:', {
      created: Array.from(createdRowIds),
      updated: Array.from(updatedRowIds),
      deleted: Array.from(deletedRowIds),
    });
    const newData = data.filter(row => !row.id || !deletedRowIds.has(row.id));
    setData(newData);
    setPrevData(newData);
    createdRowIds.clear();
    updatedRowIds.clear();
    deletedRowIds.clear();
  }, [data, createdRowIds, updatedRowIds, deletedRowIds]);

  const handleCancel = useCallback(() => {
    setData(prevData);
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