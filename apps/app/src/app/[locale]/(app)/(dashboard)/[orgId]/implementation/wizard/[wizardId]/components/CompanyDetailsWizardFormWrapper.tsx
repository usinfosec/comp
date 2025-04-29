"use client";

import { CompanyDetails } from "../../../lib/models/CompanyDetails";
import { CompanyDetailsWizardForm } from "./CompanyDetailsWizardForm";
import PageWithBreadcrumb from "@/components/pages/PageWithBreadcrumb";
import { useParams } from "next/navigation";

export default function CompanyDetailsWizardFormWrapper({
	parsedData,
}: { parsedData: CompanyDetails }) {
	const { orgId } = useParams<{ orgId: string }>();

	return (
		<PageWithBreadcrumb
			breadcrumbs={[
				{
					label: "Implementation",
					current: false,
					href: `/${orgId}/implementation`,
				},
				{ label: "Company Details", current: true },
			]}
		>
			<CompanyDetailsWizardForm parsedData={parsedData} />
		</PageWithBreadcrumb>
	);
}
