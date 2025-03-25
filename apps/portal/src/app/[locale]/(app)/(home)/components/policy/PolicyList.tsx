"use client";

import type { OrganizationPolicy, Policy } from "@bubba/db/types";
import { PolicyContainer } from "./PolicyContainer";
import type { Session } from "@/app/lib/auth";

interface PolicyListProps {
	policies: (OrganizationPolicy & { policy: Policy })[];
	user: Session["user"];
}

export function PolicyList({ policies, user }: PolicyListProps) {
	return (
		<div className="w-full max-w-[1400px] mx-auto">
			<PolicyContainer policies={policies} user={user} />
		</div>
	);
}
