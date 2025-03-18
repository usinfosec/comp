import { auth } from "@/auth";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { db } from "@bubba/db";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { cache } from "react";

const HotKeys = dynamic(
  () => import("@/components/hot-keys").then((mod) => mod.HotKeys),
  {
    ssr: true,
  },
);

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || !session.user.organizationId) {
    redirect("/auth");
  }

  const isSetup = await isOrganizationSetup(session.user.organizationId);

  if (!isSetup) {
    redirect("/setup");
  }

  return (
    <div className="relative">
      <Sidebar />

      <div className="mx-4 md:ml-[95px] md:mr-10 pb-8">
        <Header />
        <main>{children}</main>
      </div>

      <HotKeys />
    </div>
  );
}

const isOrganizationSetup = cache(async (organizationId: string) => {
  const organization = await db.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      setup: true,
    },
  });

  return organization?.setup;
});
