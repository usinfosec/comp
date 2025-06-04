"use client";

import { useI18n } from "@/locales/client";
import type { Risk } from "@comp/db/types";
import { RiskMatrixChart } from "./RiskMatrixChart";
import { updateInherentRiskAction } from "@/actions/risk/update-inherent-risk-action";

interface InherentRiskChartProps {
	risk: Risk;
}

export function InherentRiskChart({ risk }: InherentRiskChartProps) {
	const t = useI18n();

	return (
		<RiskMatrixChart
			title={t("risk.metrics.inherentRisk")}
			description={t("risk.dashboard.inherent_risk_description")}
			riskId={risk.id}
			activeLikelihood={risk.likelihood}
			activeImpact={risk.impact}
			saveAction={async ({ id, probability, impact }) => {
				return updateInherentRiskAction({ id, probability, impact });
			}}
		/>
	);
}
