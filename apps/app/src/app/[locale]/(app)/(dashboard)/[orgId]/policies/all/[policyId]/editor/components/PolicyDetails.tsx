"use client";

import { Card, CardContent, CardHeader } from "@bubba/ui/card";
import { Skeleton } from "@bubba/ui/skeleton";
import { redirect, useParams } from "next/navigation";
import { PolicyEditor } from "@/components/editor/policy-editor";
import { usePolicyDetails } from "../../../(overview)/hooks/usePolicy";
import type { JSONContent } from "@tiptap/react";
import "@bubba/ui/editor.css";

interface PolicyDetailsProps {
	policyId: string;
}

export function PolicyDetails({ policyId }: PolicyDetailsProps) {
	const { policy, isLoading, updatePolicy } = usePolicyDetails(policyId);
	const { orgId } = useParams();

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex flex-col space-y-4">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-32" />
				</div>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!policy) return redirect(`/${orgId}/policies`);

	const formattedContent = Array.isArray(policy.content)
		? policy.content
		: typeof policy.content === "object" && policy.content !== null
			? [policy.content as JSONContent]
			: [];

	const handleSavePolicy = async (content: JSONContent[]): Promise<void> => {
		if (!policy) return;

		try {
			await updatePolicy({
				...policy,
				content,
			});
		} catch (error) {
			console.error("Error saving policy:", error);
			throw error;
		}
	};

	return (
		<div className="flex flex-col h-full mx-auto">
			<PolicyEditor content={formattedContent} onSave={handleSavePolicy} />
		</div>
	);
}
