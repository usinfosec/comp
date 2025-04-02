"use client";

import type { Requirement } from "@bubba/data";
import { FrameworkId } from "@bubba/db/types";
import { useMemo } from "react";
import { getFrameworkRequirements } from "../../lib/getFrameworkRequirements";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@bubba/ui/table";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/locales/client";

export function FrameworkRequirements({
	frameworkId,
}: {
	frameworkId: FrameworkId;
}) {
	const t = useI18n();
	const { orgId, frameworkInstanceId } = useParams<{
		orgId: string;
		frameworkInstanceId: string;
	}>();

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
						<TableRow
							key={requirement.id}
							className="cursor-pointer hover:bg-muted/50"
						>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full"
								>
									{requirement.id}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full"
								>
									{requirement.name}
								</Link>
							</TableCell>
							<TableCell>
								<Link
									href={`/${orgId}/frameworks/${frameworkInstanceId}/requirement/${requirement.id}`}
									className="block w-full"
								>
									{requirement.description}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
