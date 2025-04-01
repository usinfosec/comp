"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@bubba/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@bubba/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@bubba/ui/select";
import { useToast } from "@bubba/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateVendorInherentRisk } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/actions/update-vendor-inherent-risk";
import type { VendorInherentRisk } from "@prisma/client";
import type { ActionResponse } from "@/types/actions";

const formSchema = z.object({
	inherentRisk: z.enum(["unknown", "low", "medium", "high"]),
});

type FormValues = z.infer<typeof formSchema>;

interface InherentRiskFormProps {
	vendorId: string;
	initialRisk?: VendorInherentRisk;
	onSuccess?: () => void;
}

export function InherentRiskForm({
	vendorId,
	initialRisk,
	onSuccess,
}: InherentRiskFormProps) {
	const t = useI18n();
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inherentRisk: initialRisk ?? "unknown",
		},
	});

	async function onSubmit(values: FormValues) {
		try {
			const response = await updateVendorInherentRisk({
				vendorId,
				inherentRisk: values.inherentRisk,
			});

			const result = response as unknown as ActionResponse;

			if (!result.success) {
				toast({
					title: t("common.error"),
					description: result.error || t("common.unexpected_error"),
					variant: "destructive",
				});
				return;
			}

			toast({
				title: t("common.success"),
				description: t("vendors.risks.inherent_risk_updated"),
			});

			if (onSuccess) onSuccess();

			router.refresh();
		} catch (error) {
			toast({
				title: t("common.error"),
				description: t("common.unexpected_error"),
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="inherentRisk"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("vendors.risks.inherent_risk")}</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={t("vendors.risks.select_risk")} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="unknown">
										{t("vendors.risks.unknown")}
									</SelectItem>
									<SelectItem value="low">{t("vendors.risks.low")}</SelectItem>
									<SelectItem value="medium">
										{t("vendors.risks.medium")}
									</SelectItem>
									<SelectItem value="high">
										{t("vendors.risks.high")}
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full">
					{t("common.save")}
				</Button>
			</form>
		</Form>
	);
}
