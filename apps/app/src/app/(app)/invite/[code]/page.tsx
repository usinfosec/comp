import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { AcceptInvite } from '../../setup/components/accept-invite';

interface InvitePageProps {
  params: Promise<{ code: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // Redirect to auth with the invite code
    return redirect(`/auth?inviteCode=${code}`);
  }

  // Check if this invitation exists and is valid for this user
  const invitation = await db.invitation.findFirst({
    where: {
      id: code,
      email: session.user.email,
      status: 'pending',
    },
    include: {
      organization: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!invitation) {
    // Either invitation doesn't exist, already accepted, or not for this user
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AcceptInvite
        inviteCode={invitation.id}
        organizationName={invitation.organization.name || ''}
      />
    </div>
  );
}
