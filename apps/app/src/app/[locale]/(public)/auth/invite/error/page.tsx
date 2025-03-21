"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@bubba/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@bubba/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/locales/client";
import { SignOut } from "@/components/sign-out";
import { useEffect } from "react";

export default function InviteErrorPage() {
	const t = useI18n();
	const searchParams = useSearchParams();
	const router = useRouter();
	const errorMessage = searchParams.get("message");

	useEffect(() => {
		if (!errorMessage) {
			router.push("/");
		}
	}, [errorMessage, router]);

	if (!errorMessage) {
		return null;
	}

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						<CardTitle>{t("settings.team.invite.error.title")}</CardTitle>
					</div>
					<CardDescription>
						{t("settings.team.invite.error.description")}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="p-4 border rounded-md bg-destructive/10 text-destructive text-sm">
						{errorMessage}
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button asChild variant="outline">
						<Link href="/">{t("settings.team.invite.error.home")}</Link>
					</Button>
					<SignOut asButton />
				</CardFooter>
			</Card>
		</div>
	);
}
