"use client";

import type { ActionResponse } from "@/app/actions/actions";
import { Button } from "@comp/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@comp/ui/card";
import { Input } from "@comp/ui/input";
import { useToast } from "@comp/ui/use-toast";
import { useState } from "react";
import { checkMissingItemsAction } from "../actions/check-missing-items";
import { getOrgStatsAction } from "../actions/get-org-stats";

interface OrgStats {
	controls: number;
	policies: number;
	evidence: number;
	requirementMaps: number;
}

interface FixDetails {
	policiesCreated: number;
	evidenceCreated: number;
	controlsCreated: number;
	requirementMapsCreated: number;
}

interface OrgStatsResponse extends ActionResponse {
	data?: OrgStats;
}

interface FixDetailsResponse extends ActionResponse {
	data?: {
		message: string;
		details: FixDetails;
	};
}

export function OrgFixForm() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [organizationId, setOrganizationId] = useState("");
	const [stats, setStats] = useState<OrgStats | null>(null);
	const [fixResults, setFixResults] = useState<FixDetails | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	async function fetchStats() {
		console.log("fetchStats started. organizationId:", organizationId);
		if (!organizationId) {
			setError("Organization ID is required");
			return;
		}

		setIsLoading(true);
		setError(null);
		setSuccess(null);
		setStats(null); // Clear previous stats
		console.log("Cleared error, success, and stats states.");

		try {
			const result = await getOrgStatsAction({ organizationId });
			console.log("SafeAction Result:", JSON.stringify(result));

			if (!result) {
				console.log(
					"Setting error: Result is undefined. Current error state:",
					error,
				);
				setError(
					"Failed to fetch organization stats: Unexpected result",
				);
			} else if (result.serverError) {
				console.log(
					"Setting error: Server Error. Current error state:",
					error,
					"Server error:",
					result.serverError,
				);
				setError(
					result.serverError || "Failed to fetch stats: Server error",
				);
			} else if (result.validationErrors) {
				console.log(
					"Setting error: Validation Error. Current error state:",
					error,
					"Validation errors:",
					result.validationErrors,
				);
				setError("Failed to fetch stats: Invalid input");
			} else if (result.data) {
				const actionResponse = result.data as OrgStatsResponse;
				console.log(
					"ActionResponse inside result.data:",
					JSON.stringify(actionResponse),
				);
				if (actionResponse.success && actionResponse.data) {
					console.log(
						"Setting stats and success states. Current error state:",
						error,
					);
					setStats(actionResponse.data);
					setSuccess("Successfully retrieved organization stats");
				} else {
					console.log(
						"Setting error: ActionResponse indicates failure. Current error state:",
						error,
						"Action error:",
						actionResponse.error,
					);
					setError(
						actionResponse.error || "Failed to process stats data",
					);
				}
			} else {
				console.log(
					"Setting error: Unexpected result structure (no data/error). Current error state:",
					error,
				);
				setError(
					"Failed to fetch organization stats: Unexpected result structure",
				);
			}
		} catch (err) {
			console.error("Error caught in fetchStats catch block:", err);
			console.log("Current error state before setting in catch:", error);
			setError(
				"Failed to fetch organization stats: Network or client error",
			);
		} finally {
			console.log("fetchStats finally block executing.");
			setIsLoading(false);
		}
	}

	async function fixOrganization() {
		console.log("fixOrganization started. organizationId:", organizationId);
		setIsLoading(true);
		setFixResults(null);

		try {
			const result = await checkMissingItemsAction({ organizationId });
			console.log("Fix SafeAction Result:", JSON.stringify(result));

			if (!result) {
				console.log("Toast error: Fix Result is undefined");
				toast({
					title: "Error",
					description: "Failed to fix: Unexpected result",
					variant: "destructive",
				});
			} else if (result.serverError) {
				console.log(
					"Toast error: Fix Server Error",
					result.serverError,
				);
				toast({
					title: "Error",
					description:
						result.serverError || "Failed to fix: Server error",
					variant: "destructive",
				});
			} else if (result.validationErrors) {
				console.log(
					"Toast error: Fix Validation Error",
					result.validationErrors,
				);
				toast({
					title: "Error",
					description: "Failed to fix: Invalid input",
					variant: "destructive",
				});
			} else if (result.data) {
				const actionResponse = result.data as FixDetailsResponse;
				console.log(
					"Fix ActionResponse inside result.data:",
					JSON.stringify(actionResponse),
				);
				if (actionResponse.success && actionResponse.data) {
					console.log(
						"Fix successful, showing toast and setting results.",
					);
					toast({
						title: "Success",
						description: actionResponse.data.message,
					});
					setFixResults(actionResponse.data.details);
					console.log("Refreshing stats after fix...");
					await fetchStats();
				} else {
					console.log(
						"Toast error: Fix ActionResponse indicates failure.",
						actionResponse.error,
					);
					toast({
						title: "Error",
						description:
							actionResponse.error ||
							"Failed to process fix results",
						variant: "destructive",
					});
				}
			} else {
				console.log(
					"Toast error: Unexpected fix result structure (no data/error).",
				);
				toast({
					title: "Error",
					description: "Failed to fix: Unexpected result structure",
					variant: "destructive",
				});
			}
		} catch (err) {
			console.error("Error caught in fixOrganization catch block:", err);
			toast({
				title: "Error",
				description: "Failed to fix: Network or client error",
				variant: "destructive",
			});
		} finally {
			console.log("fixOrganization finally block executing.");
			setIsLoading(false);
		}
	}

	console.log("Final states before render:", {
		isLoading,
		organizationId,
		stats,
		fixResults,
		error,
		success,
	});
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="organizationId"
						className="text-sm font-medium"
					>
						Organization ID
					</label>
					<Input
						id="organizationId"
						value={organizationId}
						onChange={(e) => setOrganizationId(e.target.value)}
						placeholder="Enter organization ID"
					/>
				</div>
				<Button onClick={fetchStats} disabled={isLoading}>
					{isLoading ? "Loading..." : "Get Organization Stats"}
				</Button>
			</div>

			{error && (
				<div className="p-4 rounded-md bg-red-50 border border-red-300">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}

			{stats && (
				<Card>
					<CardHeader>
						<CardTitle>Organization Stats</CardTitle>
						<CardDescription>
							Current state of the organization
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Controls
								</p>
								<p className="text-2xl font-bold">
									{stats.controls}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Policies
								</p>
								<p className="text-2xl font-bold">
									{stats.policies}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Evidence
								</p>
								<p className="text-2xl font-bold">
									{stats.evidence}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Requirement Maps
								</p>
								<p className="text-2xl font-bold">
									{stats.requirementMaps}
								</p>
							</div>
						</div>
						<div className="mt-6">
							<Button
								onClick={fixOrganization}
								disabled={isLoading}
								className="w-full"
							>
								{isLoading ? "Fixing..." : "Fix Missing Items"}
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{success && !error && stats && (
				<div className="p-4 rounded-md bg-green-50 border border-green-300">
					<p className="text-sm text-green-700">{success}</p>
				</div>
			)}

			{fixResults && (
				<Card>
					<CardHeader>
						<CardTitle>Fix Results</CardTitle>
						<CardDescription>
							Items created during fix
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Controls Created
								</p>
								<p className="text-2xl font-bold">
									{fixResults.controlsCreated}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Policies Created
								</p>
								<p className="text-2xl font-bold">
									{fixResults.policiesCreated}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Evidence Created
								</p>
								<p className="text-2xl font-bold">
									{fixResults.evidenceCreated}
								</p>
							</div>
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">
									Requirement Maps Created
								</p>
								<p className="text-2xl font-bold">
									{fixResults.requirementMapsCreated}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
