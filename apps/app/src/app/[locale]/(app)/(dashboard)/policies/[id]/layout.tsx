import { auth } from "@/auth";
import { redirect } from "next/navigation";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "@bubba/ui/globals.css";
import "@bubba/ui/text-editor";
import "@bubba/ui/prosemirror";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.organizationId || !id) {
    redirect("/policies");
  }

  return (
    <div className="max-w-[1200px] space-y-4">
      <main className="h-[calc(100vh-4rem-4rem)]">{children}</main>
    </div>
  );
}
