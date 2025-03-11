"use client";

import type { ReactNode } from "react";
import { ChatButton } from "./ChatButton";

interface ChatProviderProps {
	children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
	return (
		<>
			{children}
			<ChatButton />
		</>
	);
}
