"use client";

import { useI18n } from "@/locales/client";
import type { Risk } from "@comp/db/types";
import { RiskMatrixChart } from "./RiskMatrixChart";
import { updateResidualRiskEnumAction } from "@/actions/risk/update-residual-risk-enum-action";

interface ResidualRiskChartProps {
	risk: Risk;
}

export function ResidualRiskChart({ risk }: ResidualRiskChartProps) {
	const t = useI18n();

	return (
		<RiskMatrixChart
			title={t("risk.metrics.residualRisk")}
			description={t("risk.dashboard.residual_risk_description")}
			riskId={risk.id}
			activeLikelihood={risk.residualLikelihood}
			activeImpact={risk.residualImpact}
			saveAction={async ({ id, probability, impact }) => {
				return updateResidualRiskEnumAction({ id, probability, impact });
			}}
		/>
	);
}
