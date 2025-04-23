import { getI18n } from "@/locales/server";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@comp/ui/tabs";
import { headers } from "next/headers";
import { cache } from "react";
import { InviteMemberForm } from "./InviteMemberForm";
import { MembersList } from "./MembersList";
import { PendingInvitations } from "./PendingInvitations";

export async function TeamMembers() {
	const t = await getI18n();

	const pendingInvitations = await getPendingInvitations();
	const members = await getMembers();

	return (
		<Tabs defaultValue="members">
			<TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-sm mb-1 p-0 h-auto pb-4">
				<TabsTrigger value="members" className="p-0 m-0 mr-4">
					{t("settings.team.tabs.members")}
				</TabsTrigger>

				<TabsTrigger value="invite" className="p-0 m-0">
					{t("settings.team.tabs.invite")}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="members">
				<MembersList members={members ?? []} />
			</TabsContent>

			<TabsContent value="invite">
				<div className="flex flex-col gap-4">
					<PendingInvitations
						pendingInvitations={pendingInvitations}
					/>
					<InviteMemberForm />
				</div>
			</TabsContent>
		</Tabs>
	);
}

const getMembers = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.session.activeOrganizationId) {
		return null;
	}

	const members = await db.member.findMany({
		where: {
			organizationId: session?.session.activeOrganizationId,
		},
		include: {
			user: true,
		},
	});

	// Filter out users who only have the "employee" role
	// We want to show only team members with administrative roles
	const filteredMembers = members.filter(
		(member) =>
			!member.role.split(",").includes("employee") &&
			member.role.split(",").length > 0,
	);

	return filteredMembers;
});

const getOrganizationId = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session?.session.activeOrganizationId;
});

const getPendingInvitations = cache(async () => {
	const organizationId = await getOrganizationId();

	if (!organizationId) {
		return [];
	}

	return db.invitation.findMany({
		where: {
			organizationId,
			status: "pending",
		},
	});
});
