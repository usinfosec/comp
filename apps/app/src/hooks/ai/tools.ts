import { auth } from "@/auth";
import { db } from "@bubba/db";
import { tool } from "ai";
import { z } from "zod";

// Organization Tools
export const getOrgTool = tool({
	description: "Get the organization details",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const org = await db.organization.findUnique({
			where: { id: session.user.organizationId },
			select: {
				id: true,
				name: true,
				website: true,
				tier: true,
				setup: true,
				frameworkId: true,
			},
		});

		if (!org) {
			return { error: "Organization not found" };
		}

		return org;
	},
});

// Vendor Tools
export const getVendorsTool = tool({
	description: "Get all vendors for the organization",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const vendors = await db.vendor.findMany({
			where: { organizationId: session.user.organizationId },
			select: {
				id: true,
				name: true,
				description: true,
				category: true,
				status: true,
				inherentRisk: true,
				residualRisk: true,
				createdAt: true,
				updatedAt: true,
				owner: {
					select: {
						name: true,
						email: true,
					},
				},
				contacts: {
					select: {
						name: true,
						email: true,
						phone: true,
					},
				},
			},
		});

		return vendors;
	},
});

export const getVendorDetailsTool = tool({
	description: "Get detailed information about a specific vendor",
	parameters: z.object({
		vendorId: z.string(),
	}),
	execute: async ({ vendorId }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const vendor = await db.vendor.findFirst({
			where: {
				id: vendorId,
				organizationId: session.user.organizationId,
			},
			select: {
				id: true,
				name: true,
				description: true,
				category: true,
				status: true,
				inherentRisk: true,
				residualRisk: true,
				createdAt: true,
				updatedAt: true,
				owner: {
					select: {
						name: true,
						email: true,
					},
				},
				contacts: {
					select: {
						name: true,
						email: true,
						phone: true,
					},
				},
				tasks: {
					select: {
						id: true,
						title: true,
						description: true,
						status: true,
						dueDate: true,
						completedAt: true,
						owner: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
				comments: {
					select: {
						content: true,
						createdAt: true,
						owner: {
							select: {
								name: true,
								email: true,
							},
						},
					},
				},
			},
		});

		if (!vendor) {
			return { error: "Vendor not found" };
		}

		return vendor;
	},
});

// Risk Tools
export const getRisksTool = tool({
	description: "Get all risks for the organization",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const risks = await db.risk.findMany({
			where: { organizationId: session.user.organizationId },
			select: {
				id: true,
				title: true,
				description: true,
				category: true,
				department: true,
				status: true,
				probability: true,
				impact: true,
				residual_probability: true,
				residual_impact: true,
				createdAt: true,
				updatedAt: true,
				owner: {
					select: {
						name: true,
						email: true,
					},
				},
				mitigationTasks: {
					select: {
						id: true,
						title: true,
						status: true,
						dueDate: true,
						completedAt: true,
					},
				},
			},
		});

		return risks;
	},
});

// Policy Tools
export const getPoliciesTool = tool({
	description: "Get all policies for the organization",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const policies = await db.organizationPolicy.findMany({
			where: { organizationId: session.user.organizationId },
			select: {
				id: true,
				policy: {
					select: {
						name: true,
					},
				},
			},
		});

		return policies;
	},
});

export const getPolicyDetails = tool({
	description: "Get detailed information about a specific policy",
	parameters: z.object({
		policyName: z.string(),
	}),
	execute: async ({ policyName }) => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const policy = await db.organizationPolicy.findFirst({
			where: {
				organizationId: session.user.organizationId,
				policy: {
					name: policyName,
				},
				isArchived: false,
			},
			select: {
				id: true,
				status: true,
				createdAt: true,
				updatedAt: true,
				policy: {
					select: {
						id: true,
						name: true,
						description: true,
						content: true,
						version: true,
						frequency: true,
						department: true,
						isRequiredToSign: true,
					},
				},
			},
		});

		if (!policy) {
			return { error: "Policy not found" };
		}

		return policy;
	},
});

// Framework Tools
export const getFrameworkTool = tool({
	description: "Get the organization's framework details",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const orgFramework = await db.organizationFramework.findFirst({
			where: { organizationId: session.user.organizationId },
			select: {
				id: true,
				status: true,
				adoptedAt: true,
				lastAssessed: true,
				nextAssessment: true,
				framework: {
					select: {
						name: true,
						description: true,
						version: true,
						categories: {
							select: {
								name: true,
								description: true,
								controls: {
									select: {
										code: true,
										name: true,
										description: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!orgFramework) {
			return { error: "Framework not found" };
		}

		return orgFramework;
	},
});

// Cloud Test Tools
export const getCloudTestsTool = tool({
	description: "Get all cloud tests for the organization",
	parameters: z.object({}),
	execute: async () => {
		const session = await auth();

		if (!session?.user.organizationId) {
			return { error: "Unauthorized" };
		}

		const tests = await db.organizationIntegrationResults.findMany({
			where: { organizationId: session.user.organizationId },
			select: {
				id: true,
				title: true,
				status: true,
				severity: true,
				remediation: true,
				resultDetails: true,
				completedAt: true,
				organizationIntegrationId: true,
				organizationId: true,
				assignedUserId: true,
			},
		});

		return tests;
	},
});
