import { OnboardingClient } from '@/components/forms/create-organization-form';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { AcceptInvite } from './components/accept-invite';

export const metadata: Metadata = {
  title: 'Organization Setup | Comp AI',
};

interface SearchParams {
  intent?: string;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || !session.session) {
    return redirect('/');
  }

  // Check if user is intentionally creating additional organization
  const isCreatingAdditional = searchParams.intent === 'create-additional';

  const organization = await db.organization.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  const hasInvite = await db.invitation.findFirst({
    where: {
      email: session.user.email,
      status: 'pending',
      role: {
        not: 'employee',
      },
    },
  });

  // If user has an organization and is not intentionally creating a new one, redirect
  if (organization?.id && !hasInvite && !isCreatingAdditional) {
    await auth.api.setActiveOrganization({
      headers: headersList,
      body: {
        organizationId: organization.id,
      },
    });

    return redirect(`/${organization.id}/frameworks`);
  }

  // Handle pending invitations
  if (hasInvite && !isCreatingAdditional) {
    const organization = await db.organization.findUnique({
      where: {
        id: hasInvite.organizationId,
      },
      select: {
        name: true,
      },
    });

    return <AcceptInvite inviteCode={hasInvite.id} organizationName={organization?.name || ''} />;
  }

  const frameworks = await db.frameworkEditorFramework.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      version: true,
      visible: true,
    },
  });

  return <OnboardingClient frameworks={frameworks} />;
}
