import { OrganizationSwitcher } from '@/components/organization-switcher';
import { UserMenu } from '@/components/user-menu';
import { getOrganizations } from '@/data/getOrganizations';
import { auth } from '@/utils/auth';
import { Icons } from '@comp/ui/icons';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function UpgradeLayout({ children }: { children: React.ReactNode }) {
  // Check auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  // Get organizations for switcher
  const { organizations } = await getOrganizations();

  // Get current active organization from session
  const currentOrgId = session.session.activeOrganizationId;
  const currentOrganization = currentOrgId
    ? organizations.find((org) => org.id === currentOrgId) || null
    : null;

  const user = session.user;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal navbar matching setup style */}
      <header className="border/40 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8" />
            <span className="text-xl font-semibold">Comp</span>
          </Link>
          <div className="w-[240px]">
            <OrganizationSwitcher
              organizations={organizations}
              organization={currentOrganization}
            />
          </div>
        </div>

        <UserMenu />
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
