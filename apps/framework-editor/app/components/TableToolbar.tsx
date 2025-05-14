'use client';

import React from 'react';
import { Button } from '@comp/ui/button';
import { Input } from '@comp/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@comp/ui/select';
import { SortAsc, SortDesc, Search as SearchIcon } from 'lucide-react';
// Import types from the common types definition file
import type { SortDirection, SortableColumnOption } from '../types/common'; 

export interface TableToolbarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sortColumnKey: string | null; // Generic string for the value of the sort column
  onSortColumnKeyChange: (key: string | null) => void;
  sortDirection: SortDirection;
  onSortDirectionChange: () => void; // Simplified: just toggles
  sortableColumnOptions: SortableColumnOption[];

  showCommitCancel?: boolean;
  isDirty?: boolean;
  onCommit?: () => void;
  onCancel?: () => void;

  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  children?: React.ReactNode; // For additional custom elements in the toolbar
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  searchTerm,
  onSearchTermChange,
  sortColumnKey,
  onSortColumnKeyChange,
  sortDirection,
  onSortDirectionChange,
  sortableColumnOptions,
  showCommitCancel = false,
  isDirty = false,
  onCommit,
  onCancel,
  showCreateButton = false,
  onCreateClick,
  createButtonLabel = 'Create New',
  children
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Left section: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-center flex-grow">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="flex-grow sm:flex-grow-0 sm:w-auto" // Adjust based on Input component needs
          leftIcon={<SearchIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <div className="flex gap-2 items-center">
          <Select 
            value={sortColumnKey ?? '__NONE__'} 
            onValueChange={(value) => onSortColumnKeyChange(value === '__NONE__' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__NONE__">None</SelectItem>
              {sortableColumnOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={onSortDirectionChange}
            disabled={!sortColumnKey}
            title={`Sort direction: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            <span className="sr-only">Toggle sort direction</span>
          </Button>
        </div>
      </div>

      {/* Right section: Action Buttons and Custom Children */}
      <div className="flex gap-2 items-center mt-4 sm:mt-0">
        {showCommitCancel && (
          <>
            <Button 
              onClick={onCommit} 
              disabled={!isDirty}
              variant="default"
            >
              Commit Changes
            </Button>
            <Button 
              onClick={onCancel} 
              disabled={!isDirty}
              variant="outline"
            >
              Cancel
            </Button>
          </>
        )}
        {showCreateButton && (
          <Button onClick={onCreateClick}>
            {createButtonLabel}
          </Button>
        )}
        {children} { /* For any additional elements passed from parent */}
      </div>
    </div>
  );
}; 