import { auth } from "@/auth";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { SidebarProvider } from "@/context/sidebar-context";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const HotKeys = dynamic(
	() => import("@/components/hot-keys").then((mod) => mod.HotKeys),
	{
		ssr: true,
	},
);

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ orgId: string }>;
}) {
	const session = await auth();
	const orgId = (await params).orgId;
	const cookieStore = await cookies();
	const isCollapsed = cookieStore.get("sidebar-collapsed")?.value === "true";

	if (!session) {
		redirect("/auth");
	}

	if (!orgId) {
		redirect("/");
	}

	return (
		<div className="relative">
			<SidebarProvider initialIsCollapsed={isCollapsed}>
				<Sidebar />
				<MainContent>
					<Header />
					<main>{children}</main>
				</MainContent>
				<HotKeys />
			</SidebarProvider>
		</div>
	);
}
