import { OrgFixForm } from "./components/OrgFixForm";

export default function Page() {
	return (
		<div className="container max-w-2xl mx-auto py-10 space-y-8">
			<h1 className="text-2xl font-bold">Organization Healing Tool</h1>
			<p className="text-muted-foreground">
				Enter an organization ID to check for and fix missing controls,
				policies, and requirements.
			</p>
			<OrgFixForm />
		</div>
	);
}
