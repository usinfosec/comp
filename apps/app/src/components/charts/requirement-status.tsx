"use client";

import { useI18n } from "@/locales/client";
import type {
	Framework,
	OrganizationControl,
	OrganizationFramework,
	OrganizationControlRequirement,
} from "@bubba/db";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import Link from "next/link";
import { cn } from "@bubba/ui/cn";
import { useMemo } from "react";

interface Props {
	frameworks: (OrganizationFramework & {
		framework: Framework;
		organizationControl: (OrganizationControl & {
			OrganizationControlRequirement?: (OrganizationControlRequirement & {
				organizationPolicy?: {
					status: "draft" | "published" | "archived";
				} | null;
				organizationEvidence?: {
					published: boolean;
				} | null;
			})[];
			control?: {
				code: string;
				name: string;
			};
			status?: string;
		})[];
	})[];
}

export function RequirementStatus({ frameworks }: Props) {
	const t = useI18n();

	// Log the full frameworks structure to see what data we're working with
	console.log("Frameworks data:", JSON.stringify(frameworks, null, 2));

	// Helper function to check if a control is compliant based on its requirements
	const isControlCompliant = (
		control: OrganizationControl & {
			OrganizationControlRequirement?: (OrganizationControlRequirement & {
				organizationPolicy?: {
					status: "draft" | "published" | "archived";
				} | null;
				organizationEvidence?: {
					published: boolean;
				} | null;
			})[];
			control?: {
				code: string;
				name: string;
			};
			status?: string;
		},
	) => {
		// First, check if the control has the direct status of "compliant"
		if (control.status === "compliant") {
			console.log(
				`Control ${control.control?.name || control.id} is directly marked as compliant`,
			);
			return true;
		}

		// Then check the requirements if they exist
		const requirements = control.OrganizationControlRequirement;

		if (!requirements || requirements.length === 0) {
			console.log(
				`Control ${control.control?.name || control.id} has no requirements`,
			);
			return false;
		}

		console.log(
			`Control ${control.control?.name || control.id} has ${requirements.length} requirements`,
		);

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

			if (isCompleted) {
				console.log(`Requirement ${req.id} of type ${req.type} is completed`);
			} else {
				console.log(
					`Requirement ${req.id} of type ${req.type} is NOT completed`,
				);
			}

			return isCompleted;
		}).length;

		console.log(
			`Control has ${completedRequirements}/${totalRequirements} completed requirements`,
		);

		return completedRequirements === totalRequirements;
	};

	// Calculate framework compliance scores based on the requirements
	const frameworkCompliance = useMemo(() => {
		return frameworks.map((framework) => {
			console.log(`Processing framework: ${framework.framework.name}`);

			// Calculate framework controls compliance based on requirements
			const totalControls = framework.organizationControl.length;
			console.log(`Total controls: ${totalControls}`);

			const compliantControls = framework.organizationControl.filter(
				(control) => {
					const isCompliant = isControlCompliant(control);
					console.log(
						`Control ${control.control?.name || control.id} compliant: ${isCompliant}`,
					);
					return isCompliant;
				},
			).length;

			console.log(`Compliant controls: ${compliantControls}`);

			// Calculate compliance percentage
			const compliance =
				totalControls > 0
					? Math.round((compliantControls / totalControls) * 100)
					: 0;

			console.log(
				`Framework ${framework.framework.name} compliance: ${compliance}%`,
			);

			return {
				id: framework.framework.id,
				name: framework.framework.name,
				compliance,
			};
		});
	}, [frameworks]);

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
							{frameworkCompliance.map((framework) => {
								const compliance = Math.max(0, framework.compliance);

								return (
									<Link
										key={framework.id}
										href={`/overview/frameworks/${framework.id}`}
										className="flex items-start gap-4 rounded-lg p-4 hover:bg-zinc-800/40 transition-colors duration-200"
									>
										<div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
											<div className="text-lg font-bold text-zinc-400">
												{framework.name.substring(0, 2).toUpperCase()}
											</div>
										</div>
										<div className="flex-1 space-y-2">
											<div className="flex items-center justify-between">
												<h3 className="font-medium">{framework.name}</h3>
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
							})}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
