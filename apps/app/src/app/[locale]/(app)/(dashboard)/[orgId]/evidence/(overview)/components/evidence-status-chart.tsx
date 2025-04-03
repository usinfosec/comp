"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";

import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
	CardTitle,
} from "@comp/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@comp/ui/chart";
import { useI18n } from "@/locales/client";

interface EvidenceOverviewData {
	totalEvidence: number;
	publishedEvidence: number;
	draftEvidence: number;
	isNotRelevant: number;
}

interface EvidenceStatusChartProps {
	data?: EvidenceOverviewData | null;
}

const CHART_COLORS = {
	published: "hsl(var(--chart-positive))", // green
	draft: "hsl(var(--chart-neutral))", // yellow
	not_relevant: "hsl(var(--chart-destructive))", // red
};

export function EvidenceStatusChart({ data }: EvidenceStatusChartProps) {
	const t = useI18n();

	if (!data) {
		return (
			<Card className="flex flex-col">
				<CardHeader>
					<CardTitle>
						{t("evidence.dashboard.evidence_status") || "Evidence Status"}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center">
					<p className="text-center text-sm text-muted-foreground">
						No evidence data available
					</p>
				</CardContent>
				<CardFooter>
					<div className="flex flex-wrap gap-4 py-2" />
				</CardFooter>
			</Card>
		);
	}

	const chartData = React.useMemo(() => {
		const items = [
			{
				name: t("evidence.status.published"),
				value: data.publishedEvidence,
				fill: CHART_COLORS.published,
			},
			{
				name: t("evidence.status.draft"),
				value: data.draftEvidence,
				fill: CHART_COLORS.draft,
			},
			{
				name: t("evidence.status.isNotRelevant"),
				value: data.isNotRelevant,
				fill: CHART_COLORS.not_relevant,
			},
		];

		return items.filter((item) => item.value);
	}, [data, t]);

	const chartConfig = {
		value: {
			label: "Count",
		},
	} satisfies ChartConfig;

	return (
		<Card className="flex flex-col">
			<CardHeader>
				<CardTitle>
					{t("evidence.dashboard.evidence_status") || "Evidence Status"}
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex items-center justify-center">
				<ChartContainer
					config={chartConfig}
					className="mx-auto h-[300px] max-w-[250px]"
				>
					<PieChart
						width={250}
						height={300}
						margin={{
							top: 16,
							right: 16,
							bottom: 16,
							left: 16,
						}}
					>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<Pie
							data={chartData}
							dataKey="value"
							nameKey="name"
							innerRadius={60}
							outerRadius={80}
							paddingAngle={2}
							strokeWidth={5}
							stroke="bg-accent"
							cursor="pointer"
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-2xl font-bold"
												>
													{data.totalEvidence}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Total
												</tspan>
											</text>
										);
									}
									return null;
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex flex-wrap gap-4 py-2">
					{chartData.map((entry) => (
						<div key={entry.name} className="flex items-center gap-2">
							<div
								className="h-3 w-3"
								style={{ backgroundColor: entry.fill }}
							/>
							<span className="text-xs">
								{entry.name}
								<span className="ml-1 text-muted-foreground">
									({entry.value})
								</span>
							</span>
						</div>
					))}
				</div>
			</CardFooter>
		</Card>
	);
}
