import { getOrganizations } from '@/data/getOrganizations';
import { auth } from '@/utils/auth';
import type { Organization } from '@comp/db/types';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { OrganizationSetupForm } from './components/OrganizationSetupForm';

export const metadata: Metadata = {
  title: 'Setup Your Organization | Comp AI',
};

interface SetupPageProps {
  searchParams: Promise<{ inviteCode?: string }>;
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.session) {
    return redirect('/auth');
  }

  // If there's an inviteCode in the URL, redirect to the new invitation route
  const { inviteCode } = await searchParams;
  if (inviteCode) {
    return redirect(`/invite/${inviteCode}`);
  }

  // Fetch existing organizations
  let organizations: Organization[] = [];

  try {
    const result = await getOrganizations();
    organizations = result.organizations;
  } catch (error) {
    // If user has no organizations, continue with empty array
    console.error('Failed to fetch organizations:', error);
  }

  return <OrganizationSetupForm existingOrganizations={organizations} />;
}
