"use client";

import {
	NoPolicies,
	NoResults,
} from "@/components/tables/policies/empty-states";
import { FilterToolbar } from "@/components/tables/policies/filter-toolbar";
import { Loading } from "@/components/tables/policies/loading";
import { useI18n } from "@/locales/client";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { User } from "next-auth";
import { PoliciesListSkeleton } from "./PoliciesListSkeleton";
import { PoliciesTable } from "./table/PoliciesTable";
import { PoliciesTableProvider } from "./table/hooks/usePoliciesTableContext";
import { CreatePolicySheet } from "@/components/sheets/create-policy-sheet";

interface PoliciesListProps {
	columnHeaders: {
		name: string;
		status: string;
		updatedAt: string;
	};
	users: User[];
}

export function PoliciesList({ columnHeaders, users }: PoliciesListProps) {
	const t = useI18n();

	return (
		<PoliciesTableProvider>
			<div className="relative">
				<PoliciesTable users={users} />
				<CreatePolicySheet />
			</div>
		</PoliciesTableProvider>
	);
}
