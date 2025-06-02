"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@comp/ui/input";
import { Button } from "@comp/ui/button";
import { Textarea } from "@comp/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
} from "@comp/ui/form";
import { Card, CardHeader, CardContent, CardFooter } from "@comp/ui/card";
import { Loader2, ArrowRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@comp/ui/dialog";
import { authClient } from "@/utils/auth-client";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CompanyDetails } from "../lib/types";
import { STORAGE_KEY, companyDetailsSchema, steps } from "../lib/constants";
import { skipOnboarding } from "../actions/skip-onboarding";
import { onboardOrganization } from "../actions/onboard-organization";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { sendGTMEvent } from "@next/third-parties/google";
import { toast } from "sonner";
import { Icons } from "@comp/ui/icons";

export function OnboardingChatForm() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [stepIndex, setStepIndex] = useState(0);
    const [savedAnswers, setSavedAnswers] = useLocalStorage<Partial<CompanyDetails>>(STORAGE_KEY, {});
    const [showSkipDialog, setShowSkipDialog] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const step = steps[stepIndex];
    const stepSchema = z.object({
        [step.key]: companyDetailsSchema.shape[step.key],
    });

    const form = useForm<Partial<CompanyDetails>>({
        resolver: zodResolver(stepSchema),
        mode: "onBlur",
        defaultValues: { [step.key]: savedAnswers[step.key] || "" },
    });

    const skipOnboardingAction = useAction(skipOnboarding, {
        onSuccess: () => {
            setIsFinalizing(true);
            sendGTMEvent({ event: "conversion" });
            router.push("/");
        },
        onError: () => {
            toast.error("Failed to skip onboarding");
        },
        onExecute: () => {
            setIsSkipping(true);
        },
    });

    const onboardOrganizationAction = useAction(onboardOrganization, {
        onSuccess: (result) => {
            setIsFinalizing(true);
            sendGTMEvent({ event: "conversion" });
            if (result.data?.success) {
                router.push(`/setup/onboarding/go/${result.data.handle}`);
                setSavedAnswers({});
            } else {
                toast.error("Failed to onboard organization");
            }
        },
        onError: () => {
            toast.error("Failed to onboard organization");
        },
        onExecute: () => {
            setIsOnboarding(true);
        },
    });

    const handleOnboardOrganizationAction = () => {
        onboardOrganizationAction.execute({
            legalName: savedAnswers.legalName || "",
            website: savedAnswers.website || "",
            identity: savedAnswers.identity || "",
            laptopAndMobileDevices: savedAnswers.laptopAndMobileDevices || "",
            techStack: savedAnswers.techStack || "",
            hosting: savedAnswers.hosting || "",
            vendors: savedAnswers.vendors || "",
            team: savedAnswers.team || "",
            data: savedAnswers.data || "",
        });
    };

    const handleSkipOnboardingAction = () => {
        skipOnboardingAction.execute({
            legalName: savedAnswers.legalName || "My Organization",
            website: savedAnswers.website || "https://my-organization.com",
        });
        setSavedAnswers({});
    };

    const onSubmit = (data: Partial<CompanyDetails>) => {
        const newAnswers = { ...savedAnswers, ...data };
        setSavedAnswers(newAnswers);
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
    };

    // Determine if skip button should be shown
    const canShowSkipButton = Boolean(savedAnswers.legalName && savedAnswers.website);
    // Determine if finish button should be shown
    const isLastStep = stepIndex === steps.length - 1;
    const allStepsComplete = Object.keys(savedAnswers).length === steps.length;

    // Render input based on step type (customize as needed)
    function renderStepInput() {
        // Example: use switch for boolean, textarea for long text, input for short text
        // You can customize this logic based on your step definitions
        if (step.key === "identity" || step.key === "techStack" || step.key === "laptopAndMobileDevices" || step.key === "team" || step.key === "data" || step.key === "vendors" || step.key === "hosting") {
            return (
                <Textarea
                    {...form.register(step.key)}
                    placeholder={step.placeholder}
                    className="min-h-[100px] resize-none"
                    rows={4}
                />
            );
        }
        // Example: if you want a switch for a boolean field, add logic here
        // if (step.key === "someBooleanField") {
        //     return (
        //         <Switch {...form.register(step.key)} />
        //     );
        // }
        // Default to text input
        return (
            <Input
                {...form.register(step.key)}
                placeholder={step.placeholder}
            />
        );
    }

    return (
        isFinalizing ? (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground">Redirecting...</span>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center min-h-screen p-4 scrollbar-hide">
                <Card className="w-full max-w-2xl flex flex-col scrollbar-hide">
                    <CardHeader>
                        <div className="flex flex-col items-center gap-2">
                            <Icons.Logo />
                            <div className="text-muted-foreground text-sm">Step {stepIndex + 1} of {steps.length}</div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center overflow-y-auto min-h-[300px]">
                        <Form {...form} key={step.key}>
                            <form
                                id="onboarding-form"
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full"
                                autoComplete="off"
                            >
                                <FormField
                                    name={step.key}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{step.question}</FormLabel>
                                            <FormControl>
                                                {renderStepInput()}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2 flex-wrap">
                        {canShowSkipButton && (
                            <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
                                <DialogTrigger asChild disabled={isSkipping || isOnboarding}>
                                    <Button variant="ghost" className="text-muted-foreground">
                                        Skip Onboarding
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            If you skip the onboarding process, we won't be able to create custom policies, automatically add vendors and risks to the Comp AI platform. You will have to manually add them later.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="ghost" onClick={() => setShowSkipDialog(false)} disabled={isSkipping}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleSkipOnboardingAction} disabled={isSkipping}>
                                            <div className="flex items-center gap-2">
                                                {isSkipping && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Confirm
                                            </div>
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        <div className="flex gap-2">
                            <Button type="button" variant="ghost" onClick={handleBack} disabled={stepIndex === 0}>
                                Back
                            </Button>
                            {!isLastStep && (
                                <Button type="submit" form="onboarding-form">
                                    Next
                                </Button>
                            )}
                            {isLastStep && (
                                <Button type="button" onClick={handleOnboardOrganizationAction} disabled={isOnboarding}>
                                    {isOnboarding && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Finish
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    );
}
