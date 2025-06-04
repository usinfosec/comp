"use client";

import { RiskMatrixChart } from "@/components/risks/charts/RiskMatrixChart";
import { useI18n } from "@/locales/client";
import type { Vendor } from "@comp/db/types";
import { updateVendorInherentRisk } from "../actions/update-vendor-inherent-risk";

interface InherentRiskChartProps {
	vendor: Vendor;
}

export function VendorInherentRiskChart({ vendor }: InherentRiskChartProps) {
	const t = useI18n();

	return (
		<RiskMatrixChart
			title={t("vendors.risks.inherent_risk")}
			description={t("vendors.risks.update_inherent_risk_description")}
			riskId={vendor.id}
			activeLikelihood={vendor.inherentProbability}
			activeImpact={vendor.inherentImpact}
			saveAction={async ({ id, probability, impact }) => {
				return updateVendorInherentRisk({ vendorId: id, inherentProbability: probability, inherentImpact: impact });
			}}
		/>
	);
}
