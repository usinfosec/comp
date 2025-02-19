import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function Unauthorized() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        We couldn't find an organization for you. Please contact your
        administrator.
      </main>
    </div>
  );
}
