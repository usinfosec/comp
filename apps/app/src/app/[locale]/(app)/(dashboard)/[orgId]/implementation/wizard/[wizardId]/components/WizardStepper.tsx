import { cn } from "@comp/ui/cn";

interface WizardStepperProps {
	steps: string[];
	currentStep: number;
}

export function WizardStepper({ steps, currentStep }: WizardStepperProps) {
	return (
		<div className="mb-8">
			<div className="text-3xl font-semibold">{steps[currentStep]}</div>
		</div>
	);
}
