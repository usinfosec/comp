import { auth } from "@/app/lib/auth";
import { db } from "@bubba/db";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = await getUser(session.user.email);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {user?.id && user?.organization?.id && (
          <div>
            <h1>Welcome to the portal</h1>

            <p>You are logged in as {user.email}</p>

            <p>
              You work for {user.organization.name} and your employee ID is{" "}
              {user.id}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

const getUser = unstable_cache(async (email: string) => {
  "use server";

  const employee_data = await db.employee.findFirst({
    where: {
      email,
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return employee_data;
});
