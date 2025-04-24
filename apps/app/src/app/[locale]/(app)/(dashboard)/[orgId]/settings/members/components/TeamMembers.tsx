"use server";

import { inviteMember } from "@/actions/organization/invite-member";
import { removeMember } from "@/actions/organization/remove-member";
import { revokeInvitation } from "@/actions/organization/revoke-invitation";
import { updateMemberRole } from "@/actions/organization/update-member-role";
import { auth } from "@/utils/auth";
import { db } from "@comp/db";
import type { Invitation, Member, User } from "@prisma/client";
import { headers } from "next/headers";
import { TeamMembersClient } from "./TeamMembersClient";

export interface MemberWithUser extends Member {
	user: User;
}

export interface TeamMembersData {
	members: MemberWithUser[];
	pendingInvitations: Invitation[];
}

export async function TeamMembers() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const organizationId = session?.session.activeOrganizationId;

	let members: MemberWithUser[] = [];
	let pendingInvitations: Invitation[] = [];

	if (organizationId) {
		const fetchedMembers = await db.member.findMany({
			where: {
				organizationId: organizationId,
			},
			include: {
				user: true,
			},
		});

		members = fetchedMembers.filter(
			(member) =>
				!member.role.split(",").includes("employee") &&
				member.role.split(",").length > 0,
		);

		pendingInvitations = await db.invitation.findMany({
			where: {
				organizationId,
				status: "pending",
			},
		});
	}

	const data: TeamMembersData = {
		members: members,
		pendingInvitations: pendingInvitations,
	};

	return (
		<TeamMembersClient
			data={data}
			organizationId={organizationId ?? ""}
			removeMemberAction={removeMember}
			updateMemberRoleAction={updateMemberRole}
			revokeInvitationAction={revokeInvitation}
		/>
	);
}
