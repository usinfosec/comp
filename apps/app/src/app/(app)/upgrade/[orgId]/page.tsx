import { getSubscriptionData } from '@/app/api/stripe/getSubscriptionData';
import { AiWorkPreview } from '@/components/ai-work-preview';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { Alert, AlertDescription } from '@comp/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@comp/ui/card';
import { Separator } from '@comp/ui/separator';
import { CheckIcon, Info } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UpgradeCheckoutForm } from './upgrade-checkout-form';

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

  const complianceFeatures = [
    'AI-powered policy generation tailored to your stack',
    'Automated vendor security research & documentation',
    'Risk assessment & management tools',
    'Evidence collection from 100+ integrations',
    'Task tracking & automated assignments',
    'Customer trust portal',
    'Unlimited team members',
    'API access & webhooks',
  ];

  const auditFeatures = [
    'Dedicated audit manager',
    'Auditor portal access',
    'Pre-audit readiness assessment',
    'Audit evidence packaging',
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:min-h-[600px]">
          {/* Left side - AI Work Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <AiWorkPreview />
            </div>
          </div>

          {/* Right side - Pricing */}
          <div className="w-full max-w-[480px] mx-auto lg:mx-0">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Comp Platform</CardTitle>
                <CardDescription>Get audit-ready with AI-powered compliance</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-semibold">$599</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    14-day free trial • Cancel anytime
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Compliance platform includes:</p>
                    <ul className="space-y-2">
                      {complianceFeatures.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-sm">
                      <span className="font-medium">Audits available separately</span>
                      <p className="mt-1 text-xs">
                        When you're ready for SOC 2, ISO 27001, or other audits, our audit services
                        start at $12,000 and include:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {auditFeatures.map((feature) => (
                          <li key={feature} className="text-xs">
                            • {feature}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <UpgradeCheckoutForm organizationId={orgId} />

                <p className="text-center text-xs text-muted-foreground">
                  No credit card required for trial
                </p>
              </CardFooter>
            </Card>

            {/* Mobile AI preview */}
            <div className="mt-8 lg:hidden">
              <Separator className="mb-8" />
              <AiWorkPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
