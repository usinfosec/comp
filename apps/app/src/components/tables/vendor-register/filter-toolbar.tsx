"use client";

import { CreateRiskSheet } from "@/components/sheets/create-risk-sheet";
import { CreateVendorSheet } from "@/components/sheets/create-vendor-sheet";
import { useI18n } from "@/locales/client";
import {
  Departments,
  RiskCategory,
  RiskStatus,
  type User,
  VendorStatus,
} from "@bubba/db";
import { Button } from "@bubba/ui/button";
import { cn } from "@bubba/ui/cn";
import { Input } from "@bubba/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { Skeleton } from "@bubba/ui/skeleton";
import { Search, X } from "lucide-react";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { useCallback } from "react";

const vendorStatuses = Object.values(VendorStatus);

type Props = {
  isEmpty?: boolean;
  users: {
    id: string;
    name: string | null;
  }[];
};

const statusTranslationKeys = {
  not_assessed: "common.status.not_assessed",
  in_progress: "common.status.in_progress",
  assessed: "common.status.assessed",
} as const;

export function FilterToolbar({ isEmpty, users }: Props) {
  const t = useI18n();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useQueryState("create-vendor-sheet");

  const [search, setSearch] = useQueryState("search", {
    shallow: false,
    history: "push",
    parse: (value) => value || null,
  });

  const [category, setCategory] = useQueryState("category", {
    shallow: false,
    history: "push",
    parse: (value) => value || null,
  });

  const [status, setStatus] = useQueryState("status", {
    shallow: false,
    history: "push",
    parse: (value) => value || null,
  });

  const [ownerId, setOwnerId] = useQueryState("ownerId", {
    shallow: false,
    history: "push",
    parse: (value) => value || null,
  });

  const handleReset = useCallback(() => {
    startTransition(() => {
      Promise.all([
        setSearch(null),
        setCategory(null),
        setStatus(null),
        setOwnerId(null),
      ]);
    });
  }, [setSearch, setCategory, setStatus, setOwnerId]);

  const hasFilters = search || category || status || ownerId;

  if (isEmpty) {
    return (
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 opacity-20 pointer-events-none blur-[7px]">
        <div className="relative flex-1 md:max-w-sm">
          <Skeleton className={cn("h-10", isEmpty && "animate-none")} />
        </div>

        <div className="md:flex gap-2 md:flex-row md:items-center hidden">
          <Skeleton
            className={cn("h-10 w-[200px]", isEmpty && "animate-none")}
          />
          <Skeleton
            className={cn("h-10 w-[200px]", isEmpty && "animate-none")}
          />
          <Skeleton
            className={cn("h-9 w-[120px]", isEmpty && "animate-none")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("common.filters.search")}
          className="pl-8"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value || null)}
        />
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="sm:flex gap-2 sm:flex-row sm:items-center hidden">
          <Select
            value={status || ""}
            onValueChange={(value) => setStatus(value || null)}
          >
            <SelectTrigger className="w-[200px] min-w-[200px]">
              <SelectValue placeholder={t("common.filters.status")} />
            </SelectTrigger>
            <SelectContent>
              {vendorStatuses.map((stat) => (
                <SelectItem key={stat} value={stat}>
                  {t(
                    statusTranslationKeys[
                      stat.toLowerCase() as keyof typeof statusTranslationKeys
                    ],
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={ownerId || ""}
            onValueChange={(value) => setOwnerId(value || null)}
          >
            <SelectTrigger className="w-[200px] min-w-[200px]">
              <SelectValue
                placeholder={t("common.filters.owner.placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isPending}
          >
            <X className="h-4 w-4 mr-2" />
            {t("common.actions.clear")}
          </Button>
        )}

        <Button
          onClick={() => setOpen("true")}
          variant="outline"
          size="icon"
          className="hidden sm:flex"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <CreateVendorSheet />
    </div>
  );
}
