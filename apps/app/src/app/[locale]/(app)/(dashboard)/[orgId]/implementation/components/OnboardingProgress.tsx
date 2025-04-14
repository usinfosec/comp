"use client";

import { Alert, AlertDescription, AlertTitle } from "@comp/ui/alert";
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
        <Alert variant="default" className="bg-primary/5 border-primary/40 rounded-sm">
            <AlertTitle>
                Welcome to Comp AI!
            </AlertTitle>
            <AlertDescription>
                Complete the steps below to complete your onboarding and get started with Comp AI.
            </AlertDescription>
            <div className="flex flex-col gap-2 mt-4">
                <Progress value={progress} className="w-full h-2" />
                <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                        {completedSteps} / {totalSteps}
                    </span>
                </div>
            </div>
        </Alert>
    );
}