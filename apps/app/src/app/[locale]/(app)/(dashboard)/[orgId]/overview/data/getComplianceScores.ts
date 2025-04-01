"use server";

import { db } from "@bubba/db";
import type {
	FrameworkInstance,
	Control,
	Evidence,
	IntegrationResult,
	Organization,
	Policy,
} from "@bubba/db/types";

interface ComplianceScoresResult {
	policiesCompliance: number;
	evidenceTasksCompliance: number;
	cloudTestsCompliance: number;
	overallCompliance: number;
	frameworkCompliance: {
		id: string;
		name: string;
		compliance: number;
	}[];
	policies: Policy[];
	evidenceTasks: Evidence[];
	tests: IntegrationResult[];
}

export async function getComplianceScores(
	organizationId: string,
	frameworks: (FrameworkInstance & {
		organizationControl: Control[];
	})[],
): Promise<ComplianceScoresResult> {
	// Get all policies for the organization
	const policies = await db.policy.findMany({
		where: { organizationId },
		select: {
			id: true,
			name: true,
			description: true,
			status: true,
			organizationId: true,
			createdAt: true,
			updatedAt: true,
			content: true,
			frequency: true,
			lastPublishedAt: true,
			isRequiredToSign: true,
			signedBy: true,
			ownerId: true,
			department: true,
			reviewDate: true,
		},
	});

	// Map policy framework data to a simpler structure
	const mappedPoliciesByFramework = policies.map((p) => ({
		policyId: p.id,
		status: p.status,
	}));

	// Get all evidence tasks for the organization
	const evidenceTasks = await db.evidence.findMany({
		where: { organizationId },
		select: {
			id: true,
			name: true,
			description: true,
			published: true,
			organizationId: true,
			createdAt: true,
			updatedAt: true,
			frequency: true,
			lastPublishedAt: true,
			assigneeId: true,
			department: true,
			isNotRelevant: true,
			additionalUrls: true,
			evidenceId: true,
			fileUrls: true,
		},
	});

	// Map evidence tasks to framework
	const evidenceByFramework = evidenceTasks
		.filter((task) => task.frameworkId) // Only include tasks with a frameworkId
		.map((task) => ({
			id: task.id,
			frameworkId: task.frameworkId,
			evidenceId: task.id,
			published: task.published,
		}));

	// Get all tests for the organization
	const integrationResults = await db.integrationResult.findMany({
		where: { organizationId },
		include: {
			integration: {
				select: {
					id: true,
					name: true,
					integrationId: true,
				},
			},
		},
	});

	// Transform the data to match the expected format
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

	// Calculate policies compliance
	const policiesCompliance =
		policies.length > 0
			? Math.round(
					(policies.filter((p) => p.status === "published").length /
						policies.length) *
						100,
				)
			: 0;

	// Calculate evidence tasks compliance
	const evidenceTasksCompliance =
		evidenceTasks.length > 0
			? Math.round(
					(evidenceTasks.filter((task) => task.published === true).length /
						evidenceTasks.length) *
						100,
				)
			: 0;

	// Calculate cloud tests compliance (checking for "PASSED" status as per the type definition)
	const cloudTestsCompliance =
		tests.length > 0
			? Math.round(
					(tests.filter((test) => test.result?.toUpperCase() === "PASSED")
						.length /
						tests.length) *
						100,
				)
			: 0;

	// Calculate framework-specific compliance
	const frameworkCompliance = frameworks.map((framework) => {
		// Calculate framework controls compliance
		const totalControls = framework.organizationControl.length;

		// Count controls with any progress (in_progress or compliant)
		const inProgressControls = framework.organizationControl.filter(
			(control) => control.status === "in_progress",
		).length;

		const compliantControls = framework.organizationControl.filter(
			(control) => control.status === "compliant",
		).length;

		// For compliance percentage, count both in_progress (partial) and compliant (full)
		// Give in_progress controls half weight compared to compliant ones
		const progressWeight = 0.5; // Weight for in_progress controls
		const weightedProgress =
			compliantControls + inProgressControls * progressWeight;

		// Calculate compliance percentage based on controls
		const controlsCompliance =
			totalControls > 0
				? Math.round((weightedProgress / totalControls) * 100)
				: 0;

		// Find policies for this specific framework
		const frameworkPolicies = mappedPoliciesByFramework.filter(
			(policy) => policy.frameworkId === framework.frameworkId,
		);

		// Calculate framework-specific policies compliance
		const frameworkPoliciesCompliance =
			frameworkPolicies.length > 0
				? Math.round(
						(frameworkPolicies.filter(
							(frameworkPolicy) => frameworkPolicy.status === "published",
						).length /
							frameworkPolicies.length) *
							100,
					)
				: null;

		// Find evidence tasks related to this framework
		const frameworkEvidenceTasks = evidenceByFramework.filter(
			(evidence) => evidence.frameworkId === framework.frameworkId,
		);

		// Calculate framework-specific evidence tasks compliance
		const frameworkEvidenceTasksCompliance =
			frameworkEvidenceTasks.length > 0
				? Math.round(
						(frameworkEvidenceTasks.filter(
							(evidence) => evidence.published === true,
						).length /
							frameworkEvidenceTasks.length) *
							100,
					)
				: null;

		// Calculate overall framework compliance as average of all components with data
		const complianceScores = [controlsCompliance];
		if (frameworkPoliciesCompliance !== null)
			complianceScores.push(frameworkPoliciesCompliance);
		if (frameworkEvidenceTasksCompliance !== null)
			complianceScores.push(frameworkEvidenceTasksCompliance);

		const totalCompliance =
			complianceScores.length > 0
				? Math.round(
						complianceScores.reduce((sum, score) => sum + score, 0) /
							complianceScores.length,
					)
				: controlsCompliance;

		return {
			id: framework.frameworkId,
			name: framework.frameworkId, // We'll need to get the framework name from somewhere else
			compliance: totalCompliance,
		};
	});

	// Calculate overall compliance as the average of all available scores
	const calculateOverallCompliance = () => {
		// Count how many categories have data
		const categoriesWithData = [
			policies.length > 0,
			evidenceTasks.length > 0,
			tests.length > 0,
		].filter(Boolean).length;

		// If no categories have data, return 0
		if (categoriesWithData === 0) return 0;

		// Calculate the sum of all compliance scores
		const totalScore =
			policiesCompliance + evidenceTasksCompliance + cloudTestsCompliance;

		// Return the average, rounded to the nearest integer
		return Math.round(totalScore / categoriesWithData);
	};

	return {
		policiesCompliance,
		evidenceTasksCompliance,
		cloudTestsCompliance,
		overallCompliance: calculateOverallCompliance(),
		frameworkCompliance,
		policies,
		evidenceTasks,
		tests,
	};
}
