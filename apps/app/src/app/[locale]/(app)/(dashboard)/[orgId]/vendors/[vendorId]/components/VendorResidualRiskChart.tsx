"use client";

import { RiskMatrixChart } from "@/components/risks/charts/RiskMatrixChart";
import { useI18n } from "@/locales/client";
import type { Vendor } from "@comp/db/types";
import { updateVendorResidualRisk } from "../actions/update-vendor-residual-risk";

interface ResidualRiskChartProps {
	vendor: Vendor;
}

export function VendorResidualRiskChart({ vendor }: ResidualRiskChartProps) {
	const t = useI18n();

	return (
		<RiskMatrixChart
			title={t("vendors.risks.residual_risk")}
			description={t("vendors.risks.update_residual_risk_description")}
			riskId={vendor.id}
			activeLikelihood={vendor.residualProbability}
			activeImpact={vendor.residualImpact}
			saveAction={async ({ id, probability, impact }) => {
				return updateVendorResidualRisk({ vendorId: id, residualProbability: probability, residualImpact: impact });
			}}
		/>
	);
}
