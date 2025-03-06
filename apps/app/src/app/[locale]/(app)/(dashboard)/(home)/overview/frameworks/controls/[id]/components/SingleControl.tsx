"use client";

import { DisplayFrameworkStatus } from "@/components/frameworks/framework-status";
import { useOrganizationControl } from "../hooks/useOrganizationControl";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Label } from "@bubba/ui/label";
import { Button } from "@bubba/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganizationControlProgress } from "../hooks/useOrganizationControlProgress";
import { DataTable } from "./data-table/data-table";
import { useMemo } from "react";

interface SingleControlProps {
	controlId: string;
}

export const SingleControl = ({ controlId }: SingleControlProps) => {
	const router = useRouter();
	const { data: control } = useOrganizationControl(controlId);
	const { data: controlProgress } = useOrganizationControlProgress(controlId);

	const progressStatus = useMemo(() => {
		if (!controlProgress) return "not_started";

		return controlProgress.progress?.completed > 0
			? "in_progress"
			: controlProgress.progress?.completed === 0
				? "not_started"
				: "completed";
	}, [controlProgress]);

	if (!control || !controlProgress) return null;

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex md:flex-row justify-between">
								{control?.control.name}
								<DisplayFrameworkStatus status={progressStatus} />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{control?.control.description}</p>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Domain</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm">{control?.control.domain}</p>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col gap-2">
					{control.OrganizationControlRequirement && (
						<DataTable data={control.OrganizationControlRequirement} />
					)}
				</div>
			</div>
		</div>
	);
};
