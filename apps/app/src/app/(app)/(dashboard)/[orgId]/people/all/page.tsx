import type { Metadata } from "next";
import { TeamMembers } from "./components/TeamMembers";

export default async function Members() {
	return (
		<div className="space-y-4 sm:space-y-4">
			<TeamMembers />
		</div>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "People",
	};
}
