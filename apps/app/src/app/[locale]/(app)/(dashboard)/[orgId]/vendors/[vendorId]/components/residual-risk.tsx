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
import { useState } from "react";

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
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [isOpen, setIsOpen] = useState(true);

	const handleClose = () => setIsOpen(false);

	const handleFormSuccess = () => {
		setIsOpen(false);
		if (onSuccess) onSuccess();
	};

	if (isDesktop) {
		return (
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
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
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
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
