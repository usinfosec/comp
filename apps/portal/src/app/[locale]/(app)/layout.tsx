import { Header } from "@/app/components/header";
import { Sidebar } from "@/app/components/sidebar";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/auth");
	}

	return (
		<div className="flex min-h-screen">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<div className="w-full px-4 sm:px-6 lg:px-8">
					<Header />
				</div>
				<main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{children}
				</main>
			</div>
		</div>
	);
}
