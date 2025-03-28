"use client";

import { changeOrganizationAction } from "@/actions/change-organization";
import type { Framework, Organization } from "@bubba/db/types";
import { Button } from "@bubba/ui/button";
import { Dialog } from "@bubba/ui/dialog";
import { motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { CreateOrgModal } from "./modals/create-org-modal";
import { Avatar, AvatarImageNext, AvatarFallback } from "@bubba/ui/avatar";
import { Icons } from "@bubba/ui/icons";
import { cn } from "@bubba/ui/cn";
import { LogoSpinner } from "./logo-spinner";
import { useI18n } from "@/locales/client";
import { createPortal } from "react-dom";

interface OrgItem {
	id: string;
	name?: string;
	logo_url?: string;
}

interface OrganizationSwitcherProps {
	organizations: Organization[];
	organizationId: string | undefined;
	frameworks: Framework[];
	isCollapsed?: boolean;
}

export function OrganizationSwitcher({
	organizations,
	organizationId,
	frameworks,
	isCollapsed = false,
}: OrganizationSwitcherProps) {
	const t = useI18n();
	const router = useRouter();
	const [isOpen, onOpenChange] = useState(false);
	const [isActive, setActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { execute } = useAction(changeOrganizationAction, {
		onSuccess: (result) => {
			if (result.data?.success) {
				// Add a 2 second delay before navigation
				setTimeout(() => {
					const currentPath = window.location.pathname;
					const currentPathParts = currentPath.split("/");
					// Replace the organization ID part with the new one
					if (currentPathParts.length > 1) {
						currentPathParts[1] = result.data?.data?.id || "";
						router.push(currentPathParts.join("/"));
					} else {
						router.push(`/${result.data?.data?.id}`);
					}
					router.refresh();
				}, 1500);
			}
		},
		onError: (error) => {
			console.error(error);
			setIsLoading(false);
		},
	});

	const ref = useClickAway(() => {
		setActive(false);
	});

	const handleOrganizationChange = async (organizationId: string) => {
		setIsLoading(true);
		execute({ organizationId });
	};

	const currentOrganization = organizations.find(
		(org) => org.id === organizationId,
	);

	const sortedOrganizations = [
		currentOrganization,
		...organizations.filter((org) => org.id !== currentOrganization?.id),
	];

	return (
		<>
			{isLoading &&
				typeof window !== "undefined" &&
				createPortal(
					<>
						<style jsx global>{`
            body {
              overflow: hidden !important;
            }

            #__next > *:not(.org-switch-overlay) {
              pointer-events: none !important;
              filter: blur(8px) !important;
              opacity: 0.6 !important;
            }
          `}</style>
						<div className="org-switch-overlay">
							<div className="fixed inset-0 bg-background/80 z-[999999]" />
							<motion.div
								className="fixed inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-[999999] pointer-events-auto"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, ease: "easeOut" }}
							>
								<div className="flex flex-col items-center gap-2 p-6">
									<LogoSpinner />
									<p className="text-sm text-muted-foreground">
										{t("onboarding.switch")}
									</p>
								</div>
							</motion.div>
						</div>
					</>,
					document.body,
				)}

			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<motion.div
					ref={ref as React.RefObject<HTMLDivElement>}
					layout
					className={cn("relative", isCollapsed ? "w-[32px]" : "w-full")}
				>
					{[
						...sortedOrganizations.filter(Boolean).map((org) => ({
							org: {
								id: org?.id || "",
								name: org?.name || "",
							} as OrgItem,
						})),
						{ org: { id: "add" } as OrgItem },
					].map(({ org }, index) => (
						<motion.div
							key={org.id}
							className={cn(
								"w-[32px] h-[32px] left-0 overflow-hidden absolute",
								isLoading && "opacity-50 pointer-events-none",
							)}
							style={{ zIndex: -index }}
							initial={{
								scale: `${100 - index * 16}%`,
								y: index * 5,
							}}
							{...(isActive && {
								animate: {
									y: -(32 + 10) * index,
									scale: "100%",
								},
							})}
						>
							{org.id === "add" ? (
								<>
									<Button
										className="w-[32px] h-[32px]"
										size="icon"
										variant="outline"
										onClick={() => {
											onOpenChange(true);
											setActive(false);
										}}
										disabled={isLoading}
									>
										<Icons.Add />
									</Button>

									<CreateOrgModal
										onOpenChange={onOpenChange}
										frameworks={frameworks}
									/>
								</>
							) : (
								<Avatar
									className={cn(
										"w-[32px] h-[32px] rounded-none border border-[#DCDAD2] dark:border-[#2C2C2C] cursor-pointer",
										isLoading && "cursor-not-allowed",
									)}
									onClick={() => {
										if (isLoading) return;
										if (index === 0) {
											setActive(true);
										} else {
											handleOrganizationChange(org.id);
										}
									}}
								>
									<AvatarImageNext
										src={org?.logo_url || ""}
										alt={org?.name ?? ""}
										width={20}
										height={20}
										quality={100}
									/>
									<AvatarFallback className="rounded-none w-[32px] h-[32px]">
										<span className="text-xs">
											{org?.name?.charAt(0)?.toUpperCase()}
											{org?.name?.charAt(1)?.toUpperCase()}
										</span>
									</AvatarFallback>
								</Avatar>
							)}
						</motion.div>
					))}
				</motion.div>
			</Dialog>
		</>
	);
}
