"use client";

import { OrganizationsCard } from "./components/OrganizationsCard";
import { PoliciesCard } from "./components/PoliciesCard";
import { TaskCard } from "./components/TaskCard";
import { UsersCard } from "./components/UsersCard";

export default function Page() {
	return (
		<div className="space-y-4 p-4">
			{/* <FullScreenNumberAnimation total={organizationsData?.allTimeTotal ?? 0} /> */}
			<div className="grid gap-4 grid-cols-1">
				<OrganizationsCard />
			</div>
			<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
				<PoliciesCard />
				<UsersCard />
				<TaskCard />
			</div>
		</div>
	);
}
