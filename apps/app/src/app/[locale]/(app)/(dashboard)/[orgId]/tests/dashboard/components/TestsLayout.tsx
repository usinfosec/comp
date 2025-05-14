"use client";

import { Button } from "@comp/ui/button";
import { runTests } from "../actions/run-tests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { RefreshCw } from "lucide-react";
import { TestCard } from "./TestCard";
import { useState } from "react";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@comp/ui/select";
import { Integration } from "@comp/db/types";

// Define props for the reusable component
interface TestProviderTabContentProps {
	tests: {
		id: string;
		title: string | null;
		description: string | null;
		remediation: string | null;
		status: string | null;
		severity: string | null;
		completedAt: Date | null;
		integration: {
			integrationId: string;
		};
	}[];
	providerName: string;
}

interface TestsLayoutProps {
	awsTests: TestProviderTabContentProps["tests"];
	gcpTests: TestProviderTabContentProps["tests"];
	azureTests: TestProviderTabContentProps["tests"];
	cloudProviders: Integration[];
}

export const TestsLayout = ({
	awsTests,
	gcpTests,
	azureTests,
	cloudProviders,
}: TestsLayoutProps) => {
	const [executing, setExecuting] = useState(false);

	const hasAws = cloudProviders.some(
		(integration) => integration.integrationId === "aws",
	);
	const hasGcp = cloudProviders.some(
		(integration) => integration.integrationId === "gcp",
	);
	const hasAzure = cloudProviders.some(
		(integration) => integration.integrationId === "azure",
	);

	const activeProvidersCount = [hasAws, hasGcp, hasAzure].filter(
		Boolean,
	).length;

	const handleRunTests = async () => {
		try {
			setExecuting(true);
			await runTests();
		} catch (error) {
			console.error(error);
			toast.error(
				"Failed to run tests, please try again later or contact support.",
			);
		} finally {
			setExecuting(false);
		}
	};

	const renderProviderContent = () => {
		if (activeProvidersCount === 1) {
			if (hasAws) {
				return (
					<TestProviderTabContent
						tests={awsTests}
						providerName="AWS"
					/>
				);
			}
			if (hasGcp) {
				return (
					<TestProviderTabContent
						tests={gcpTests}
						providerName="GCP"
					/>
				);
			}
			if (hasAzure) {
				return (
					<TestProviderTabContent
						tests={azureTests}
						providerName="Azure"
					/>
				);
			}
		}
		return null; // Should not happen if activeProvidersCount is 1
	};

	return (
		<div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6 w-full">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold tracking-tight">
					Cloud Tests Results
				</h1>
				<Button onClick={() => handleRunTests()} disabled={executing}>
					Run Tests Again{" "}
					<RefreshCw
						className={`ml-2 h-4 w-4 ${executing ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
			{activeProvidersCount > 1 ? (
				<Tabs defaultValue={hasAws ? "AWS" : hasGcp ? "GCP" : "Azure"}>
					<TabsList
						className={`grid w-full grid-cols-${activeProvidersCount}`}
					>
						{hasAws && <TabsTrigger value="AWS">AWS</TabsTrigger>}
						{hasGcp && <TabsTrigger value="GCP">GCP</TabsTrigger>}
						{hasAzure && (
							<TabsTrigger value="Azure">Azure</TabsTrigger>
						)}
					</TabsList>
					{hasAws && (
						<TabsContent value="AWS" className="mt-4">
							<TestProviderTabContent
								tests={awsTests}
								providerName="AWS"
							/>
						</TabsContent>
					)}
					{hasGcp && (
						<TabsContent value="GCP" className="mt-4">
							<TestProviderTabContent
								tests={gcpTests}
								providerName="GCP"
							/>
						</TabsContent>
					)}
					{hasAzure && (
						<TabsContent value="Azure" className="mt-4">
							<TestProviderTabContent
								tests={azureTests}
								providerName="Azure"
							/>
						</TabsContent>
					)}
				</Tabs>
			) : activeProvidersCount === 1 ? (
				<div className="mt-4">{renderProviderContent()}</div>
			) : (
				<div className="text-center text-muted-foreground p-10 border border-dashed rounded-lg mt-4">
					<p>
						No cloud providers configured. Please add an
						integration.
					</p>
				</div>
			)}
		</div>
	);
};

// Reusable component for tab content
function TestProviderTabContent({
	tests,
	providerName,
}: TestProviderTabContentProps) {
	const [selectedStatus, setSelectedStatus] = useState<string>("all");

	const uniqueStatuses = Array.from(
		new Set(tests.map((test) => test.status).filter(Boolean) as string[]),
	);

	const filteredTests = tests.filter((test) => {
		if (selectedStatus === "all") return true;
		return test.status === selectedStatus;
	});

	const sortedTests = [...filteredTests].sort((a, b) => {
		const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
		const severityA = a.severity
			? (severityOrder[
					a.severity.toLowerCase() as keyof typeof severityOrder
				] ?? 999)
			: 999;
		const severityB = b.severity
			? (severityOrder[
					b.severity.toLowerCase() as keyof typeof severityOrder
				] ?? 999)
			: 999;
		return severityA - severityB;
	});

	return (
		<div className="flex flex-col gap-4">
			{sortedTests.length > 0 ? (
				<div className="flex justify-end">
					<Select
						value={selectedStatus}
						onValueChange={setSelectedStatus}
					>
						<SelectTrigger className="w-[180px] bg-background">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							{uniqueStatuses.map((status) => (
								<SelectItem key={status} value={status}>
									{status}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			) : null}

			{sortedTests.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{sortedTests.map((test) => {
						return <TestCard key={test.id} test={test} />;
					})}
				</div>
			) : (
				<div className="text-center text-muted-foreground p-10 border border-dashed rounded-lg">
					<p>
						No {providerName} test results found
						{selectedStatus !== "all" &&
							` with status "${selectedStatus}"`}
					</p>
				</div>
			)}
		</div>
	);
}
