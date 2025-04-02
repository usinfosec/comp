"use client";

import { useI18n } from "@/locales/client";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import { Badge } from "@bubba/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bubba/ui/card";
import type { Organization, Role } from "@prisma/client";
import { Crown, UserCheck, UserCog, UserMinus } from "lucide-react";

interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: Role;
  createdAt: Date;
  teamId?: string;
  user: {
    email: string;
    name: string;
    image?: string;
  };
}

export interface OrganizationWithMembers extends Organization {
  members: Member[];
}

interface MembersListProps {
  organization?: OrganizationWithMembers
}

export function MembersList({
  organization,
}: MembersListProps) {
  const t = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.team.members.title")}</CardTitle>
        <CardDescription>
          {t("settings.team.members.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {organization?.members.map((member) => {
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.user.image || undefined} />
                    <AvatarFallback>
                      {member.user.name
                        ? member.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                        : member.user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex flex-col space-y-1">
                      <span className="text-sm">
                        {member.user.name || member.user.email}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({member.user.email})
                        </span>
                      </span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="marketing" className="w-fit">
                          {getMemberRoleIcon(member.role)}
                          {t(`settings.team.members.role.${member.role}`)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>{t("settings.team.members.description")}</CardFooter>
    </Card>
  );
}

function getMemberRoleIcon(role: Role) {
  switch (role) {
    case "owner":
      return <Crown className="h-3 w-3" />;
    case "admin":
      return <UserCog className="h-3 w-3" />;
    case "employee":
      return <UserCheck className="h-3 w-3" />;
    case "auditor":
      return <UserMinus className="h-3 w-3" />;
    default:
      return <UserCheck className="h-3 w-3" />;
  }
}
