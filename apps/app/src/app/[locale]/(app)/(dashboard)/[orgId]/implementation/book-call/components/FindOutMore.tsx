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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@comp/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import MultipleSelector, {
    Option as MultipleSelectorOption,
} from "@comp/ui/multiple-selector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@comp/ui/select";
import { Button } from "@comp/ui/button";
import { useAction } from "next-safe-action/hooks";
import { bookCallAction } from "../actions/book-a-call";
import { getCalApi } from "@calcom/embed-react";
import { Link, Loader2 } from "lucide-react";
import { useState } from "react";

const findOutMoreSchema = z.object({
    frameworks: z.array(z.string()),
    role: z.string(),
    employeeCount: z.string(),
    lookingFor: z.string(),
    timeline: z.string(),
});

const defaultFrameworkOptions = [
    { value: "SOC 2", label: "SOC 2" },
    { value: "ISO 27001", label: "ISO 27001" },
    { value: "GDPR", label: "GDPR" },
    { value: "HIPAA", label: "HIPAA" },
];

const defaultRoleOptions = [
    { value: "Founder/CEO/CTO", label: "Founder/CEO/CTO" },
    { value: "CISO", label: "CISO" },
    { value: "Head of Engineering", label: "Head of Engineering" },
    { value: "Head of Product", label: "Head of Product" },
    { value: "Head of Sales", label: "Head of Sales" },
    { value: "Other", label: "Other" },
];

const employeeOptions = [
    { value: "1-10", label: "1-10" },
    { value: "11-50", label: "11-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "500+", label: "500+" },
];

const lookingForOptions = [
    {
        value: "Curious about how to get compliant with frameworks",
        label: "Curious about how to get compliant with frameworks",
    },
    {
        value: "I want to self host Comp AI and do it myself",
        label: "I want to self host Comp AI and do it myself",
    },
    {
        value: "Actively looking to buy a compliance solution",
        label: "Actively looking to buy a compliance solution",
    },
    {
        value: "Actively looking to switch from another compliance solution",
        label: "Actively looking to switch from another compliance solution",
    },
];
const timelineOptions = [
    { value: "ASAP", label: "ASAP" },
    { value: "1-2 weeks", label: "1-2 weeks" },
    { value: "1 month", label: "1 month" },
    { value: "3+ months", label: "3+ months" },
    { value: "Just curious", label: "Just curious" },
];

export function FindOutMoreForm({
    organizationName,
    isBooked,
    companyBookingDetails,
}: {
    organizationName: string;
    isBooked: boolean;
    companyBookingDetails: z.infer<typeof findOutMoreSchema>;
}) {
    const [isBooking, setIsBooking] = useState(false);
    const [booked, setIsBooked] = useState(isBooked);

    const form = useForm<z.infer<typeof findOutMoreSchema>>({
        resolver: zodResolver(findOutMoreSchema),
        defaultValues: {
            frameworks: companyBookingDetails.frameworks || undefined,
            role: companyBookingDetails.role || undefined,
            employeeCount: companyBookingDetails.employeeCount || undefined,
            lookingFor: companyBookingDetails.lookingFor || undefined,
            timeline: companyBookingDetails.timeline || undefined,
        },
    });

    const bookCall = useAction(bookCallAction, {
        onSuccess: async () => {
            setIsBooking(true);
            setIsBooked(true);
            const cal = await getCalApi({ namespace: "meet-us" });
            cal("modal", {
                calLink: "team/compai/meet-us",
                config: { layout: "month_view", hideEventTypeDetails: "false" },

            });
        },
    });

    const onSubmit = async (data: z.infer<typeof findOutMoreSchema>) => {
        await bookCall.execute(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Find out more about Comp AI</CardTitle>
                        <CardDescription>
                            Let us figure out the best way to help you get
                            compliant with the frameworks you're looking for.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!isBooked && !booked && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="frameworks"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What frameworks do you want to be
                                                    compliant with?
                                                </FormLabel>
                                                <FormControl>
                                                    <MultipleSelector
                                                        className="bg-background"
                                                        options={[
                                                            ...defaultFrameworkOptions,
                                                            ...(field.value || [])
                                                                .filter(
                                                                    (v: string) =>
                                                                        !defaultFrameworkOptions.some(
                                                                            (opt) =>
                                                                                opt.value ===
                                                                                v,
                                                                        ),
                                                                )
                                                                .map((v: string) => ({
                                                                    value: v,
                                                                    label: v,
                                                                })),
                                                        ].sort((a, b) =>
                                                            a.label.localeCompare(
                                                                b.label,
                                                            ),
                                                        )}
                                                        value={(field.value || []).map(
                                                            (v: string) => {
                                                                const found =
                                                                    defaultFrameworkOptions.find(
                                                                        (opt) =>
                                                                            opt.value ===
                                                                            v,
                                                                    );
                                                                return found
                                                                    ? {
                                                                        value: found.value,
                                                                        label: found.label,
                                                                    }
                                                                    : {
                                                                        value: v,
                                                                        label: v,
                                                                    };
                                                            },
                                                        )}
                                                        placeholder="Select frameworks"
                                                        onChange={(
                                                            opts: MultipleSelectorOption[],
                                                        ) =>
                                                            field.onChange(
                                                                opts.map(
                                                                    (
                                                                        o: MultipleSelectorOption,
                                                                    ) => o.value,
                                                                ),
                                                            )
                                                        }
                                                        creatable
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What's your role at{" "}
                                                    {organizationName}?
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={
                                                            field.value as string
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="role"
                                                            className="bg-background"
                                                        >
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {defaultRoleOptions.map(
                                                                (option: {
                                                                    value: string;
                                                                    label: string;
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {option.label}
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
                                        name="employeeCount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    How many employees does{" "}
                                                    {organizationName} have?
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={
                                                            field.value as string
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="employeeCount"
                                                            className="bg-background"
                                                        >
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {employeeOptions.map(
                                                                (option: {
                                                                    value: string;
                                                                    label: string;
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {option.label}
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
                                        name="lookingFor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What are you looking for?
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={
                                                            field.value as string
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="lookingFor"
                                                            className="bg-background"
                                                        >
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {lookingForOptions.map(
                                                                (option: {
                                                                    value: string;
                                                                    label: string;
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {option.label}
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
                                        name="timeline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    What's your timeline?
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={
                                                            field.value as string
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="timeline"
                                                            className="bg-background"
                                                        >
                                                            <SelectValue placeholder="Select..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timelineOptions.map(
                                                                (option: {
                                                                    value: string;
                                                                    label: string;
                                                                }) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option.value
                                                                        }
                                                                        value={
                                                                            option.value
                                                                        }
                                                                    >
                                                                        {option.label}
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
                                </>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        {isBooked || booked ? (
                            <Button type="button" onClick={async () => {
                                const cal = await getCalApi({ namespace: "meet-us" });
                                cal("modal", {
                                    calLink: "team/compai/meet-us",
                                    config: { layout: "month_view", hideEventTypeDetails: "false" },

                                });
                            }}>
                                Book a call
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={bookCall.status === "executing"}
                            >
                                {bookCall.status === "executing" ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : null}
                                {isBooked || booked ? "Book a call" : "Submit"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
