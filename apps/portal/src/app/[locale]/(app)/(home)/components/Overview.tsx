import { auth } from "@/app/lib/auth";
import { db } from "@bubba/db";
import { headers } from "next/headers";
import { EmployeeTasksList } from "./EmployeeTasksList";

export async function Overview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = session.user;
  const policies = await getPolicies();
  const trainingVideos = await getTrainingVideos();

  console.log({ user });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="text-sm">Please complete the following tasks</p>
      </div>
      <EmployeeTasksList
        policies={policies}
        trainingVideos={trainingVideos}
        user={user}
      />
    </div>
  );
}

const getPolicies = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  const policies = await db.organizationPolicy.findMany({
    where: {
      organizationId,
      isRequiredToSign: true,
    },
    orderBy: {
      policy: {
        name: "asc",
      },
    },
    include: {
      policy: true,
    },
  });

  return policies;
};

const getTrainingVideos = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.organizationId) {
    throw new Error("Unauthorized");
  }

  const organizationId = session.session.activeOrganizationId;

  const trainingVideos = await db.organizationTrainingVideos.findMany({
    where: { organizationId },
    include: {
      trainingVideo: true,
    },
    orderBy: {
      trainingVideo: {
        title: "asc",
      },
    },
  });

  return trainingVideos;
};
