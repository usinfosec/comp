import { auth } from "@/auth";
import { TaskComment } from "@/components/risks/tasks/task-comments";
import { TaskOverview } from "@/components/risks/tasks/task-overview";
import { TaskAttachments } from "@/components/risks/tasks/task-attachments";
import { getI18n } from "@/locales/server";
import { db } from "@bubba/db";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { useUsers } from "@/hooks/use-users";

interface PageProps {
  params: Promise<{ riskId: string; taskId: string }>;
}

export default async function RiskPage({ params }: PageProps) {
  const { riskId, taskId } = await params;
  const task = await getTask(riskId, taskId);
  const users = await useUsers();

  if (!task) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskOverview task={task} users={users} />
      <TaskComment task={task} users={users} />
      <TaskAttachments taskId={taskId} />
    </div>
  );
}

const getTask = cache(
  async (riskId: string, taskId: string) => {
    const session = await auth();

    if (!session || !session.user.organizationId) {
      redirect("/");
    }

    const task = await db.riskMitigationTask.findUnique({
      where: {
        riskId: riskId,
        id: taskId,
        organizationId: session.user.organizationId,
      },
      include: {
        owner: true,
        TaskAttachment: true,
        TaskComments: true,
      },
    });

    return task;
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  return {
    title: t("sub_pages.risk.tasks.task_overview"),
  };
}
