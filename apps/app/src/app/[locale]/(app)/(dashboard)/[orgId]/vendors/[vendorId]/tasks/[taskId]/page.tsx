"use server";

import Title from "./components/title/title";
import SecondaryFields from "./components/secondary-fields/secondary-fields";
import Comments from "./components/comments/comments";
import Attachments from "./components/attachments/attachments";
import { auth } from "@/auth";
import { db } from "@bubba/db";
import { notFound, redirect } from "next/navigation";
import { getI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

interface PageProps {
  params: { locale: string; orgId: string; vendorId: string; taskId: string };
}

export default async function TaskPage({ params }: PageProps) {
  setStaticParamsLocale(params.locale);
  const t = await getI18n();
  
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch the task
  const task = await db.vendorTask.findUnique({
    where: {
      id: params.taskId,
      organizationId: params.orgId,
      vendorId: params.vendorId
    },
    include: {
      owner: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });

  if (!task) {
    notFound();
  }

  // Fetch organization users
  const users = await db.organizationMember.findMany({
    where: {
      organizationId: params.orgId,
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
      <Comments />
      <Attachments />
    </div>
  );
}