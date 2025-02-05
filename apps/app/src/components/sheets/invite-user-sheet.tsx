"use client";

import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import { Input } from "@bubba/ui/input";
import { Label } from "@bubba/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@bubba/ui/sheet";
import { toast } from "sonner";
import { useState } from "react";
import type { Departments } from "@prisma/client";
import { createEmployeeAction } from "@/actions/people/create-employee-action";
import type { ActionResponse } from "@/actions/types";

const DEPARTMENTS: Departments[] = [
  "none",
  "admin",
  "gov",
  "hr",
  "it",
  "itsm",
  "qms",
];

export function InviteUserSheet() {
  const router = useRouter();
  const t = useI18n();
  const [open, setOpen] = useQueryState("invite-user-sheet");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState<Departments>("none");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = (await createEmployeeAction({
        name,
        email: email.trim(),
        department,
      })) as ActionResponse;

      if (result?.success) {
        toast.success(t("people.invite.success"));
        setOpen(null);
        router.refresh();
      } else {
        toast.error(result?.error || t("people.invite.error"));
      }
    } catch (error) {
      toast.error(t("errors.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet
      open={open === "true"}
      onOpenChange={(open) => setOpen(open ? "true" : null)}
    >
      <SheetContent>
        <form onSubmit={handleSubmit}>
          <SheetHeader>
            <SheetTitle>{t("people.invite.title")}</SheetTitle>
            <SheetDescription>
              {t("people.invite.description")}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("people.invite.name.label")}</Label>
              <Input
                id="name"
                placeholder={t("people.invite.name.placeholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">{t("people.invite.email.label")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("people.invite.email.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">
                {t("people.invite.department.label")}
              </Label>
              <Select
                value={department}
                onValueChange={(value) => setDepartment(value as Departments)}
              >
                <SelectTrigger id="department">
                  <SelectValue
                    placeholder={t("people.invite.department.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading
                ? t("people.invite.submit")
                : t("people.invite.submit")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
