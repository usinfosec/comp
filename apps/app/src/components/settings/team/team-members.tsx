import { cache } from "react";
import { auth } from "@bubba/auth";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bubba/ui/tabs";
import { InviteMemberForm } from "./invite-member-form";
import { MembersList } from "./members-list";
import { PendingInvitations } from "./pending-invitations";
import { headers } from "next/headers";
import type { OrganizationWithMembers } from "./members-list";

export async function TeamMembers() {
  const t = await getI18n();

  const pendingInvitations = await getPendingInvitations();
  const organization = await getOrganizationMembers();

  return (
    <Tabs defaultValue="members">
      <TabsList className="bg-transparent border-b-[1px] w-full justify-start rounded-none mb-1 p-0 h-auto pb-4">
        <TabsTrigger value="members" className="p-0 m-0 mr-4">
          {t("settings.team.tabs.members")}
        </TabsTrigger>

        <TabsTrigger value="invite" className="p-0 m-0">
          {t("settings.team.tabs.invite")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="members">
        {organization ? <MembersList organization={organization as OrganizationWithMembers} /> : null}
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

const getOrganizationMembers = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session.activeOrganizationId) {
    return null;
  }

  return auth.api.getFullOrganization({
    organizationId: session?.session.activeOrganizationId,
    headers: await headers(),
  });
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
