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
import { updateVendorResidualRisk } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/actions/update-vendor-residual-risk";
import type { VendorResidualRisk } from "@prisma/client";
import type { ActionResponse } from "@/types/actions";

const formSchema = z.object({
	residualRisk: z.enum(["low", "medium", "high"]),
});

type FormValues = z.infer<typeof formSchema>;

interface ResidualRiskFormProps {
	vendorId: string;
	initialRisk?: VendorResidualRisk;
	onSuccess?: () => void;
}

export function ResidualRiskForm({
	vendorId,
	initialRisk,
	onSuccess,
}: ResidualRiskFormProps) {
	const t = useI18n();
	const { toast } = useToast();
	const router = useRouter();

	// If initialRisk is "unknown", default to "low"
	const safeInitialRisk = initialRisk === "unknown" ? "low" : initialRisk;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			residualRisk: safeInitialRisk ?? "low",
		},
	});

	async function onSubmit(values: FormValues) {
		try {
			const response = await updateVendorResidualRisk({
				vendorId,
				residualRisk: values.residualRisk,
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
				description: t("vendors.risks.residual_risk_updated"),
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
					name="residualRisk"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("vendors.risks.residual_risk")}</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder={t("vendors.risks.select_risk")} />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
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
