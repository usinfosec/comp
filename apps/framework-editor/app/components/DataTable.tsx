'use client'

import { useMemo, type ElementType } from 'react'
import { useQueryState } from 'nuqs'
import { Input } from "@comp/ui/input"; 
import { Button } from "@comp/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@comp/ui/table";
import { Search, PlusCircle } from 'lucide-react';

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  searchQueryParamName?: string; // Allows multiple tables on a page with different search params
  onCreateClick?: () => void; // Handler for the create button
  createButtonLabel?: string; // Custom label for the create button
  CreateButtonIcon?: ElementType; // Custom icon component for the create button
}

export function DataTable<T extends Record<string, any>>({
  data,
  searchQueryParamName = 'q', // Default query parameter for search
  onCreateClick, // Destructure new props
  createButtonLabel = "Create New", // Default label
  CreateButtonIcon = PlusCircle // Default icon
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useQueryState(searchQueryParamName, {
    defaultValue: ''
  });

  const headers = useMemo(() => {
    if (!data || data.length === 0) return [];
    // Consider filtering out known internal or non-displayable keys if necessary
    return Object.keys(data[0]);
  }, [data]);

  const filteredData = useMemo(() => {
    const term = searchTerm?.toLowerCase() || '';
    if (!term) return data;
    if (!data) return [];

    return data.filter(item =>
      headers.some(header =>
        String(item[header]).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm, headers]);

  if (!data || data.length === 0 && !searchTerm) {
    return <p className="py-4 text-center">No data available.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2 flex-wrap"> {/* Added flex-wrap for responsiveness */}
        <div className="relative flex-grow w-full"> {/* Added min-width */}
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search table..."
            value={searchTerm || ''}
            onChange={e => setSearchTerm(e.target.value || null)} // Set to null to remove from URL if empty
            className="pl-8 w-full"
          />
        </div>
        {onCreateClick && ( // Conditionally render the button if onCreateClick is provided
          <Button variant="outline" className="ml-auto" onClick={onCreateClick}>
            <CreateButtonIcon className="mr-2 h-4 w-4" />
            {createButtonLabel}
          </Button>
        )}
      </div>
      {filteredData && filteredData.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <TableHead key={header}>
                  {/* Capitalize first letter for display */}
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.id || `row-${index}`}>
                {headers.map(header => (
                  <TableCell key={`${item.id || index}-${header}`}>
                    {String(item[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="py-4 text-center">No results found for "{searchTerm}".</p>
      )}
    </div>
  );
} 