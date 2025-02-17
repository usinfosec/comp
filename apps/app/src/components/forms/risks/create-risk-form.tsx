"use client";

import { getOrganizationUsersAction } from "@/actions/organization/get-organization-users-action";
import { createRiskAction } from "@/actions/risk/create-risk-action";
import { createRiskSchema } from "@/actions/schema";
import { SelectUser } from "@/components/select-user";
import { useI18n } from "@/locales/client";
import { Departments, RiskCategory } from "@bubba/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bubba/ui/accordion";
import { Button } from "@bubba/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@bubba/ui/form";
import { Input } from "@bubba/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bubba/ui/select";
import { Textarea } from "@bubba/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface User {
  id: string;
  image?: string | null;
  name: string | null;
}

export function CreateRisk() {
  const t = useI18n();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [_, setCreateRiskSheet] = useQueryState("create-risk-sheet");

  useEffect(() => {
    async function loadUsers() {
      const result = await getOrganizationUsersAction();
      if (result?.data?.success && result?.data?.data) {
        setUsers(result.data.data);
      }
      setIsLoadingUsers(false);
    }

    loadUsers();
  }, []);

  const createRisk = useAction(createRiskAction, {
    onSuccess: () => {
      toast.success(t("risk.form.create_risk_success"));
      setCreateRiskSheet(null);
    },
    onError: () => {
      toast.error(t("risk.form.create_risk_error"));
    },
  });

  const form = useForm<z.infer<typeof createRiskSchema>>({
    resolver: zodResolver(createRiskSchema),
    defaultValues: {
      title: "",
      description: "",
      category: RiskCategory.operations,
      department: Departments.admin,
    },
  });

  const onSubmit = (data: z.infer<typeof createRiskSchema>) => {
    createRisk.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
          <div>
            <Accordion type="multiple" defaultValue={["risk"]}>
              <AccordionItem value="risk">
                <AccordionTrigger>
                  {t("risk.form.risk_details")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("risk.form.risk_title")}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoFocus
                              className="mt-3"
                              placeholder={t(
                                "risk.form.risk_title_description",
                              )}
                              autoCorrect="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("risk.form.risk_description")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="mt-3 min-h-[80px]"
                              placeholder={t(
                                "risk.form.risk_description_description",
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("risk.form.risk_category")}</FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "risk.form.risk_category_placeholder",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(RiskCategory).map((category) => {
                                  const formattedCategory = category
                                    .toLowerCase()
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1),
                                    )
                                    .join(" ");
                                  return (
                                    <SelectItem key={category} value={category}>
                                      {formattedCategory}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("risk.form.risk_department")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              {...field}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "risk.form.risk_department_placeholder",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(Departments).map(
                                  (department) => {
                                    const formattedDepartment =
                                      department.toUpperCase();

                                    return (
                                      <SelectItem
                                        key={department}
                                        value={department}
                                      >
                                        {formattedDepartment}
                                      </SelectItem>
                                    );
                                  },
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("common.assignee.label")}</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("common.assignee.placeholder")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectUser
                                  users={users}
                                  isLoading={isLoadingUsers}
                                  onSelect={field.onChange}
                                  selectedId={field.value}
                                />
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              variant="action"
              disabled={createRisk.status === "executing"}
            >
              <div className="flex items-center justify-center">
                {t("common.actions.create")}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
