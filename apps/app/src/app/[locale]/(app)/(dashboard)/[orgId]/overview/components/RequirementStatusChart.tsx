"use client";

import { useI18n } from "@/locales/client";
import { Framework } from "@bubba/data";
import type { FrameworkInstance } from "@bubba/db/types";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import Link from "next/link";
import { useParams } from "next/navigation";

interface FrameworkWithCompliance {
	framework: FrameworkInstance & {
		framework: Framework;
	};
	compliance: number;
}

interface Props {
	frameworks: (FrameworkInstance & {
		framework: Framework;
	})[];
	frameworksWithCompliance: FrameworkWithCompliance[];
}

// Individual FrameworkCard component
function FrameworkCard({
	framework,
	compliance,
}: {
	framework: FrameworkInstance & { framework: Framework };
	compliance: number;
}) {
	const { orgId } = useParams<{ orgId: string }>();

	return (
		<Link
			href={`/${orgId}/overview/frameworks/${framework.id}`}
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
export function RequirementStatus({
	frameworks,
	frameworksWithCompliance,
}: Props) {
	const t = useI18n();

	if (!frameworks.length || !frameworksWithCompliance.length) return null;

	return (
		<Card className="border border-border bg-background select-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>{t("frameworks.title")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{/* Framework List */}
					<div className="space-y-6">
						{frameworksWithCompliance.map(({ framework, compliance }) => (
							<FrameworkCard
								key={framework.id}
								framework={framework}
								compliance={compliance}
							/>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
