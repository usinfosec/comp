import { AnimatedGradientBackground } from '@/app/(app)/setup/components/AnimatedGradientBackground';
import { getSubscriptionData } from '@/app/api/stripe/getSubscriptionData';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PricingCards } from './pricing-cards';

interface PageProps {
  params: Promise<{
    orgId: string;
  }>;
}

export default async function UpgradePage({ params }: PageProps) {
  const { orgId } = await params;

  // Check auth
  const authSession = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authSession?.user?.id) {
    redirect('/sign-in');
  }

  // Verify user has access to this org
  const member = await db.member.findFirst({
    where: {
      organizationId: orgId,
      userId: authSession.user.id,
    },
    include: {
      organization: {
        select: {
          name: true,
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!member) {
    redirect('/');
  }

  // Check if they already have an active subscription
  if (member.organization.stripeCustomerId) {
    const subscription = await getSubscriptionData(member.organization.stripeCustomerId);
    if (subscription && (subscription.status === 'active' || subscription.status === 'trialing')) {
      // Already subscribed, redirect to dashboard
      redirect(`/${orgId}`);
    }
  }

  return (
    <>
      <AnimatedGradientBackground scale={1.5} />
      <div className="mx-auto px-4 py-8 max-w-7xl">
        <div className="relative">
          <div className="relative bg-transparent p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Upgrade Your Plan</h1>
              <p className="text-xl text-muted-foreground">
                Get audit-ready with AI-powered compliance automation
              </p>
            </div>

            <PricingCards organizationId={orgId} />
          </div>
        </div>
      </div>
    </>
  );
}
