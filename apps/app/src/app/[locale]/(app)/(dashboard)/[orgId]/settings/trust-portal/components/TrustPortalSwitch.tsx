"use client";

import { useI18n } from "@/locales/client";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@comp/ui/form";
import { Switch } from "@comp/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { trustPortalSwitchAction } from "../actions/trust-portal-switch";

const trustPortalSwitchSchema = z.object({
    enabled: z.boolean(),
});

export function TrustPortalSwitch({
    enabled,
    slug,
}: {
    enabled: boolean;
    slug: string;
}) {
    const t = useI18n();

    const trustPortalSwitch = useAction(trustPortalSwitchAction, {
        onSuccess: () => {
            toast.success("Trust portal status updated");
        },
        onError: () => {
            toast.error("Failed to update trust portal status");
        },
    });

    const form = useForm<z.infer<typeof trustPortalSwitchSchema>>({
        resolver: zodResolver(trustPortalSwitchSchema),
        defaultValues: {
            enabled: enabled,
        },
    });

    const onSubmit = async (data: z.infer<typeof trustPortalSwitchSchema>) => {
        await trustPortalSwitch.execute(data);
    };

    const onChange = (checked: boolean) => {
        form.setValue("enabled", checked);
        trustPortalSwitch.execute({ enabled: checked });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Trust Portal Configuration</CardTitle>
                        <CardDescription className="space-y-4 flex flex-row justify-between">
                            <div className="max-w-[600px]">
                                Enable the trust portal for your organization.
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="enabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Publish Trust Portal</FormLabel>
                                        <FormDescription>
                                            Enable the trust portal for your organization.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={onChange}
                                            disabled={trustPortalSwitch.status === "executing"}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="text-xs text-muted-foreground">
                            Your trust portal will be live & accessible at https://trust.trycomp.ai/{slug}
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
