"use server";

import Title from "./components/title/title";
import SecondaryFields from "./components/secondary-fields/secondary-fields";
import Attachments from "./components/attachments/attachments";
import { auth } from "@/auth/auth";
import { db } from "@bubba/db";
import { notFound, redirect } from "next/navigation";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    locale: string;
    orgId: string;
    vendorId: string;
    taskId: string;
  }>;
}

export default async function TaskPage({ params }: PageProps) {
  const { locale, orgId, vendorId, taskId } = await params;
  setStaticParamsLocale(locale);
  const t = await getI18n();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch the task
  const task = await db.vendorTask.findUnique({
    where: {
      id: taskId,
      organizationId: orgId,
      vendorId: vendorId,
    },
    include: {
      owner: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  if (!task) {
    notFound();
  }

  // Fetch organization users
  const users = await db.organizationMember.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const formattedUsers = users.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    image: member.user.image,
  }));

  return (
    <div className="space-y-8">
      <Title task={task} />
      <SecondaryFields task={task} users={formattedUsers} />
      <Attachments taskId={taskId} />
    </div>
  );
}
