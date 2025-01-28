import { getInitials } from "@/lib/utils";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import { Avatar, AvatarFallback, AvatarImage } from "@bubba/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { ScrollArea } from "@bubba/ui/scroll-area";
import Link from "next/link";

interface Props {
  organizationId: string;
}

interface UserPolicyStats {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  totalPolicies: number;
  draftPolicies: number;
  publishedPolicies: number;
  needsReviewPolicies: number;
}

export async function PoliciesByAssignee({ organizationId }: Props) {
  const t = await getI18n();

  const userStats = await userData(organizationId);

  const stats: UserPolicyStats[] = userStats.map((user) => ({
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
    },
    totalPolicies: user.Artifact.length,
    draftPolicies: user.Artifact.filter((policy) => !policy.published).length,
    publishedPolicies: user.Artifact.filter((policy) => policy.published)
      .length,
    needsReviewPolicies: user.Artifact.filter((policy) => policy.needsReview)
      .length,
  }));

  stats.sort((a, b) => b.totalPolicies - a.totalPolicies);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("policies.dashboard.policies_by_assignee")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-4">
            {stats.map((stat) => (
              <Link
                href={`/policies/all?ownerId=${stat.user.id}`}
                key={stat.user.id}
              >
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                  <Avatar>
                    <AvatarImage src={stat.user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(stat.user.name || "Unknown User")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none truncate">
                        {stat.user.name || "Unknown User"}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {stat.totalPolicies} {t("policies.policies")}
                      </span>
                    </div>

                    <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
                      {stat.totalPolicies > 0 && (
                        <div className="h-full flex">
                          {stat.draftPolicies > 0 && (
                            <div
                              className="bg-yellow-500 h-full"
                              style={{
                                width: `${(stat.draftPolicies / stat.totalPolicies) * 100}%`,
                              }}
                              title={`${t("policies.status.draft")}: ${stat.draftPolicies}`}
                            />
                          )}
                          {stat.publishedPolicies > 0 && (
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                width: `${(stat.publishedPolicies / stat.totalPolicies) * 100}%`,
                              }}
                              title={`${t("policies.status.published")}: ${stat.publishedPolicies}`}
                            />
                          )}
                          {stat.needsReviewPolicies > 0 && (
                            <div
                              className="bg-blue-500 h-full"
                              style={{
                                width: `${(stat.needsReviewPolicies / stat.totalPolicies) * 100}%`,
                              }}
                              title={`${t("policies.status.needs_review")}: ${stat.needsReviewPolicies}`}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
                      {stat.draftPolicies > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-yellow-500" />
                          <span>
                            {t("policies.status.draft")} ({stat.draftPolicies})
                          </span>
                        </div>
                      )}
                      {stat.publishedPolicies > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-green-500" />
                          <span>
                            {t("policies.status.published")} (
                            {stat.publishedPolicies})
                          </span>
                        </div>
                      )}
                      {stat.needsReviewPolicies > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-blue-500" />
                          <span>
                            {t("policies.status.needs_review")} (
                            {stat.needsReviewPolicies})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

async function userData(organizationId: string) {
  return await db.user.findMany({
    where: {
      organizationId,
      Artifact: {
        some: {
          type: "policy",
        },
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      Artifact: {
        where: {
          type: "policy",
        },
        select: {
          published: true,
          needsReview: true,
        },
      },
    },
  });
}
