"use client";

import { getOrganizationUsersAction } from "@/actions/organization/get-organization-users-action";
import { createVendorSchema } from "@/actions/schema";
import { createVendorAction } from "@/actions/vendor/create-vendor-action";
import { SelectUser } from "@/components/select-user";
import { useI18n } from "@/locales/client";
import { VendorCategory } from "@bubba/db";
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
import { ArrowRightIcon, PlusCircle, Trash2, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface User {
  id: string;
  image?: string | null;
  name: string | null;
}

export function CreateVendor() {
  const t = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [_, setCreateVendorSheet] = useQueryState("create-vendor-sheet");

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

  const createVendor = useAction(createVendorAction, {
    onSuccess: () => {
      toast.success(t("risk.vendor.form.create_vendor_success"));
      setCreateVendorSheet(null);
    },
    onError: () => {
      toast.error(t("risk.vendor.form.create_vendor_error"));
    },
  });

  const form = useForm<z.infer<typeof createVendorSchema>>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
      category: VendorCategory.cloud,
      contacts: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const onSubmit = (data: z.infer<typeof createVendorSchema>) => {
    createVendor.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="h-[calc(100vh-250px)] scrollbar-hide overflow-auto">
          <div>
            <Accordion type="multiple" defaultValue={["vendor"]}>
              <AccordionItem value="vendor">
                <AccordionTrigger>
                  {t("risk.vendor.form.vendor_details")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("risk.vendor.form.vendor_name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoFocus
                              className="mt-3"
                              placeholder={t(
                                "risk.vendor.form.vendor_name_placeholder",
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
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("risk.vendor.form.vendor_website")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="mt-3"
                              placeholder={t(
                                "risk.vendor.form.vendor_website_placeholder",
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
                            {t("risk.vendor.form.vendor_description")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="mt-3 min-h-[80px]"
                              placeholder={t(
                                "risk.vendor.form.vendor_description_placeholder",
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
                          <FormLabel>
                            {t("vendor.form.vendor_category")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "vendor.form.vendor_category_placeholder",
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(VendorCategory).map(
                                  (category) => (
                                    <SelectItem key={category} value={category}>
                                      {t(`vendor.category.${category}`)}
                                    </SelectItem>
                                  ),
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
                              value={field.value || undefined}
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
                                  selectedId={field.value || undefined}
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
              <AccordionItem value="contacts">
                <AccordionTrigger>{t("vendor.form.contacts")}</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="contacts"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {fields.map((field, index) => (
                            <div key={field.id} className="space-y-4">
                              <FormField
                                control={form.control}
                                name={`contacts.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t("vendor.form.contact_name")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`contacts.${index}.email`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t("vendor.form.contact_email")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="email" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`contacts.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t("vendor.form.contact_role")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="destructive"
                                  onClick={() => remove(index)}
                                  className="mt-4 items-center justify-end gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  {t("common.actions.delete")}
                                </Button>
                              </div>
                            </div>
                          ))}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              append({ name: "", email: "", role: "" })
                            }
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("vendor.form.add_contact")}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={createVendor.status === "executing"}
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
