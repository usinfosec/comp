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

interface UserVendorStats {
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  totalVendors: number;
  notAssessedVendors: number;
  inProgressVendors: number;
  assessedVendors: number;
}

export async function VendorsByAssignee({ organizationId }: Props) {
  const t = await getI18n();

  const userStats = await userData(organizationId);

  const stats: UserVendorStats[] = userStats.map((user) => ({
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
    },
    totalVendors: user.Vendors.length,
    notAssessedVendors: user.Vendors.filter(
      (vendor) => vendor.status === "not_assessed",
    ).length,
    inProgressVendors: user.Vendors.filter(
      (vendor) => vendor.status === "in_progress",
    ).length,
    assessedVendors: user.Vendors.filter(
      (vendor) => vendor.status === "assessed",
    ).length,
  }));

  stats.sort((a, b) => b.totalVendors - a.totalVendors);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("vendor.dashboard.vendors_by_assignee")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-4">
            {stats.map((stat) => (
              <Link
                href={`/vendors/register?ownerId=${stat.user.id}`}
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
                        {stat.totalVendors} {t("vendor.vendors")}
                      </span>
                    </div>

                    <div className="mt-2 w-full bg-muted rounded-full h-2 overflow-hidden">
                      {stat.totalVendors > 0 && (
                        <div className="h-full flex">
                          {stat.notAssessedVendors > 0 && (
                            <div
                              className="bg-yellow-500 h-full"
                              style={{
                                width: `${(stat.notAssessedVendors / stat.totalVendors) * 100}%`,
                              }}
                              title={`${t("common.status.not_assessed")}: ${stat.notAssessedVendors}`}
                            />
                          )}
                          {stat.inProgressVendors > 0 && (
                            <div
                              className="bg-blue-500 h-full"
                              style={{
                                width: `${(stat.inProgressVendors / stat.totalVendors) * 100}%`,
                              }}
                              title={`${t("common.status.in_progress")}: ${stat.inProgressVendors}`}
                            />
                          )}
                          {stat.assessedVendors > 0 && (
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                width: `${(stat.assessedVendors / stat.totalVendors) * 100}%`,
                              }}
                              title={`${t("common.status.assessed")}: ${stat.assessedVendors}`}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-1.5 hidden lg:flex items-center gap-3 text-xs text-muted-foreground">
                      {stat.notAssessedVendors > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-yellow-500" />
                          <span>
                            {t("common.status.not_assessed")} (
                            {stat.notAssessedVendors})
                          </span>
                        </div>
                      )}
                      {stat.inProgressVendors > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-blue-500" />
                          <span>
                            {t("common.status.in_progress")} (
                            {stat.inProgressVendors})
                          </span>
                        </div>
                      )}
                      {stat.assessedVendors > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="size-2 rounded-full bg-green-500" />
                          <span>
                            {t("common.status.assessed")} (
                            {stat.assessedVendors})
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
      Vendors: {
        some: {},
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
      Vendors: {
        select: {
          status: true,
        },
      },
    },
  });
}
