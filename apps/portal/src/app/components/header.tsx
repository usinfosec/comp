import { UserMenu } from "@/app/components/user-menu";
import { Skeleton } from "@comp/ui/skeleton";
import { Suspense } from "react";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
	return (
		<header className="z-10 border-b border-border flex justify-between pt-4 pb-2 md:pb-4 items-center sticky top-0 backdrop-filter backdrop-blur-xl md:backdrop-filter-none bg-background/70 md:bg-transparent">
			<MobileMenu />

			<div className="flex space-x-2 ml-auto">
				<Suspense
					fallback={<Skeleton className="h-8 w-8 rounded-full" />}
				>
					<UserMenu />
				</Suspense>
			</div>
		</header>
	);
}
