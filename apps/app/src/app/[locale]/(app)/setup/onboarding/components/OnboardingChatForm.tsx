"use client";

import { useEffect, useRef, useState } from "react";
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
} from "@comp/ui/form";
import { Card, CardHeader, CardContent, CardFooter } from "@comp/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
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
import { ChatBubble } from "./ChatBubble";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CompanyDetails, ChatBubble as ChatBubbleType } from "../lib/types";
import { STORAGE_KEY, companyDetailsSchema, steps, welcomeText } from "../lib/constants";
import { skipOnboarding } from "../actions/skip-onboarding";
import { onboardOrganization } from "../actions/onboard-organization";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { sendGTMEvent } from "@next/third-parties/google";
import { toast } from "sonner";

export function OnboardingChatForm() {
    const router = useRouter()
    const { data: session } = authClient.useSession();
    const [stepIndex, setStepIndex] = useState(0);
    const [chatHistory, setChatHistory] = useState<ChatBubbleType[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamedText, setStreamedText] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [initialized, setInitialized] = useState(false);
    const [streamQueue, setStreamQueue] = useState<ChatBubbleType[]>([]);
    const [editingKey, setEditingKey] = useState<keyof CompanyDetails | null>(null);
    const [savedAnswers, setSavedAnswers] = useLocalStorage<Partial<CompanyDetails>>(STORAGE_KEY, {});
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [showSkipDialog, setShowSkipDialog] = useState(false);
    const [welcomeShown, setWelcomeShown] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isOnboarding, setIsOnboarding] = useState(false);


    const form = useForm<Partial<CompanyDetails>>({
        resolver: zodResolver(
            z.object({
                [steps[stepIndex]?.key as keyof CompanyDetails]: companyDetailsSchema.shape[steps[stepIndex]?.key as keyof CompanyDetails],
            }),
        ),
        mode: "onBlur",
        defaultValues: { legalName: "", website: "", techStack: "", laptopAndMobileDevices: "", identity: "", hosting: "", team: "", data: "", vendors: "" },
    });

    const skipOnboardingAction = useAction(skipOnboarding, {
        onSuccess: () => {
            sendGTMEvent({
                event: "conversion",
            });

            router.push("/");
        },
        onError: () => {
            toast.error("Failed to skip onboarding");
        },
        onExecute: () => {
            setIsSkipping(true);
        }
    })

    const onboardOrganizationAction = useAction(onboardOrganization, {
        onSuccess: () => {
            sendGTMEvent({
                event: "conversion",
            });

            router.push("/");
        },
        onError: () => {
            toast.error("Failed to onboard organization");
        },
        onExecute: () => {
            setIsOnboarding(true);
        }
    })

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
    }

    const handleSkipOnboardingAction = () => {
        skipOnboardingAction.execute({
            legalName: savedAnswers.legalName || "My Organization",
            website: savedAnswers.website || "https://my-organization.com",
        });

        setSavedAnswers({});
    }

    const streamBubble = (bubble: ChatBubbleType, onDone?: () => void) => {
        setIsStreaming(true);
        setStreamedText("");
        let idx = 0;
        const type = () => {
            setStreamedText(bubble.text.slice(0, idx));
            idx++;
            if (idx <= bubble.text.length) {
                timeoutRef.current = setTimeout(type, 13);
            } else {
                setIsStreaming(false);
                setChatHistory((prev) => [...prev, bubble]);
                setStreamedText("");
                onDone?.();
            }
        };
        type();
    };

    useEffect(() => {
        const bubbles: ChatBubbleType[] = [];
        const queue: ChatBubbleType[] = [];

        if (!savedAnswers || Object.keys(savedAnswers).length === 0) {
            queue.push({ type: "system", text: welcomeText });
            queue.push({
                type: "system",
                text: steps[0].question,
                key: steps[0].key,
            });
            setStepIndex(0);
        } else {
            bubbles.push({ type: "system", text: welcomeText });
            setWelcomeShown(true);
            let firstUnansweredIdx = steps.length;
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                if (savedAnswers[step.key]) {
                    bubbles.push({
                        type: "system",
                        text: step.question,
                        key: step.key,
                    });
                    bubbles.push({
                        type: "user",
                        text: savedAnswers[step.key] as string,
                        key: step.key,
                    });
                } else {
                    firstUnansweredIdx = i;
                    queue.push({
                        type: "system",
                        text: step.question,
                        key: step.key,
                    });
                    break;
                }
            }
            setStepIndex(firstUnansweredIdx);

            if (firstUnansweredIdx === steps.length) {
                queue.push({
                    type: "system",
                    text: "Perfect. If you're happy with the answers above, click on 'Finish' and I'll create your organization in Comp AI. It may take a few minutes.",
                });
            }
        }
        setChatHistory(bubbles);
        setStreamQueue(queue);
        setInitialized(true);
    }, [savedAnswers]);

    useEffect(() => {
        if (initialized && streamQueue.length > 0 && !isStreaming) {
            const [next, ...rest] = streamQueue;
            streamBubble(next, () => {
                setStreamQueue(rest);
                if (next.text === welcomeText) {
                    setWelcomeShown(true);
                }
            });
        }
    }, [initialized, streamQueue, isStreaming]);

    const onSubmit = (data: Partial<CompanyDetails>) => {
        const step = steps[stepIndex];
        if (!step) return;

        const newAnswers = { ...savedAnswers, [step.key]: data[step.key] };
        setSavedAnswers(newAnswers);

        setChatHistory((prev) => [
            ...prev,
            { type: "user", text: data[step.key] || "", key: step.key },
        ]);

        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < steps.length) {
            setStepIndex(nextStepIndex);
            setStreamQueue([
                {
                    type: "system",
                    text: steps[nextStepIndex].question,
                    key: steps[nextStepIndex].key,
                },
            ]);
        } else {
            setStepIndex(nextStepIndex);
            setStreamQueue([
                {
                    type: "system",
                    text: "Perfect. If you're happy with the answers above, click on 'Finish' and I'll create your organization in Comp AI. It may take a few minutes.",
                },
            ]);
        }

        const nextField = steps[nextStepIndex]?.key;
        if (nextField) {
            form.setValue(nextField, newAnswers[nextField] || "");
        }
    };

    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    useEffect(() => {
        if (initialized && steps[stepIndex] && inputRef.current && !isStreaming) {
            inputRef.current.focus();
        }
    }, [initialized, stepIndex, isStreaming]);

    const handleEdit = (stepKey: keyof CompanyDetails) => {
        form.setValue(stepKey, savedAnswers[stepKey] || "");
        setEditingKey(stepKey);
    };

    const handleSaveEdit = (stepKey: keyof CompanyDetails) => {
        const currentValue = form.getValues()[stepKey];
        const fieldSchema = companyDetailsSchema.shape[stepKey];
        const result = fieldSchema.safeParse(currentValue);
        if (!result.success) {
            const errorMsg = result.error.errors[0].message ? result.error.errors[0].message : "Invalid input";
            form.setError(stepKey, { message: errorMsg as string });
            return;
        }
        const newAnswers = { ...savedAnswers, [stepKey]: currentValue };
        setSavedAnswers(newAnswers);

        setChatHistory(prev => {
            const newHistory = [...prev];
            const userAnswerIndex = newHistory.findIndex(
                msg => msg.type === "user" && msg.key === stepKey
            );
            if (userAnswerIndex !== -1) {
                newHistory[userAnswerIndex] = {
                    ...newHistory[userAnswerIndex],
                    text: currentValue || ""
                };
            }
            return newHistory;
        });

        setEditingKey(null);
    };

    const renderedBubbles = [
        ...chatHistory,
        ...(isStreaming && streamedText ? [{ type: "system" as const, text: streamedText }] : []),
    ].map((msg, i, arr) => {
        let isActiveSystem = false;
        if (msg.type === "system") {
            if (isStreaming && i === arr.length - 1) {
                isActiveSystem = true;
            } else if (!isStreaming) {
                for (let j = arr.length - 1; j >= 0; j--) {
                    if (arr[j].type === "system") {
                        isActiveSystem = (i === j);
                        break;
                    }
                }
            }
        }
        return (
            <ChatBubble
                key={i}
                msg={msg}
                isActiveSystem={isActiveSystem}
                session={session}
                editingKey={editingKey}
                form={form}
                handleEdit={handleEdit}
                handleSaveEdit={handleSaveEdit}
            />
        );
    });

    const step = steps[stepIndex];
    const showInput = initialized && welcomeShown;

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, isStreaming, streamedText, showInput]);

    const canShowSkipButton = savedAnswers.legalName && savedAnswers.website;

    return (
        <div className="flex items-center justify-center min-h-screen p-4 scrollbar-hide" >
            <Card className="w-full max-w-2xl h-[calc(100vh-100px)] flex flex-col scrollbar-hide">
                <CardHeader />
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                        <div className="flex flex-col gap-4">
                            {renderedBubbles}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                    {showInput && step && (
                        <div className="mt-4 border-t pt-4 animate-in slide-in-from-bottom-4 duration-300">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="w-full"
                                    autoComplete="off"
                                >
                                    <FormField
                                        name={step.key}
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="h-4 relative ml-1">
                                                    <FormMessage className="text-xs absolute" />
                                                </div>
                                                <FormControl>
                                                    <div className="flex flex-col gap-4 w-full">
                                                        <Textarea
                                                            {...field}
                                                            placeholder={step.placeholder}
                                                            className="min-h-[100px] resize-none"
                                                            rows={4}
                                                            onKeyDown={(e) => {
                                                                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                                                                    e.preventDefault();
                                                                    form.handleSubmit(onSubmit)();
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex items-center justify-end">
                                                            <Button
                                                                type="submit"
                                                                size="sm"
                                                                onClick={() => form.handleSubmit(onSubmit)()}
                                                            >
                                                                Send
                                                                <span className="ml-2 text-[8px]">⌘ + Enter</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
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
                    {Object.keys(savedAnswers).length === steps.length && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Button className="flex items-center gap-2" onClick={handleOnboardOrganizationAction} disabled={isOnboarding}>
                                {isOnboarding && <Loader2 className="h-4 w-4 animate-spin" />}
                                Finish Onboarding
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
