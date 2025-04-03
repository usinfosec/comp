"use client";

import { useI18n } from "@/locales/client";
import type { User, Vendor } from "@comp/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { UpdateSecondaryFieldsForm } from "./update-secondary-fields-form";

export function SecondaryFields({
	vendor,
	users,
}: {
	vendor: Vendor & { owner: User | null };
	users: User[];
}) {
	const t = useI18n();

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("risk.dashboard.overview")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<UpdateSecondaryFieldsForm vendor={vendor} users={users} />
				</CardContent>
			</Card>
		</div>
	);
}
