"use client";

import { Badge } from "@comp/ui/badge";
import { Progress } from "@comp/ui/progress";
import { useEffect, useState } from "react";

interface OnboardingProgressProps {
	totalSteps: number;
	completedSteps: number;
}

export function OnboardingProgress({
	totalSteps,
	completedSteps,
}: OnboardingProgressProps) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const percentage = (completedSteps / totalSteps) * 100;

		// Animate progress bar
		const timer = setTimeout(() => setProgress(percentage), 100);
		return () => clearTimeout(timer);
	}, [completedSteps, totalSteps]);
	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-3xl font-semibold">Welcome to Comp AI</h2>
				<p className="text-muted-foreground text-sm">
					Complete the steps below to complete your onboarding and get
					started with Comp AI.
				</p>
			</div>
			<div className="flex flex-col gap-2">
				<Progress value={progress} className="w-full h-2" />
				<div className="flex justify-between">
					<Badge variant="secondary" className="text-xs">
						{completedSteps} / {totalSteps} steps completed
					</Badge>
				</div>
			</div>
		</div>
	);
}
