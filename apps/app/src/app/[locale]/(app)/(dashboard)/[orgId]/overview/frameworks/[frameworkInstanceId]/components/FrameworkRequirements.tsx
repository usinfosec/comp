"use client";

import type { Requirement } from "@bubba/data";
import { FrameworkId } from "@bubba/db/types";
import { useMemo } from "react";
import { getFrameworkRequirements } from "../../../lib/getFrameworkRequirements";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bubba/ui/table";

export function FrameworkRequirements({
	frameworkId,
}: {
	frameworkId: FrameworkId;
}) {
	const requirements = useMemo(() => {
		const reqs = getFrameworkRequirements(frameworkId);
		return Object.entries(reqs).map(([id, requirement]) => ({
			id,
			...requirement,
		}));
	}, [frameworkId]);

	if (!requirements?.length) {
		return null;
	}

	return (
		<div className="space-y-4">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{requirements.map((requirement) => (
						<TableRow key={requirement.id}>
							<TableCell>{requirement.id}</TableCell>
							<TableCell>{requirement.name}</TableCell>
							<TableCell>{requirement.description}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
