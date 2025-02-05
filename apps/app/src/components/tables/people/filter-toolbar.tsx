"use client";

import { InviteUserSheet } from "@/components/sheets/invite-user-sheet";
import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Input } from "@bubba/ui/input";
import { Plus, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useState, useTransition, useEffect } from "react";
import { useDebounce } from "use-debounce";

interface FilterToolbarProps {
  isEmpty?: boolean;
}

export function FilterToolbar({ isEmpty }: FilterToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useI18n();
  const [open, setOpen] = useQueryState("invite-user-sheet");
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(
    searchParams?.get("search") ?? ""
  );

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

  const [debouncedValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          search: debouncedValue || null,
          page: null,
        })}`
      );
    });
  }, [debouncedValue, createQueryString, pathname, router]);

  return (
    <div className="sticky top-0 z-10 -mx-6 mb-4 w-[calc(100%+48px)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="flex flex-col gap-4 border-b px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder={t("people.filters.search")}
              className="h-8 w-[150px] lg:w-[250px]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <Button
                variant="ghost"
                className="h-8 px-2 lg:px-3"
                onClick={() => {
                  setInputValue("");
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
