import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bubba/ui/tabs";
import { Suspense } from "react";
import { InviteMemberForm } from "./invite-member-form";
import { MembersList } from "./members-list";
import { PendingInvitations } from "./pending-invitations";
import { db } from "@bubba/db";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { getI18n } from "@/locales/server";

export async function TeamMembers() {
  const session = await auth();
  const organizationId = session?.user?.organizationId;
  const t = await getI18n();

  const members = organizationId ? await getOrganizationMembers(organizationId) : [];
  const pendingInvitations = organizationId ? await getPendingInvitations(organizationId) : [];

  const userRole = members.find(member => member.userId === session?.user?.id)?.role;

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
        <MembersList
          members={members}
          currentUserRole={userRole}
          hasOrganization={!!organizationId}
        />
      </TabsContent>

      <TabsContent value="invite">
        <div className="flex flex-col gap-4">
          <PendingInvitations
            pendingInvitations={pendingInvitations}
            hasOrganization={!!organizationId}
          />
          <InviteMemberForm />
        </div>
      </TabsContent>
    </Tabs>
  );
}


const getOrganizationMembers = unstable_cache(
  async (organizationId: string) => {
    return db.organizationMember.findMany({
      where: {
        organizationId,
        accepted: true,
      },
      include: {
        user: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });
  },
  ["organization-members"],
  { tags: ["organization-members"], revalidate: 60 }
);

const getPendingInvitations = unstable_cache(
  async (organizationId: string) => {
    return db.organizationMember.findMany({
      where: {
        organizationId,
        accepted: false,
        invitedEmail: { not: null },
      },
      orderBy: {
        joinedAt: "desc",
      },
    });
  },
  ["pending-invitations"],
  { tags: ["pending-invitations"], revalidate: 60 }
);