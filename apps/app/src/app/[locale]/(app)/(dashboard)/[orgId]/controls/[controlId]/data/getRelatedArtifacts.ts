"use server";

import { auth } from "@comp/auth";
import { db } from "@comp/db";
import { headers } from "next/headers";
import { cache } from "react";

export interface RelatedArtifact {
	id: string;
	name: string;
	type: string;
	createdAt: string;
}

interface GetRelatedArtifactsParams {
	organizationId: string;
	controlId: string;
}

export const getRelatedArtifacts = cache(
	async ({
		organizationId,
		controlId,
	}: GetRelatedArtifactsParams): Promise<RelatedArtifact[]> => {
		try {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session || !session.session.activeOrganizationId) {
				return [];
			}

			// Fetch the control with its artifacts
			const control = await db.control.findUnique({
				where: {
					id: controlId,
					organizationId: organizationId,
				},
				include: {
					artifacts: {
						include: {
							policy: true,
							evidence: true,
						},
					},
				},
			});

			if (!control || !control.artifacts) {
				return [];
			}

			// Transform the artifacts into the format expected by the UI
			return control.artifacts.map((artifact) => {
				let name = "Unknown";
				let displayType = artifact.type;

				if (artifact.policy) {
					name = artifact.policy.name;
					displayType = "policy";
				} else if (artifact.evidence) {
					name = artifact.evidence.name;
					displayType = "evidence";
				}

				return {
					id: artifact.id,
					name,
					type: displayType,
					createdAt: artifact.createdAt.toISOString(),
				};
			});
		} catch (error) {
			console.error("Error fetching related artifacts:", error);
			return [];
		}
	},
);
