import { UserMenu } from "@/components/user-menu";
import { getOnboardingForCurrentOrganization } from "@/data/getOnboarding";
import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { buttonVariants } from "@comp/ui/button";
import { Button } from "@comp/ui/button";
import { Icons } from "@comp/ui/icons";
import { Skeleton } from "@comp/ui/skeleton";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AssistantButton } from "./ai/chat-button";
import { MobileMenu } from "./mobile-menu";
import { NotificationCenter } from "./notification-center";

export async function Header() {
	const t = await getI18n();

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const currentOrganizationId = session?.session.activeOrganizationId;

	if (!currentOrganizationId) {
		redirect("/");
	}

	const { completedAll } = await getOnboardingForCurrentOrganization();

	return (
		<header className="flex justify-between items-center bg-background py-4 sticky top-0 z-10 px-4">
			<MobileMenu
				organizationId={currentOrganizationId}
				completedOnboarding={completedAll}
			/>

			<AssistantButton />

			<div className="flex space-x-2 ml-auto">
				<div className="hidden md:flex gap-2">
					<Link
						className={buttonVariants({
							variant: "outline",
							size: "sm",
						})}
						href="https://roadmap.trycomp.ai"
						target="_blank"
					>
						Feedback
					</Link>
					<Link
						className={buttonVariants({
							variant: "outline",
							size: "sm",
						})}
						href="https://discord.gg/compai"
						target="_blank"
					>
						<Icons.Discord className="h-4 w-4" />
						{t("header.discord.button")}
					</Link>
				</div>

				<NotificationCenter />

				<Suspense
					fallback={<Skeleton className="h-8 w-8 rounded-full" />}
				>
					<UserMenu />
				</Suspense>
			</div>
		</header>
	);
}
