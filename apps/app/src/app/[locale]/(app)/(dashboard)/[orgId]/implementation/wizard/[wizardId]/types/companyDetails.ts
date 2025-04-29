import { CompanyDetails } from "../../../lib/models/CompanyDetails";
import { CompanyDetailsWizardForm } from "../components/CompanyDetailsWizardForm";

export enum WizardIds {
	CompanyDetails = "company-details",
}

export const WIZARD_ID_TO_DB_COLUMN = {
	[WizardIds.CompanyDetails]: "companyDetails",
} as const;

export const WIZARD_ID_TO_CLASS = {
	[WizardIds.CompanyDetails]: CompanyDetails,
} as const;
