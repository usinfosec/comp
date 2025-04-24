"use client";

import { Badge } from "@comp/ui/badge";
import { Button } from "@comp/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@comp/ui/card";
import {
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateOnboardingItem } from "../actions/update-onboarding-item";
import type { ChecklistItemProps } from "../types/ChecklistProps.types";

export function ChecklistItem({
    title,
    description,
    href,
    docs,
    dbColumn,
    completed,
    buttonLabel,
    icon,
}: ChecklistItemProps) {
    const { orgId } = useParams<{ orgId: string }>();
    const linkWithOrgReplaced = href.replace(":organizationId", orgId);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const router = useRouter();

    const handleMarkAsDone = async () => {
        try {
            setIsUpdating(true);
            setIsAnimating(true);

            const result = await updateOnboardingItem(orgId, dbColumn, true);

            if (!result.success) {
                throw new Error(result.error);
            }

            setTimeout(() => setIsAnimating(false), 600);
            router.push(linkWithOrgReplaced);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to update status",
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card>
            <div className={completed ? "opacity-40" : ""}>
                <CardHeader className="pb-3">
                    <div className="items-center gap-4 space-y-0">
                        <CardTitle className="flex items-center gap-4 justify-between w-full">
                            <span className={completed ? "line-through" : ""}>
                                {title}
                            </span>
                            {completed && (
                                <Badge
                                    variant="marketing"
                                >
                                    Completed
                                </Badge>
                            )}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-sm text-muted-foreground flex flex-col gap-4">
                                {description}
                            </CardDescription>
                        )}
                    </div>
                </CardHeader>
                <CardContent />
                {!completed && (
                    <CardFooter className="justify-end">
                        {!completed && (
                            <Button
                                variant={completed ? "outline" : "default"}
                                className="w-full sm:w-fit"
                                onClick={handleMarkAsDone}
                                disabled={isUpdating}
                            >
                                {completed ? (
                                    "Completed"
                                ) : isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        {buttonLabel}
                                        <ArrowRight className="ml-1 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}
                    </CardFooter>
                )}
            </div>
        </Card>
    );
}