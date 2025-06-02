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
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@comp/ui/card";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { LogoSpinner } from "@/components/logo-spinner";
import { Checkbox } from "@comp/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@comp/ui/radio-group";

type OnboardingFormFields = Partial<CompanyDetails> & {
    [K in keyof CompanyDetails as `${K}Other`]?: string;
};

export function OnboardingForm() {
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

    const form = useForm<OnboardingFormFields>({
        resolver: zodResolver(stepSchema),
        mode: 'onSubmit',
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

    const canShowSkipButton = Boolean(savedAnswers.legalName && savedAnswers.website);
    const isLastStep = stepIndex === steps.length - 1;

    function renderStepInput() {
        if (String(step.key) === "techStack" || String(step.key) === "vendors") {
            return (
                <Textarea
                    {...form.register(step.key)}
                    placeholder={step.placeholder}
                    className="resize-none"
                    rows={2}
                />
            );
        }
        if (step.options && step.key !== "legalName" && step.key !== "website") {
            const options = step.options.includes("Other") ? step.options : [...step.options, "Other"];
            if (step.key === "team") {
                const selected = form.watch(step.key);
                return (
                    <RadioGroup
                        value={selected || ""}
                        onValueChange={value => form.setValue(step.key, value)}
                        className="flex flex-col"
                    >
                        {options.map((option) => (
                            <FormItem key={option} className="flex items-center gap-2 cursor-pointer">
                                <FormControl className="mt-[2px]">
                                    <RadioGroupItem value={option} />
                                </FormControl>
                                <FormLabel className="cursor-pointer leading-none">{option}</FormLabel>
                            </FormItem>
                        ))}
                        {selected === "Other" && (
                            <div style={{ height: 40 }} className="relative">
                                <Input
                                    className="mt-2 absolute top-0 left-0 w-full"
                                    placeholder="Please specify..."
                                    autoFocus
                                    value={form.watch("teamOther") || ""}
                                    onChange={e => form.setValue("teamOther", e.target.value)}
                                    style={{ opacity: 1, transition: 'opacity 0.2s' }}
                                />
                            </div>
                        )}
                        {selected !== "Other" && (
                            <div style={{ height: 40 }} />
                        )}
                    </RadioGroup>
                );
            }
            const selected = (form.watch(step.key) || "").split(",").filter(Boolean);
            const hasOther = selected.includes("Other");
            return (
                <div className="flex flex-col gap-2">
                    {options.map((option) => (
                        <FormItem key={option} className="flex items-center gap-2 cursor-pointer">
                            <FormControl className="mt-[2px]">
                                <Checkbox
                                    checked={selected.includes(option)}
                                    onCheckedChange={checked => {
                                        let newSelected = [...selected];
                                        if (checked) {
                                            newSelected.push(option);
                                        } else {
                                            newSelected = newSelected.filter((v) => v !== option);
                                            if (option === "Other") {
                                                form.setValue(`${step.key}Other`, "");
                                            }
                                        }
                                        form.setValue(step.key, newSelected.join(","));
                                    }}
                                />
                            </FormControl>
                            <FormLabel className="cursor-pointer leading-none">{option}</FormLabel>
                        </FormItem>
                    ))}
                    {hasOther && (
                        <div style={{ height: 40 }} className="relative">
                            <Input
                                className="mt-2 absolute top-0 left-0 w-full"
                                autoFocus
                                placeholder="Please specify..."
                                value={form.watch(`${step.key}Other`) || ""}
                                onChange={e => form.setValue(`${step.key}Other`, e.target.value)}
                                style={{ opacity: 1, transition: 'opacity 0.2s' }}
                            />
                        </div>
                    )}
                    {!hasOther && (
                        <div style={{ height: 40 }} />
                    )}
                </div>
            );
        }
        if (
            step.key === "identity" ||
            step.key === "techStack" ||
            step.key === "laptopAndMobileDevices" ||
            step.key === "team" ||
            step.key === "data" ||
            step.key === "vendors" ||
            step.key === "hosting"
        ) {
            return (
                <Textarea
                    {...form.register(step.key)}
                    placeholder={step.placeholder}
                    className="resize-none"
                    rows={2}
                />
            );
        }
        return (
            <Input
                {...form.register(step.key)}
                placeholder={step.placeholder}
                autoFocus
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
                    <CardHeader className="min-h-[140px] flex flex-col items-center justify-center pb-0">
                        <div className="flex flex-col items-center gap-2">
                            <LogoSpinner />
                            <div className="text-muted-foreground text-sm">Step {stepIndex + 1} of {steps.length}</div>
                            <CardTitle className="text-center min-h-[56px] flex items-center justify-center">{step.question}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-y-auto min-h-[300px]">
                        <Form {...form} key={step.key}>
                            <form
                                id="onboarding-form"
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full mt-4"
                                autoComplete="off"
                            >
                                <FormField
                                    name={step.key}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                {renderStepInput()}
                                            </FormControl>
                                            <div className="min-h-[20px]">
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter>
                        <div className="flex-1 flex items-center">
                            {canShowSkipButton && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
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
                                </motion.div>
                            )}
                        </div>
                        {/* Right: Back/Next/Finish */}
                        <div className="flex gap-2 items-center">
                            <AnimatePresence>
                                {stepIndex > 0 && (
                                    <motion.div
                                        key="back"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <Button type="button" variant="ghost" onClick={handleBack} disabled={stepIndex === 0 || isOnboarding || isFinalizing}>
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <motion.div
                                key="next-finish"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                                style={{ minWidth: 120 }}
                            >
                                {isLastStep ? (
                                    <Button type="button" onClick={handleOnboardOrganizationAction} disabled={isOnboarding || isFinalizing}>
                                        <motion.span
                                            key="finish-label"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center"
                                        >
                                            {isOnboarding && <Loader2 className="h-4 w-4 animate-spin" />}
                                            Finish
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </motion.span>
                                    </Button>
                                ) : (
                                    <Button type="submit" form="onboarding-form" disabled={isOnboarding || isFinalizing}>
                                        <motion.span
                                            key="next-label"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center"
                                        >
                                            Next
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </motion.span>
                                    </Button>
                                )}
                            </motion.div>
                        </div>
                    </CardFooter>
                </Card>
            </div >
        )
    );
}
