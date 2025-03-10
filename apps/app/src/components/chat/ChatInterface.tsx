"use client";

import { useChat } from "@/hooks/chat/useChat";
import type { ChatMessage } from "@/hooks/chat/useChat";
import { useRef, useEffect } from "react";
import { Cross2Icon, PaperPlaneIcon, PersonIcon } from "@radix-ui/react-icons";
import { Button } from "@bubba/ui/button";
import { Input } from "@bubba/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { cn } from "@bubba/ui/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";

interface ChatInterfaceProps {
	onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
	const { messages, input, handleInputChange, handleSubmit, isLoading } =
		useChat();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Helper to determine if a specific message is currently being generated
	const isGeneratingMessage = (message: ChatMessage, index: number) => {
		return (
			isLoading &&
			index === messages.length - 1 &&
			message.role === "assistant" &&
			message.content === ""
		);
	};

	// Format timestamp
	const formatTime = () => {
		const now = new Date();
		return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<Card className="absolute bottom-16 right-0 w-80 sm:w-96 h-96 shadow-xl flex flex-col overflow-hidden bg-background border">
			<CardHeader className="p-3 border-b bg-card">
				<div className="flex justify-between items-center">
					<CardTitle className="text-sm">Chat Assistant</CardTitle>
					<Button
						onClick={onClose}
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						aria-label="Close chat"
					>
						<Cross2Icon className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="flex-1 overflow-y-auto p-3 space-y-3 bg-background">
				{messages.length === 0 ? (
					<div className="text-center text-muted-foreground text-sm mt-20">
						<p>How can I help you today?</p>
					</div>
				) : (
					messages.map((message: ChatMessage, index) => (
						<div
							key={message.id}
							className={cn(
								"p-3 rounded-lg text-sm",
								message.role === "user"
									? "bg-primary/10 ml-6"
									: "bg-muted mr-6",
							)}
						>
							<div className="flex items-start gap-2">
								{message.role === "user" ? (
									<Avatar className="h-6 w-6">
										<AvatarFallback className="text-xs bg-primary text-primary-foreground">
											U
										</AvatarFallback>
									</Avatar>
								) : (
									<Avatar className="h-6 w-6">
										<AvatarFallback className="text-xs bg-muted-foreground text-background">
											AI
										</AvatarFallback>
									</Avatar>
								)}

								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center mb-1">
										<span className="font-medium text-xs">
											{message.role === "user" ? "User" : "Assistant"}
										</span>
										<span className="text-xs text-muted-foreground">
											{formatTime()}
										</span>
									</div>

									{isGeneratingMessage(message, index) ? (
										<div className="flex items-center space-x-2">
											<div className="animate-pulse flex space-x-1">
												<div className="h-1.5 w-1.5 bg-muted-foreground rounded-full" />
												<div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animation-delay-200" />
												<div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animation-delay-500" />
											</div>
											<span className="text-muted-foreground text-xs">
												Generating response...
											</span>
										</div>
									) : (
										<p className="whitespace-pre-wrap break-words">
											{message.content}
										</p>
									)}
								</div>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</CardContent>

			<div className="border-t p-3 flex items-center gap-2 bg-card">
				<form
					onSubmit={handleSubmit}
					className="flex w-full items-center gap-2"
				>
					<Input
						value={input}
						onChange={handleInputChange}
						placeholder={
							isLoading ? "Waiting for response..." : "Type your message..."
						}
						disabled={isLoading}
						className="flex-1"
					/>
					<Button
						type="submit"
						disabled={isLoading || !input.trim()}
						size="icon"
						aria-label="Send message"
					>
						<PaperPlaneIcon className="h-4 w-4" />
					</Button>
				</form>
			</div>
		</Card>
	);
}
