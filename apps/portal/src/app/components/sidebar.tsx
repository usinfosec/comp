import { Icons } from "@comp/ui/icons";
import Link from "next/link";
import { MainMenu } from "./main-menu";

export async function Sidebar() {
	return (
		<aside className="sticky top-0 h-screen w-16 shrink-0 flex-col justify-between items-center border-r bg-background py-4 hidden md:flex">
			<div className="flex flex-col items-center justify-center gap-4">
				<Link href="/">
					<Icons.Logo />
				</Link>
				<MainMenu />
			</div>
		</aside>
	);
}
