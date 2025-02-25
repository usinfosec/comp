"use client";

import { useOrganizationEvidenceTasks } from "../hooks/useEvidenceTasks";
import { DataTable } from "./data-table/data-table";
import { Input } from "@bubba/ui/input";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { useI18n } from "@/locales/client";
import { SkeletonTable } from "./SkeletonTable";
import {
  CheckCircle2,
  Filter,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Building,
  User,
} from "lucide-react";
import { Button } from "@bubba/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@bubba/ui/dropdown-menu";
import { Badge } from "@bubba/ui/badge";
import type { Frequency, Departments } from "@bubba/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import type { EvidenceTaskRow } from "./data-table/types";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";

// Define all available departments from the enum
const ALL_DEPARTMENTS: Departments[] = [
  "admin",
  "gov",
  "hr",
  "it",
  "itsm",
  "qms",
];

// Define all available frequencies from the enum
const ALL_FREQUENCIES: Frequency[] = ["monthly", "quarterly", "yearly"];

export const EvidenceList = () => {
  const t = useI18n();
  const [search, setSearch] = useQueryState("search");
  const [status, setStatus] = useQueryState("status");
  const [frequency, setFrequency] = useQueryState("frequency");
  const [department, setDepartment] = useQueryState("department");
  const [assigneeId, setAssigneeId] = useQueryState("assigneeId");
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [pageSize, setPageSize] = useQueryState("pageSize", {
    defaultValue: "10",
  });

  const currentPage = Number.parseInt(page, 10);
  const currentPageSize = Number.parseInt(pageSize, 10);

  const {
    data: evidenceTasks,
    pagination,
    isLoading,
    error,
  } = useOrganizationEvidenceTasks({
    search,
    status: status as "published" | "draft" | null,
    frequency: frequency as Frequency | null,
    department: department as Departments | null,
    assigneeId,
    page: currentPage,
    pageSize: currentPageSize,
  });

  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value || null);
      // Reset to first page when searching
      setPage("1");
    }, 300),
    [setSearch, setPage]
  );

  console.log({ evidenceTasks, error });

  // We now use the predefined frequencies instead of extracting from data
  const frequencies = useMemo(() => {
    return ALL_FREQUENCIES;
  }, []);

  // We now use the predefined departments instead of extracting from data
  const departments = useMemo(() => {
    return ALL_DEPARTMENTS;
  }, []);

  // Get unique assignees for the dropdown
  const assignees = useMemo(() => {
    if (!evidenceTasks) return [];

    const uniqueAssignees = new Map<
      string,
      { id: string; name: string | null; image: string | null }
    >();

    for (const task of evidenceTasks) {
      // Convert to EvidenceTaskRow to access the assignee property
      const taskWithAssignee = task as unknown as EvidenceTaskRow;
      if (taskWithAssignee.assignee) {
        uniqueAssignees.set(taskWithAssignee.assignee.id, {
          id: taskWithAssignee.assignee.id,
          name: taskWithAssignee.assignee.name,
          image: taskWithAssignee.assignee.image,
        });
      }
    }

    return Array.from(uniqueAssignees.values()).sort((a, b) => {
      return (a.name || "").localeCompare(b.name || "");
    });
  }, [evidenceTasks]);

  // Clear all filters
  const clearFilters = () => {
    setStatus(null);
    setFrequency(null);
    setDepartment(null);
    setAssigneeId(null);
    // Reset to first page when clearing filters
    setPage("1");
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    setPageSize(newSize);
    // Reset to first page when changing page size
    setPage("1");
  };

  // Check if any filters are active
  const hasActiveFilters =
    status !== null ||
    frequency !== null ||
    department !== null ||
    assigneeId !== null;

  if (error) return <div>Error: {error.message}</div>;
  if (!evidenceTasks && !isLoading) return null;

  // Convert the data to the expected format for the DataTable
  const tableData: EvidenceTaskRow[] =
    evidenceTasks?.map((task) => ({
      ...task,
      evidence: {
        name: task.name,
      },
    })) || [];

  // Find the selected assignee name for the badge
  const selectedAssigneeName = assigneeId
    ? tableData.find((task) => task.assignee?.id === assigneeId)?.assignee
        ?.name || "Unknown"
    : null;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Evidence Tasks</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder={t("common.filters.search")}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={search || ""}
            className="max-w-sm"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 px-1 py-0">
                    {(status ? 1 : 0) +
                      (frequency ? 1 : 0) +
                      (department ? 1 : 0) +
                      (assigneeId ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={status === "published"}
                onCheckedChange={() => {
                  setStatus(status === "published" ? null : "published");
                  setPage("1"); // Reset to first page when filtering
                }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>Published</span>
                </div>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={status === "draft"}
                onCheckedChange={() => {
                  setStatus(status === "draft" ? null : "draft");
                  setPage("1"); // Reset to first page when filtering
                }}
              >
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" />
                  <span>Draft</span>
                </div>
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Frequency</DropdownMenuLabel>
              {frequencies.map((freq) => (
                <DropdownMenuCheckboxItem
                  key={freq}
                  checked={frequency === freq}
                  onCheckedChange={() => {
                    setFrequency(frequency === freq ? null : freq);
                    setPage("1"); // Reset to first page when filtering
                  }}
                >
                  {freq}
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
              {departments.map((dept) => (
                <DropdownMenuCheckboxItem
                  key={dept}
                  checked={department === dept}
                  onCheckedChange={() => {
                    setDepartment(department === dept ? null : dept);
                    setPage("1"); // Reset to first page when filtering
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-muted-foreground" />
                    <span>{dept.replace(/_/g, " ").toUpperCase()}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
              {assignees.map((assignee) => (
                <DropdownMenuCheckboxItem
                  key={assignee.id}
                  checked={assigneeId === assignee.id}
                  onCheckedChange={() => {
                    setAssigneeId(
                      assigneeId === assignee.id ? null : assignee.id
                    );
                    setPage("1"); // Reset to first page when filtering
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={assignee.image || undefined}
                        alt={assignee.name || ""}
                      />
                      <AvatarFallback className="text-xs">
                        {assignee.name ? assignee.name.charAt(0) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{assignee.name}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}

              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm font-normal"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Active filter badges */}
          {status && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => {
                setStatus(null);
                setPage("1"); // Reset to first page when removing filter
              }}
            >
              Status: {status === "published" ? "Published" : "Draft"}
              <XCircle size={14} />
            </Badge>
          )}

          {frequency && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => {
                setFrequency(null);
                setPage("1"); // Reset to first page when removing filter
              }}
            >
              Frequency: {frequency}
              <XCircle size={14} />
            </Badge>
          )}

          {department && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => {
                setDepartment(null);
                setPage("1"); // Reset to first page when removing filter
              }}
            >
              Department: {department.replace(/_/g, " ").toUpperCase()}
              <XCircle size={14} />
            </Badge>
          )}

          {assigneeId && selectedAssigneeName && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer"
              onClick={() => {
                setAssigneeId(null);
                setPage("1"); // Reset to first page when removing filter
              }}
            >
              Assignee: {selectedAssigneeName}
              <XCircle size={14} />
            </Badge>
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <>
          <DataTable data={tableData} />

          {/* Pagination UI */}
          {pagination && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * currentPageSize + 1} to{" "}
                {Math.min(currentPage * currentPageSize, pagination.totalCount)}{" "}
                of {pagination.totalCount} items
              </div>

              <div className="flex items-center gap-2">
                <Select value={pageSize} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
