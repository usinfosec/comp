"use client";

import { updateOrganizationWebsiteAction } from "@/actions/organization/update-organization-website-action";
import { organizationWebsiteSchema } from "@/actions/schema";
import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@comp/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@comp/ui/form";
import { Input } from "@comp/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function UpdateOrganizationWebsite({
    organizationWebsite,
}: {
    organizationWebsite: string;
}) {
    const t = useI18n();
    const updateOrganizationWebsite = useAction(updateOrganizationWebsiteAction, {
        onSuccess: () => {
            toast.success(t("settings.general.org_website_updated"));
        },
        onError: () => {
            toast.error(t("settings.general.org_website_error"));
        },
    });

    const form = useForm<z.infer<typeof organizationWebsiteSchema>>({
        resolver: zodResolver(organizationWebsiteSchema),
        defaultValues: {
            website: organizationWebsite,
        },
    });

    const onSubmit = (data: z.infer<typeof organizationWebsiteSchema>) => {
        updateOrganizationWebsite.execute(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings.general.org_website")}</CardTitle>

                        <CardDescription>
                            <div className="max-w-[600px]">
                                {t("settings.general.org_website_description")}
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="md:max-w-[300px]"
                                            autoComplete="off"
                                            autoCapitalize="none"
                                            autoCorrect="off"
                                            spellCheck="false"
                                            maxLength={255}
                                            placeholder="https://example.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="text-xs text-muted-foreground">
                            {t("settings.general.org_website_tip")}
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                updateOrganizationWebsite.status === "executing"
                            }
                        >
                            {updateOrganizationWebsite.status === "executing" ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : null}
                            {t("common.actions.save")}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
