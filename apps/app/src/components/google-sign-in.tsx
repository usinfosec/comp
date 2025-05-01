"use client";

import { ButtonIcon } from "@/components/ui/button-icon";
import { useI18n } from "@/locales/client";
import { authClient } from "@/utils/auth-client";
import { Button } from "@comp/ui/button";
import { Icons } from "@comp/ui/icons";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function GoogleSignIn({
	inviteCode,
}: {
	inviteCode?: string;
}) {
	const t = useI18n();
	const [isLoading, setLoading] = useState(false);

	const handleSignIn = async () => {
		setLoading(true);
		let redirectTo = "/";

		if (inviteCode) {
			redirectTo = `/api/auth/invitation?code=${inviteCode}`;
		} else if (typeof window !== "undefined") {
			const domain = window.location.hostname;
			if (domain === "app.trycomp.ai") {
				redirectTo = "https://app.trycomp.ai";
			} else if (domain === "dev.trycomp.ai") {
				redirectTo = "https://dev.trycomp.ai";
			} else {
				redirectTo = window.location.origin;
			}
		}

		await authClient.signIn.social({
			provider: "google",
			callbackURL: redirectTo,
		});
	};

	return (
		<Button
			onClick={handleSignIn}
			className="flex h-[40px] w-full space-x-2 px-6 py-4 font-medium active:scale-[0.98]"
		>
			{isLoading ? (
				<Loader2 className="h-4 w-4 animate-spin" />
			) : (
				<>
					<ButtonIcon isLoading={isLoading}>
						<Icons.Google />
					</ButtonIcon>
					<span>{t("auth.google")}</span>
				</>
			)}
		</Button>
	);
}
