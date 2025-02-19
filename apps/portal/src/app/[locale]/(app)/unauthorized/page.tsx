import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function Unauthorized() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <h1>
        We couldn't find an organization for you. Please contact your
        administrator.
      </h1>
    </div>
  );
}
