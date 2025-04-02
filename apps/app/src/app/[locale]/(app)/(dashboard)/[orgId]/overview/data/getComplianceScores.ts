"use server";

import { db } from "@bubba/db";
import type {
	Artifact,
	Evidence,
	IntegrationResult,
	Policy,
} from "@bubba/db/types";
import { FrameworkInstanceWithControls } from "../types";

function calculateControlStatus(
	artifacts: (Artifact & {
		policy: Policy | null;
		evidence: Evidence | null;
	})[],
): "not_started" | "in_progress" | "compliant" {
	if (!artifacts?.length) return "not_started";

	const completedCount = artifacts.filter((artifact) => {
		if (artifact.type === "policy")
			return artifact.policy?.status === "published";
		if (artifact.type === "evidence")
			return artifact.evidence?.published === true;
		return false;
	}).length;

	if (completedCount === 0) return "not_started";
	if (completedCount === artifacts.length) return "compliant";
	return "in_progress";
}

interface ComplianceScoresResult {
	policiesCompliance: number;
	evidenceTasksCompliance: number;
	cloudTestsCompliance: number;
	overallCompliance: number;
	frameworkCompliance: { id: string; name: string; compliance: number }[];
	policies: Policy[];
	evidenceTasks: Evidence[];
	tests: IntegrationResult[];
}
export async function getComplianceScores({
	frameworksWithControls,
	organizationId,
}: {
	frameworksWithControls: FrameworkInstanceWithControls[];
	organizationId: string;
}): Promise<ComplianceScoresResult> {
	// Get all artifacts and filter by type
	const allArtifacts = frameworksWithControls.flatMap((f) =>
		f.controls.flatMap((c) => c.artifacts),
	);

	const policyArtifacts = allArtifacts.filter(
		(a) => a.type === "policy" && a.policy !== null,
	);

	const evidenceArtifacts = allArtifacts.filter(
		(a) => a.type === "evidence" && a.evidence !== null,
	);

	// Get unique policies and evidence
	const uniquePolicies = [...new Set(policyArtifacts.map((a) => a.policy!))];
	const uniqueEvidence = [
		...new Set(evidenceArtifacts.map((a) => a.evidence!)),
	];

	// Get integration results
	const integrationResults = await db.integrationResult.findMany({
		where: { organizationId },
		include: {
			integration: {
				select: { id: true, name: true, integrationId: true },
			},
		},
	});

	const tests = integrationResults.map((result) => ({
		id: result.id,
		severity: result.severity,
		result: result.status,
		title: result.title || result.integration.name,
		provider: result.integration.integrationId,
		createdAt: result.completedAt || new Date(),
		description: result.description,
		organizationId: result.organizationId,
		remediation: result.remediation,
		status: result.status,
		resultDetails: result.resultDetails,
		completedAt: result.completedAt,
		integrationId: result.integrationId,
		assignedUserId: result.assignedUserId,
	}));

	// Calculate base compliance scores
	const policiesCompliance =
		uniquePolicies.length > 0
			? (uniquePolicies.filter((p) => p.status === "published").length /
					uniquePolicies.length) *
				100
			: 0;

	const evidenceTasksCompliance =
		uniqueEvidence.length > 0
			? (uniqueEvidence.filter((e) => e.published).length /
					uniqueEvidence.length) *
				100
			: 0;

	const cloudTestsCompliance =
		tests.length > 0
			? (tests.filter((t) => t.result?.toUpperCase() === "PASSED").length /
					tests.length) *
				100
			: 0;

	// Calculate framework compliance
	const frameworkCompliance = frameworksWithControls.map((framework) => {
		const controls = framework.controls;
		const compliantControls = controls.filter(
			(c) => calculateControlStatus(c.artifacts) === "compliant",
		).length;
		const inProgressControls = controls.filter(
			(c) => calculateControlStatus(c.artifacts) === "in_progress",
		).length;

		// Calculate weighted control compliance
		const controlCompliance =
			controls.length > 0
				? ((compliantControls + inProgressControls * 0.5) / controls.length) *
					100
				: 0;

		// Get framework-specific policies and evidence
		const frameworkPolicies = policyArtifacts
			.filter(
				(a) =>
					findFrameworkIdForArtifact(a.id, frameworksWithControls) ===
					framework.frameworkId,
			)
			.map((a) => a.policy!);

		const frameworkEvidence = evidenceArtifacts
			.filter(
				(a) =>
					findFrameworkIdForArtifact(a.id, frameworksWithControls) ===
					framework.frameworkId,
			)
			.map((a) => a.evidence!);

		// Calculate framework-specific compliance scores
		const scores = [controlCompliance];

		if (frameworkPolicies.length > 0) {
			const policyScore =
				(frameworkPolicies.filter((p) => p.status === "published").length /
					frameworkPolicies.length) *
				100;
			scores.push(policyScore);
		}

		if (frameworkEvidence.length > 0) {
			const evidenceScore =
				(frameworkEvidence.filter((e) => e.published).length /
					frameworkEvidence.length) *
				100;
			scores.push(evidenceScore);
		}

		// Calculate average compliance
		const compliance =
			scores.length > 0
				? scores.reduce((sum, score) => sum + score, 0) / scores.length
				: 0;

		return {
			id: framework.frameworkId,
			name: framework.frameworkId,
			compliance: Math.round(compliance),
		};
	});

	// Calculate overall compliance
	const activeCategories = [
		uniquePolicies.length > 0,
		uniqueEvidence.length > 0,
		tests.length > 0,
	].filter(Boolean).length;

	const overallCompliance =
		activeCategories > 0
			? Math.round(
					(policiesCompliance +
						evidenceTasksCompliance +
						cloudTestsCompliance) /
						activeCategories,
				)
			: 0;

	return {
		policiesCompliance: Math.round(policiesCompliance),
		evidenceTasksCompliance: Math.round(evidenceTasksCompliance),
		cloudTestsCompliance: Math.round(cloudTestsCompliance),
		overallCompliance,
		frameworkCompliance,
		policies: uniquePolicies,
		evidenceTasks: uniqueEvidence,
		tests,
	};
}

function findFrameworkIdForArtifact(
	artifactId: string,
	frameworksWithControls: FrameworkInstanceWithControls[],
): string | undefined {
	for (const framework of frameworksWithControls) {
		for (const control of framework.controls) {
			if (control.artifacts.some((a) => a.id === artifactId)) {
				return framework.frameworkId;
			}
		}
	}
	return undefined;
}
