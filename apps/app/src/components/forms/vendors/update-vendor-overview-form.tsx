"use client";

import { updateVendorSchema } from "@/actions/schema";
import { updateVendorAction } from "@/actions/vendor/update-vendor-action";
import { useI18n } from "@/locales/client";
import type { Vendors } from "@bubba/db";
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
import { Textarea } from "@bubba/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface UpdateVendorOverviewFormProps {
  vendor: Vendors;
}

export function UpdateVendorOverviewForm({
  vendor,
}: UpdateVendorOverviewFormProps) {
  const t = useI18n();
  const [_, setOpen] = useQueryState("vendor-overview-sheet");

  const updateVendor = useAction(updateVendorAction, {
    onSuccess: () => {
      toast.success(t("risk.vendor.form.update_vendor_success"));
      setOpen(null);
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
      status: vendor.status,
      ownerId: vendor.ownerId ?? undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof updateVendorSchema>) => {
    updateVendor.execute(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("risk.vendor.form.vendor_name")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    className="mt-3"
                    placeholder={t("risk.vendor.form.vendor_name_placeholder")}
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
                <FormLabel>{t("risk.vendor.form.vendor_website")}</FormLabel>
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
        </div>
        <div className="flex justify-end mt-8">
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
