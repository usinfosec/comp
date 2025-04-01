import { auth } from "@bubba/auth";
import { redirect } from "next/navigation";
import { cache, Suspense } from "react";
import { db } from "@bubba/db";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { EvidenceStatusChart } from "./components/evidence-status-chart";
import { EvidenceAssigneeChart } from "./components/evidence-assignee-chart";
import Loading from "./loading";
import { headers } from "next/headers";

export default async function EvidenceOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const overview = await getEvidenceOverview();

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-4 sm:space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <EvidenceStatusChart data={overview} />
          <EvidenceAssigneeChart data={overview?.assigneeData} />
        </div>
      </div>
    </Suspense>
  )
}

const getEvidenceOverview = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.organizationId) {
    return redirect("/");
  }

  const organizationId = session.session.activeOrganizationId;

  return await db.$transaction(async (tx) => {
    const [totalEvidence, publishedEvidence, draftEvidence, isNotRelevant, evidenceByAssignee, evidenceByAssigneeStatus] = await Promise.all(
      [
        tx.evidence.count({
          where: {
            organizationId,
          },
        }),
        tx.evidence.count({
          where: {
            organizationId,
            published: true,
          },
        }),
        tx.evidence.count({
          where: {
            organizationId,
            published: false,
          },
        }),
        tx.evidence.count({
          where: {
            organizationId,
            isNotRelevant: true,
          },
        }),
        tx.evidence.groupBy({
          by: ["assigneeId"],
          _count: true,
          where: {
            organizationId,
          },
        }),
        tx.evidence.findMany({
          where: {
            organizationId,
            assigneeId: { not: null },
          },
          select: {
            published: true,
            isNotRelevant: true,
            assignee: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ],
    );

    const evidenceAssigneeByStatus = new Map();

    for (const evidence of evidenceByAssigneeStatus) {
      if (!evidence.assignee) continue;

      const assigneeId = evidence.assignee.id;

      if (!evidenceAssigneeByStatus.has(assigneeId)) {
        evidenceAssigneeByStatus.set(assigneeId, {
          id: assigneeId,
          name: evidence.assignee.name || "Unknown",
          total: 0,
          published: 0,
          draft: 0,
          isNotRelevant: 0,
          needsReview: 0,
        });
      }

      const assigneeData = evidenceAssigneeByStatus.get(assigneeId);
      assigneeData.total += 1;

      // status = published if published is true
      // status = draft if published is false and isNotRelevant is false
      // status = isNotRelevant if published is false and isNotRelevant is true
      // status = needsReview if published is true and needs review

      if (evidence.published) {
        assigneeData.published += 1;
      } else if (evidence.isNotRelevant) {
        assigneeData.isNotRelevant += 1;
      } else {
        // If not published and not irrelevant, it's a draft
        assigneeData.draft += 1;
      }
    }

    const assigneeData = Array.from(evidenceAssigneeByStatus.values());

    return {
      totalEvidence,
      publishedEvidence,
      draftEvidence,
      isNotRelevant,
      evidenceByAssignee,
      evidenceByAssigneeStatus,
      assigneeData,
    };
  });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("sidebar.evidence"),
  };
}
