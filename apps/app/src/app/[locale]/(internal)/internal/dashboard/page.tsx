"use client";

import { EvidenceCard } from "./components/EvidenceCard";
import { OrganizationsCard } from "./components/OrganizationsCard";
import { PoliciesCard } from "./components/PoliciesCard";
import { UsersCard } from "./components/UsersCard";

export default function Page() {
	return (
		<div className="space-y-4 p-4">
			<div className="grid gap-4 grid-cols-1">
				<OrganizationsCard />
			</div>
			<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
				<EvidenceCard />
				<PoliciesCard />
				<UsersCard />
			</div>
		</div>
	);
}
