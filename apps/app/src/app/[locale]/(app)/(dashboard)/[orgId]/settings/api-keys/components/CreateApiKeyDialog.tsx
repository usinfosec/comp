"use client";

import { createApiKeyAction } from "@/actions/organization/create-api-key-action";
import { Button } from "@comp/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@comp/ui/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@comp/ui/sheet";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@comp/ui/drawer";
import { useMediaQuery } from "@comp/ui/hooks";
import { ScrollArea } from "@comp/ui/scroll-area";
import { X, Check, Copy, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@comp/ui/input";

interface CreateApiKeyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateApiKeyDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateApiKeyDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [name, setName] = useState("");
    const [expiration, setExpiration] = useState<
        "never" | "30days" | "90days" | "1year"
    >("never");
    const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const { execute: createApiKey, status: isCreating } = useAction(
        createApiKeyAction,
        {
            onSuccess: (data) => {
                if (data.data?.data?.key) {
                    setCreatedApiKey(data.data.data.key);
                    if (onSuccess) onSuccess();
                }
            },
            onError: (error) => {
                toast.error("Failed to create API key");
            },
        },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createApiKey({
            name,
            expiresAt: expiration,
        });
    };

    const handleClose = () => {
        if (isCreating !== "executing") {
            setName("");
            setExpiration("never");
            setCreatedApiKey(null);
            setCopied(false);
            onOpenChange(false);
        }
    };

    const copyToClipboard = async () => {
        if (createdApiKey) {
            try {
                await navigator.clipboard.writeText(createdApiKey);
                setCopied(true);
                toast.success("API key copied to clipboard");

                // Reset copied state after 2 seconds
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            } catch (err) {
                toast.error("Error");
            }
        }
    };

    // Form content for reuse in both Dialog and Sheet/Drawer
    const renderFormContent = () => (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="space-y-2">
                <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none"
                >
                    {"Name"}
                </label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={"Enter a name for this API key"}
                    required
                    className="w-full"
                />
            </div>
            <div className="space-y-2">
                <label
                    htmlFor="expiration"
                    className="text-sm font-medium leading-none"
                >
                    {"Expiration"}
                </label>
                <Select
                    value={expiration}
                    onValueChange={(value) =>
                        setExpiration(
                            value as "never" | "30days" | "90days" | "1year",
                        )
                    }
                >
                    <SelectTrigger id="expiration" className="w-full">
                        <SelectValue
                            placeholder={t(
                                "settings.api_keys.expiration_placeholder",
                            )}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="never">
                            {"Never"}
                        </SelectItem>
                        <SelectItem value="30days">
                            {"30 days"}
                        </SelectItem>
                        <SelectItem value="90days">
                            {"90 days"}
                        </SelectItem>
                        <SelectItem value="1year">
                            {"1 year"}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-end">
                <Button type="button" variant="outline" onClick={handleClose}>
                    {"Cancel"}
                </Button>
                <Button
                    type="submit"
                    disabled={isCreating === "executing"}
                    className="w-full sm:w-auto"
                >
                    {isCreating === "executing" && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {"New API Key"}
                </Button>
            </div>
        </form>
    );

    // Created key content for reuse in both Dialog and Sheet/Drawer
    const renderCreatedKeyContent = () => (
        <>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        {"API Key"}
                    </p>
                    <div className="flex items-center">
                        <div className="relative w-full">
                            <div className="rounded-sm bg-muted p-3 pr-10 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <code className="text-sm break-all">
                                        {createdApiKey}
                                    </code>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {"This key will only be shown once. Make sure to copy it now."}
                    </p>
                </div>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleClose} className="w-full sm:w-auto">
                    {"Done"}
                </Button>
            </div>
        </>
    );

    // Shared content for both Sheet and Drawer
    const renderContent = () => (
        createdApiKey ? renderCreatedKeyContent() : renderFormContent()
    );

    if (isDesktop) {
        return (
            <Sheet open={open} onOpenChange={handleClose}>
                <SheetContent stack className="rounded-sm">
                    <SheetHeader className="mb-8 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <SheetTitle>{createdApiKey ? "API Key Created" : "New API Key"}</SheetTitle>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="p-0 m-0 size-auto hover:bg-transparent rounded-sm"
                                onClick={handleClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <SheetDescription>{createdApiKey ? "Your API key has been created. Make sure to copy it now as you won't be able to see it again." : "Create a new API key for programmatic access to your organization's data."}</SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-full p-0 pb-[100px]" hideScrollbar>
                        {createdApiKey ? (
                            <>
                                {renderCreatedKeyContent()}
                            </>
                        ) : (
                            <>
                                {renderFormContent()}
                            </>
                        )}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        );
    }
    return (
        <Drawer open={open} onOpenChange={handleClose}>
            <DrawerContent className="p-6 rounded-sm">
                <DrawerHeader>
                    <DrawerTitle>{createdApiKey ? "API Key Created" : "New API Key"}</DrawerTitle>
                    <DrawerDescription>{createdApiKey ? "Your API key has been created. Make sure to copy it now as you won't be able to see it again." : "Create a new API key for programmatic access to your organization's data."}</DrawerDescription>
                </DrawerHeader>
                {createdApiKey ? (
                    <>
                        {renderCreatedKeyContent()}
                    </>
                ) : (
                    <>
                        {renderFormContent()}
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}