import { Button } from "@comp/ui/button";
import { Input } from "@comp/ui/input";
import { Textarea } from "@comp/ui/textarea";
import { Icons } from "@comp/ui/icons";
import { LogoSpinner } from "@/components/logo-spinner";
import { cn } from "@/lib/utils";
import { ChatBubble as ChatBubbleType, CompanyDetails } from "../lib/types";

interface ChatBubbleProps {
    msg: ChatBubbleType;
    isActiveSystem: boolean;
    session: any;
    editingKey: keyof CompanyDetails | null;
    form: any;
    handleEdit: (key: keyof CompanyDetails) => void;
    handleSaveEdit: (key: keyof CompanyDetails) => void;
}

const isLongFormField = (key: keyof CompanyDetails | undefined) => {
    return key === "techStack" ||
        key === "laptopAndMobileDevices" ||
        key === "data" ||
        key === "identity" ||
        key === "team" ||
        key === "hosting" ||
        key === "vendors";
};

export const ChatBubble = ({
    msg,
    isActiveSystem,
    session,
    editingKey,
    form,
    handleEdit,
    handleSaveEdit,
}: ChatBubbleProps) => (
    <div className={`flex ${msg.type === "system" ? "items-start" : "justify-end"} mb-4`}>
        {msg.type === "system" && (
            <div className="animate-in fade-in duration-300">
                <LogoSpinner className="h-10 w-10" isDisabled={!isActiveSystem} />
            </div>
        )}
        {msg.type === "user" ? (
            <div className="flex items-center gap-2 w-full justify-end max-w-lg">
                {editingKey === msg.key ? (
                    isLongFormField(msg.key) ? (
                        <div className="flex flex-col gap-2 w-full">
                            <Textarea
                                {...form.register(msg.key!)}
                                className="min-h-[100px] w-full"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                variant="secondary"
                                className="self-end px-3 py-1 text-xs"
                                onClick={() => msg.key && handleSaveEdit(msg.key)}
                            >
                                Save
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                {...form.register(msg.key!)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleSaveEdit(msg.key!);
                                    }
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleSaveEdit(msg.key!)}
                            >
                                <Icons.Check className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                ) : (
                    isLongFormField(msg.key) ? (
                        <div className="flex flex-col gap-2 w-full max-w-lg justify-end">
                            <Textarea
                                value={msg.text}
                                disabled
                                className="min-h-[100px] w-full max-w-lg"
                            />
                            <Button
                                type="submit"
                                size="sm"
                                variant="secondary"
                                className="self-end px-3 py-1 text-xs"
                                onClick={() => msg.key && handleEdit(msg.key)}
                            >
                                Edit
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Input
                                value={msg.text}
                                disabled
                                className="w-full"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => msg.key && handleEdit(msg.key)}
                            >
                                <Icons.Edit className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                )}
            </div>
        ) : (
            <div
                className={cn(
                    "rounded-sm bg-accent px-4 py-3 shadow-md max-w-xl text-sm border border-border whitespace-pre-line select-none ml-3",
                )}
            >
                {msg.text}
            </div>
        )}
    </div>
);