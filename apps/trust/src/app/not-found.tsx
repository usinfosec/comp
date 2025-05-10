"use client";

import Link from "next/link";
import { Suspense } from "react";

export default function NotFound() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="h-screen flex flex-col items-center justify-center text-center text-sm text-muted-foreground ">
				<h2 className="text-xl font-semibold mb-2">
					Organization not found
				</h2>
				<p className="mb-4">The organization you are looking for does not exist.</p>
				<Link href="/" className="underline">
					Go to home
				</Link>
			</div>
		</Suspense>
	);
}
