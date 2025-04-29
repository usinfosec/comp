import { db } from "@comp/db";
import { Metadata } from "next";
import { CompanyDetails } from "../../lib/models/CompanyDetails";
import CompanyDetailsWizardFormWrapper from "./components/CompanyDetailsWizardFormWrapper";
import {
	WIZARD_ID_TO_CLASS,
	WIZARD_ID_TO_DB_COLUMN,
	WizardIds,
} from "./types/companyDetails";

export const metadata: Metadata = {
	title: "Wizard",
	description: "Fill out the wizard information for your checklist item.",
};

const WIZARD_ID_TO_FORM = {
	[WizardIds.CompanyDetails]: ({
		parsedData,
	}: { parsedData: CompanyDetails }) => (
		<CompanyDetailsWizardFormWrapper parsedData={parsedData} />
	),
} as const;

export default async function WizardPage({
	params,
}: { params: Promise<{ orgId: string; wizardId: string }> }) {
	const { orgId, wizardId } = await params;
	const WizardForm =
		WIZARD_ID_TO_FORM[wizardId as keyof typeof WIZARD_ID_TO_FORM];

	const dbColumn =
		WIZARD_ID_TO_DB_COLUMN[wizardId as keyof typeof WIZARD_ID_TO_DB_COLUMN];

	const onboarding = await db.onboarding.findFirst({
		where: {
			organizationId: orgId,
		},
	});

	const data = onboarding?.[dbColumn];
	const DataClass =
		WIZARD_ID_TO_CLASS[wizardId as keyof typeof WIZARD_ID_TO_CLASS];
	const parsedData = DataClass ? new DataClass(data) : undefined;

	return (
		WizardForm &&
		parsedData && <WizardForm parsedData={{ ...parsedData }} />
	);
}
