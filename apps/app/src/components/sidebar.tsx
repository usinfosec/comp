
import { getOrganizations } from "@/data/getOrganizations";
import type { Organization, FrameworkEditorFramework } from "@comp/db/types";
import { cookies } from "next/headers";
import { MainMenu } from "./main-menu";
import { OrganizationSwitcher } from "./organization-switcher";
import { SidebarCollapseButton } from "./sidebar-collapse-button";
import { SidebarLogo } from "./sidebar-logo";
import { db } from "@comp/db";
import { cn } from "@comp/ui/cn";

export async function Sidebar({
	organization,
	collapsed = false,
}: { organization: Organization | null, collapsed?: boolean }) {
	const cookieStore = await cookies();
	const isCollapsed = collapsed || cookieStore.get("sidebar-collapsed")?.value === "true";
	const { organizations } = await getOrganizations();
	const frameworks = await db.frameworkEditorFramework.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			version: true,
			visible: true,
		},
	});

	return (
		<div className="h-full flex flex-col gap-0 overflow-x-clip bg-secondary/30">
			<div className="p-4 flex flex-col gap-2">
				<div className={cn("flex items-center justify-start", isCollapsed && "justify-center")}>
					<SidebarLogo isCollapsed={isCollapsed} />
				</div>	
				<div className="flex flex-col gap-2 mt-2">
					<OrganizationSwitcher
						organizations={organizations}
						organization={organization}
						isCollapsed={isCollapsed}
						frameworks={frameworks}
					/>
					<MainMenu
						organizationId={organization?.id ?? ""}
						isCollapsed={isCollapsed}
					/>
				</div>
			</div>
			<div className="flex-1" />
		
				<div className="flex justify-center border-b border-border py-2">
					<SidebarCollapseButton isCollapsed={isCollapsed} />
				</div>
	

		</div>
	);
}
