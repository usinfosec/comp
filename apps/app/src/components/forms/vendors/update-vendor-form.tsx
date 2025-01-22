"use client";

import { updateVendorSchema } from "@/actions/schema";
import { updateVendorAction } from "@/actions/vendor/update-vendor-action";
import { SelectUser } from "@/components/select-user";
import {
  VendorStatus as Status,
  type VendorStatusType,
} from "@/components/vendor-status";
import { useI18n } from "@/locales/client";
import {
  type User,
  VendorCategory,
  type VendorContact,
  VendorStatus,
  type Vendors,
} from "@bubba/db";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, XCircle } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface UpdateVendorFormProps {
  vendor: Vendors & { VendorContact: VendorContact[] };
  users: User[];
}

export function UpdateVendorForm({ vendor, users }: UpdateVendorFormProps) {
  const t = useI18n();

  const updateVendor = useAction(updateVendorAction, {
    onSuccess: () => {
      toast.success(t("risk.vendor.form.update_vendor_success"));
    },
    onError: () => {
      toast.error(t("risk.vendor.form.update_vendor_error"));
    },
  });

  const form = useForm<z.infer<typeof updateVendorSchema>>({
    resolver: zodResolver(updateVendorSchema),
    defaultValues: {
      id: vendor.id,
      name: vendor.name,
      website: vendor.website,
      description: vendor.description,
      category: vendor.category,
      ownerId: vendor.ownerId ?? undefined,
      status: vendor.status,
      contacts: vendor.VendorContact.map((contact) => ({
        name: contact.name,
        email: contact.email,
        role: contact.role,
      })),
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  const handleRemoveContact = (index: number) => {
    if (fields.length === 1) {
      toast.error(t("vendor.form.min_one_contact_required"));
      return;
    }
    remove(index);
  };

  const onSubmit = (data: z.infer<typeof updateVendorSchema>) => {
    updateVendor.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onOpenChange={() => form.handleSubmit(onSubmit)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("common.assignee.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectUser
                        isLoading={false}
                        onSelect={field.onChange}
                        selectedId={field.value || undefined}
                        users={users}
                      />
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("risk.vendor.form.vendor_status")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "risk.vendor.form.vendor_status_placeholder",
                        )}
                      >
                        <Status status={field.value as VendorStatusType} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(VendorStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          <Status status={status as VendorStatusType} />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <FormLabel>{t("risk.vendor.form.vendor_category")}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "risk.vendor.form.vendor_category_placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(VendorCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {t(`vendor.category.${category}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6">
          <div className="space-y-4">
            <Accordion type="multiple" className="space-y-4">
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={`contact-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>
                        {form.watch(`contacts.${index}.name`) ||
                          t("vendor.form.new_contact")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {form.watch(`contacts.${index}.email`)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
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
                          onClick={() => handleRemoveContact(index)}
                          className="items-center justify-end gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          {t("common.actions.delete")}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", email: "", role: "" })}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("vendor.form.add_contact")}
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={updateVendor.status === "executing"}>
            {updateVendor.status === "executing" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("common.actions.save")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
