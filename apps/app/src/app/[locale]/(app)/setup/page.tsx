import { Onboarding } from "@/components/forms/create-organization-form";
import { frameworks } from "@bubba/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Organization Setup | Comp AI",
};

export default async function Page() {
	return <Onboarding frameworks={Object.values(frameworks)} />;
}
