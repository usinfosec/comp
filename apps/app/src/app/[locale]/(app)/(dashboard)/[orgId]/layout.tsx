import { auth } from "@comp/auth";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { AnimatedLayout } from "@/components/animated-layout";
import { SidebarProvider } from "@/context/sidebar-context";
import { cookies, headers } from "next/headers";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { UserProvider } from "@/store/user/provider";
import { AssistantSheet } from "@/components/sheets/assistant-sheet";

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
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
		<SidebarProvider initialIsCollapsed={isCollapsed}>
			<AnimatedLayout sidebar={<Sidebar />} isCollapsed={isCollapsed}>
				<div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
					<Header />
					<main>{children}</main>
				</div>
				<AssistantSheet />
			</AnimatedLayout>
			<HotKeys />
		</SidebarProvider>
	);
}
