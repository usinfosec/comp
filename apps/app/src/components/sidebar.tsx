import { Icons } from "@bubba/ui/icons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { OrgMenu } from "./org-menu";
import { MainMenu } from "./main-menu";
import { cookies } from "next/headers";
import { SidebarCollapseButton } from "./sidebar-collapse-button";
import { SidebarLogo } from "./sidebar-logo";
import { cn } from "@bubba/ui/cn";

export async function Sidebar() {
	const session = await auth();
	const user = session?.user;
	const organizationId = user?.organizationId;
	const cookieStore = await cookies();
	const isCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

	if (!organizationId) {
		redirect("/");
	}

	return (
		<>
			<aside
				className={cn(
					"h-screen flex-shrink-0 flex-col justify-between fixed top-0 px-4 pb-16 items-center hidden md:flex border-r transition-all duration-300",
					isCollapsed ? "w-[80px]" : "w-[240px]",
				)}
			>
				<div className="flex flex-col items-center justify-center w-full">
					<div
						className={cn(
							"mt-2 todesktop:mt-[35px] w-full relative",
							isCollapsed
								? "flex justify-center"
								: "flex justify-between items-center",
						)}
					>
						<SidebarLogo
							isCollapsed={isCollapsed}
							organizationId={organizationId}
						/>
						<SidebarCollapseButton isCollapsed={isCollapsed} />
					</div>
					<MainMenu
						userIsAdmin={user?.isAdmin ?? false}
						organizationId={organizationId}
						isCollapsed={isCollapsed}
					/>
				</div>

				<Suspense>
					<OrgMenu isCollapsed={isCollapsed} />
				</Suspense>
			</aside>
		</>
	);
}
