"use client";

import { useI18n } from "@/locales/client";
import type { OrganizationPolicy, Policy, User } from "@bubba/db/types";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Icons } from "@bubba/ui/icons";
import { ArchiveIcon, PencilIcon, ArchiveRestoreIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { PolicyOverviewSheet } from "./sheets/policy-overview-sheet";
import { UpdatePolicyOverview } from "../forms/policies/policy-overview";
import { PolicyArchiveSheet } from "./sheets/policy-archive-sheet";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function PolicyOverview({
	policy,
	users,
}: {
	policy: OrganizationPolicy & {
		policy: Policy;
	};
	users: User[];
}) {
	const t = useI18n();
	const router = useRouter();
	const [open, setOpen] = useQueryState("policy-overview-sheet");
	const [archiveOpen, setArchiveOpen] = useQueryState("archive-policy-sheet");

	return (
		<div className="space-y-4">
			{policy.isArchived && (
				<Alert
					variant="destructive"
					className="bg-muted border-muted-foreground/10 text-foreground"
				>
					<div className="flex items-center gap-2">
						<ArchiveIcon className="h-4 w-4" />
						<div className="font-medium">{t("policies.archive.status")}</div>
					</div>
					<AlertDescription className="mt-1 mb-3 text-sm text-muted-foreground">
						{policy.archivedAt && (
							<>
								{t("policies.archive.archived_on")}{" "}
								{format(new Date(policy.archivedAt), "PPP")}
							</>
						)}
					</AlertDescription>
					<Button
						size="sm"
						variant="outline"
						className="h-8 gap-1 mt-1 text-foreground border-border"
						onClick={() => setArchiveOpen("true")}
					>
						<ArchiveRestoreIcon className="h-3 w-3" />
						{t("policies.archive.restore_confirm")}
					</Button>
				</Alert>
			)}

			<Alert>
				<Icons.Policies className="h-4 w-4" />
				<AlertTitle>
					<div className="flex items-center justify-between gap-2">
						{policy.policy.name}
						<div className="flex gap-2">
							<Button
								size="icon"
								variant="ghost"
								className="p-0 m-0 size-auto"
								onClick={() => setArchiveOpen("true")}
								title={
									policy.isArchived
										? t("policies.archive.restore_tooltip")
										: t("policies.archive.tooltip")
								}
							>
								{policy.isArchived ? (
									<ArchiveRestoreIcon className="h-3 w-3" />
								) : (
									<ArchiveIcon className="h-3 w-3" />
								)}
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="p-0 m-0 size-auto"
								onClick={() => setOpen("true")}
								title={t("policies.edit.tooltip")}
							>
								<PencilIcon className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</AlertTitle>
				<AlertDescription className="mt-4">
					{policy.policy.description}
				</AlertDescription>
			</Alert>

			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center justify-between gap-2">
							{t("policies.overview.title")}
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<UpdatePolicyOverview organizationPolicy={policy} users={users} />
				</CardContent>
			</Card>

			<PolicyOverviewSheet policy={policy} />
			<PolicyArchiveSheet policy={policy} />
		</div>
	);
}
