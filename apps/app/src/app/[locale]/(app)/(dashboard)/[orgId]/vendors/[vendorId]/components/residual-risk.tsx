"use client";

import { useI18n } from "@/locales/client";
import { Button } from "@comp/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@comp/ui/drawer";
import { useMediaQuery } from "@comp/ui/hooks";
import { ScrollArea } from "@comp/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@comp/ui/sheet";
import { X } from "lucide-react";
import { ResidualRiskForm } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/forms/risks/residual-risk-form";
import type { Vendor } from "@comp/db/types";
import { useQueryState } from "nuqs";
import { useRouter, useSearchParams } from "next/navigation";

export function ResidualRiskSheet({
	vendorId,
	initialRisk,
	onSuccess,
}: {
	vendorId: string;
	initialRisk?: Vendor;
	onSuccess?: () => void;
}) {
	const t = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [open, setOpen] = useQueryState("residual-risk-sheet");
	const isOpen = open === "true";

	const handleClose = () => {
		setOpen(null);

		// Create new URLSearchParams without the residual-risk-sheet parameter
		const params = new URLSearchParams(searchParams);
		params.delete("residual-risk-sheet");

		// Create the new URL path with the updated query parameters
		const newPath =
			window.location.pathname +
			(params.toString() ? `?${params.toString()}` : "");

		// Update the URL without refreshing the page
		router.replace(newPath);
	};

	const handleFormSuccess = () => {
		setOpen(null);

		// Remove query params on success
		const params = new URLSearchParams(searchParams);
		params.delete("residual-risk-sheet");

		const newPath =
			window.location.pathname +
			(params.toString() ? `?${params.toString()}` : "");

		router.replace(newPath);

		if (onSuccess) onSuccess();
	};

	if (isDesktop) {
		return (
			<Sheet
				open={isOpen}
				onOpenChange={(value) => (value ? setOpen("true") : handleClose())}
			>
				<SheetContent stack>
					<SheetHeader className="mb-8">
						<div className="flex justify-between items-center flex-row">
							<SheetTitle>{t("vendors.risks.update_residual_risk")}</SheetTitle>
							<Button
								size="icon"
								variant="ghost"
								className="p-0 m-0 size-auto hover:bg-transparent"
								onClick={handleClose}
							>
								<X className="h-5 w-5" />
							</Button>
						</div>
						<SheetDescription>
							{t("vendors.risks.update_residual_risk_description")}
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
						<ResidualRiskForm
							vendorId={vendorId}
							initialProbability={initialRisk?.residualProbability}
							initialImpact={initialRisk?.residualImpact}
							onSuccess={handleFormSuccess}
						/>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Drawer
			open={isOpen}
			onOpenChange={(value) => (value ? setOpen("true") : handleClose())}
		>
			<DrawerTitle hidden>
				{t("vendors.risks.update_residual_risk")}
			</DrawerTitle>
			<DrawerContent className="p-6">
				<ResidualRiskForm
					vendorId={vendorId}
					initialProbability={initialRisk?.residualProbability}
					initialImpact={initialRisk?.residualImpact}
					onSuccess={handleFormSuccess}
				/>
			</DrawerContent>
		</Drawer>
	);
}
