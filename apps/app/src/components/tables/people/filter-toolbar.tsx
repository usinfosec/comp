"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useI18n } from "@/locales/client";
import { Input } from "@bubba/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { Button } from "@bubba/ui/button";
import { Plus, Search, X } from "lucide-react";
import type { Role } from "@prisma/client";
import { useQueryState } from "nuqs";
import { InviteUserSheet } from "@/components/sheets/invite-user-sheet";

const ROLES: Role[] = ["member", "admin"];

interface FilterToolbarProps {
  isEmpty?: boolean;
}

export function FilterToolbar({ isEmpty }: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useI18n();
  const [open, setOpen] = useQueryState("invite-user-sheet");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const search = searchParams?.get("search") ?? "";
  const role = searchParams?.get("role") as Role | null;

  return (
    <div className="sticky top-0 z-10 -mx-6 mb-4 w-[calc(100%+48px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex flex-col gap-4 border-b px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder={t("people.filters.search")}
              className="h-8 w-[150px] lg:w-[250px]"
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                router.push(
                  `${pathname}?${createQueryString({
                    search: value || null,
                    page: null,
                  })}`
                );
              }}
            />
            <Select
              value={role ?? undefined}
              onValueChange={(value) => {
                router.push(
                  `${pathname}?${createQueryString({
                    role: value || null,
                    page: null,
                  })}`
                );
              }}
            >
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder={t("people.filters.role")} />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replace(/_/g, " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(search || role) && (
              <Button
                variant="ghost"
                className="h-8 px-2 lg:px-3"
                onClick={() => {
                  router.push(pathname);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                {t("people.actions.clear")}
              </Button>
            )}
          </div>
          <Button
            onClick={() => setOpen("true")}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>{t("people.actions.invite")}</span>
          </Button>
        </div>
      </div>

      <InviteUserSheet />
    </div>
  );
}
