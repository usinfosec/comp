"use client";

import { useState } from "react";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { ChatInterface } from "./ChatInterface";
import { Button } from "@bubba/ui/button";
import { cn } from "@bubba/ui/cn";

interface ChatButtonProps {
	className?: string;
}

export function ChatButton({ className }: ChatButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleChat = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{isOpen && <ChatInterface onClose={() => setIsOpen(false)} />}
			<Button
				onClick={toggleChat}
				size="icon"
				variant={isOpen ? "destructive" : "outline"}
				className={cn("h-12 w-12 rounded-full shadow-lg", className)}
				aria-label={isOpen ? "Close chat" : "Open chat"}
			>
				<ChatBubbleIcon className="h-5 w-5" />
			</Button>
		</div>
	);
}
