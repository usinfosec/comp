"use client";

import { useI18n } from "@/locales/client";
import type { Framework, OrganizationFramework } from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import Link from "next/link";
import { useMemo } from "react";
import type { OrganizationControlType } from "../overview/frameworks/[frameworkId]/components/table/FrameworkControlsTableColumns";
import { useOrganizationCategories } from "../overview/frameworks/[frameworkId]/hooks/useOrganizationCategories";

interface Props {
	frameworks: (OrganizationFramework & {
		framework: Framework;
	})[];
}

// Helper function to check if a control is compliant based on its requirements
const isControlCompliant = (control: OrganizationControlType) => {
	// First, check if the control has the direct status of "compliant"
	if (control.status === "compliant") {
		return true;
	}

	// Then check the requirements if they exist
	const requirements = control.requirements;

	if (!requirements || requirements.length === 0) {
		return false;
	}

	const totalRequirements = requirements.length;
	const completedRequirements = requirements.filter((req) => {
		let isCompleted = false;

		switch (req.type) {
			case "policy":
				isCompleted = req.organizationPolicy?.status === "published";
				break;
			case "file":
				isCompleted = !!req.fileUrl;
				break;
			case "evidence":
				isCompleted = req.organizationEvidence?.published === true;
				break;
			default:
				isCompleted = req.published || false;
		}

		return isCompleted;
	}).length;

	return completedRequirements === totalRequirements;
};

// Individual FrameworkCard component
function FrameworkCard({
	framework,
}: { framework: OrganizationFramework & { framework: Framework } }) {
	const { data: organizationCategories, isLoading } = useOrganizationCategories(
		framework.framework.id,
	);

	// Transform the organizationCategories into controls
	const controls = useMemo(() => {
		if (!organizationCategories) return [];

		return organizationCategories.flatMap((category) =>
			category.organizationControl.map((control) => ({
				code: control.control.code,
				description: control.control.description,
				name: control.control.name,
				status: control.status,
				id: control.id,
				frameworkId: framework.framework.id,
				category: category.name,
				requirements: control.OrganizationControlRequirement,
			})),
		);
	}, [
		organizationCategories,
		framework.framework.id,
	]) as OrganizationControlType[];

	// Calculate framework compliance based on controls
	const compliance = useMemo(() => {
		if (isLoading || controls.length === 0) return 0;

		const totalControls = controls.length;
		const compliantControls = controls.filter(isControlCompliant).length;

		return totalControls > 0
			? Math.round((compliantControls / totalControls) * 100)
			: 0;
	}, [controls, isLoading]);

	if (isLoading) {
		return (
			<div className="flex items-start gap-4 rounded-lg p-4 animate-pulse bg-zinc-800/20">
				<div className="flex-shrink-0 h-12 w-12 rounded-full bg-zinc-800/40" />
				<div className="flex-1 space-y-2">
					<div className="h-5 w-2/3 bg-zinc-800/40 rounded" />
					<div className="h-2 bg-zinc-800/40 rounded" />
				</div>
			</div>
		);
	}

	return (
		<Link
			href={`/overview/frameworks/${framework.framework.id}`}
			className="flex items-start gap-4 rounded-lg p-4 hover:bg-zinc-800/40 transition-colors duration-200"
		>
			<div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
				<div className="text-lg font-bold text-zinc-400">
					{framework.framework.name.substring(0, 2).toUpperCase()}
				</div>
			</div>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">{framework.framework.name}</h3>
					<span className="text-sm font-medium text-muted-foreground">
						{compliance}% Compliant
					</span>
				</div>
				<Progress
					value={compliance}
					className="h-2 bg-zinc-800 [&>div]:bg-emerald-500"
				/>
			</div>
		</Link>
	);
}

// Main component
export function RequirementStatus({ frameworks }: Props) {
	const t = useI18n();
	const isLoading = !frameworks;

	return (
		<Card className="border border-border bg-background">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t("frameworks.title")}</CardTitle>
				<Link href="/overview/frameworks" className="text-sm hover:underline">
					<span className="text-emerald-500">View All</span>
				</Link>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
						<p className="mt-4 text-sm text-muted-foreground">
							Loading compliance data...
						</p>
					</div>
				) : frameworks.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<p className="text-sm text-muted-foreground">
							{t("frameworks.overview.empty.description")}
						</p>
					</div>
				) : (
					<div className="space-y-8">
						{/* Framework List */}
						<div className="space-y-6">
							{frameworks.map((framework) => (
								<FrameworkCard
									key={framework.framework.id}
									framework={framework}
								/>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
