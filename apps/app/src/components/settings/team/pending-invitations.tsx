'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bubba/ui/card";
import { PendingInvitationItem } from "./pending-invitation-item";
import type { MembershipRole, Departments } from "@prisma/client";
import { useI18n } from "@/locales/client";

interface PendingInvitation {
  id: string;
  organizationId: string;
  department: Departments;
  userId: string;
  role: MembershipRole;
  invitedEmail: string | null;
  accepted: boolean;
  joinedAt: Date;
  lastActive: Date | null;
}

interface PendingInvitationsProps {
  pendingInvitations: PendingInvitation[];
  hasOrganization: boolean;
}

export function PendingInvitations({ pendingInvitations, hasOrganization }: PendingInvitationsProps) {
  const t = useI18n();

  if (!hasOrganization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.team.invitations.empty.no_organization.title")}</CardTitle>
          <CardDescription>{t("settings.team.invitations.empty.no_organization.description")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (pendingInvitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.team.invitations.empty.no_invitations.title")}</CardTitle>
          <CardDescription>{t("settings.team.invitations.empty.no_invitations.description")}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.team.invitations.title")}</CardTitle>
          <CardDescription>
            {t("settings.team.invitations.description")} ({pendingInvitations.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingInvitations.map((invitation) => (
              <PendingInvitationItem key={invitation.id} invitation={invitation} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}