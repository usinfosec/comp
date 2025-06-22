'use client';

import { generateCheckoutSessionAction } from '@/app/api/stripe/generate-checkout-session/generate-checkout-session';
import { SelectionIndicator } from '@/components/layout/SelectionIndicator';
import { env } from '@/env.mjs';
import { Badge } from '@comp/ui/badge';
import { Button } from '@comp/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@comp/ui/card';
import { Switch } from '@comp/ui/switch';
import { CheckIcon, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface PricingCardsProps {
  organizationId: string;
}

const starterFeatures = [
  'AI-powered policy generation',
  'Automated vendor research',
  'Risk assessment & compliance',
  'Task tracking & trust portal',
  'Unlimited team members',
  'Real-time compliance monitoring',
  'Basic integrations (AWS, GitHub)',
  'API access & email support',
];

const professionalFeatures = [
  'Everything in Starter, plus:',
  'Priority Slack support',
  'Dedicated success manager',
  'Custom integrations',
  'Advanced analytics & reporting',
  'Premium integrations (100+)',
  'White-glove onboarding',
];

const auditFeatures = [
  'SOC 2 Type II certification',
  'Dedicated audit manager',
  'Evidence packaging',
  'Live audit support',
];

export function PricingCards({ organizationId }: PricingCardsProps) {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'professional'>('professional');
  const [includeAudit, setIncludeAudit] = useState(false);

  const { execute, isExecuting } = useAction(generateCheckoutSessionAction, {
    onSuccess: ({ data }) => {
      if (data?.checkoutUrl) {
        router.push(data.checkoutUrl);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || 'Failed to create checkout session');
    },
  });

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const handleSubscribe = () => {
    const priceId = env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID;

    execute({
      organizationId,
      mode: 'subscription',
      priceId,
      successUrl: `${baseUrl}/${organizationId}/settings/billing?success=true`,
      cancelUrl: `${baseUrl}/upgrade/${organizationId}`,
      allowPromotionCodes: true,
      metadata: {
        organizationId,
        plan: selectedPlan,
        includeAudit: includeAudit.toString(),
      },
    });
  };

  const starterMonthly = 399;
  const professionalMonthly = 499;
  const yearlyDiscount = 0.2;

  const starterYearly = Math.round(starterMonthly * (1 - yearlyDiscount));
  const professionalYearly = Math.round(professionalMonthly * (1 - yearlyDiscount));

  const currentMonthlyPrice = selectedPlan === 'starter' ? starterMonthly : professionalMonthly;
  const currentYearlyPrice = selectedPlan === 'starter' ? starterYearly : professionalYearly;
  const currentPrice = isYearly ? currentYearlyPrice : currentMonthlyPrice;

  const yearlyTotal = currentYearlyPrice * 12;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm transition-colors ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}
        >
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          className="data-[state=checked]:bg-primary"
        />
        <div className="flex items-center gap-2">
          <span
            className={`text-sm transition-colors ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}
          >
            Yearly
          </span>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-1.5 py-0">
            Save 20%
          </Badge>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Plan Selection */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-3">
          {/* Starter Plan */}
          <Card
            className={`relative cursor-pointer transition-all h-full flex flex-col ${selectedPlan === 'starter' ? 'ring-2 ring-green-500 shadow-lg bg-green-50/50 dark:bg-primary/15 backdrop-blur-lg' : 'hover:shadow-md bg-card'} border border-border`}
            onClick={() => setSelectedPlan('starter')}
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start gap-3">
                <SelectionIndicator isSelected={selectedPlan === 'starter'} variant="radio" />
                <div className="flex-1 -mt-0.5">
                  <CardTitle className="text-lg font-semibold">Starter</CardTitle>
                  <CardDescription className="text-sm mt-0.5">Essential compliance</CardDescription>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${isYearly ? starterYearly : starterMonthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Save ${starterMonthly * 12 - starterYearly * 12}/yr with annual
                </p>
              </div>
            </CardHeader>

            <div
              className={`border-t ${selectedPlan === 'starter' ? 'border-green-500/30' : 'border-border'} mx-6 mb-4`}
            ></div>

            <CardContent className="px-6 flex flex-col h-full">
              <ul className="space-y-2 flex-1">
                {starterFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              <div
                className={`border-t ${selectedPlan === 'starter' ? 'border-green-500/30' : 'border-border'} mt-auto pt-4`}
              >
                <p className="text-xs text-center text-muted-foreground">
                  Everything you need to start
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card
            className={`relative cursor-pointer transition-all h-full flex flex-col ${selectedPlan === 'professional' ? 'ring-2 ring-green-500 shadow-lg bg-green-50/50 dark:bg-primary/15 backdrop-blur-lg' : 'hover:shadow-md bg-card'} border border-border`}
            onClick={() => setSelectedPlan('professional')}
          >
            <CardHeader className="p-6 pb-4">
              <div className="flex items-start gap-3">
                <SelectionIndicator isSelected={selectedPlan === 'professional'} variant="radio" />
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">Professional</CardTitle>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-1.5 py-0">
                      Popular
                    </Badge>
                  </div>
                  <CardDescription className="text-sm mt-0.5">With Slack support</CardDescription>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    ${isYearly ? professionalYearly : professionalMonthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Save ${professionalMonthly * 12 - professionalYearly * 12}/yr with annual
                </p>
              </div>
            </CardHeader>
            <div
              className={`border-t ${selectedPlan === 'professional' ? 'border-green-500/30' : 'border-border'} mx-6 mb-4`}
            ></div>
            <CardContent className="px-6 flex flex-col h-full">
              <ul className="space-y-2 flex-1">
                {professionalFeatures.map((feature, idx) => (
                  <li key={feature} className={idx === 0 ? 'pb-1' : 'flex items-start gap-2'}>
                    {idx !== 0 && (
                      <CheckIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm leading-relaxed ${idx === 0 ? 'font-semibold text-muted-foreground block' : ''}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className={`border-t ${selectedPlan === 'professional' ? 'border-green-500/30' : 'border-border'} mt-auto pt-4`}
              >
                <p className="text-xs text-center text-muted-foreground">Best for growing teams</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Checkout & Audit */}
        <div className="space-y-3">
          {/* Audit Add-on */}
          <Card
            className={`cursor-pointer transition-all ${includeAudit ? 'ring-2 ring-green-500 shadow-lg bg-green-50/50 dark:bg-primary/15 backdrop-blur-lg' : 'hover:shadow-md bg-card'} border border-border`}
            onClick={() => setIncludeAudit(!includeAudit)}
          >
            <CardHeader className="p-6 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <SelectionIndicator isSelected={includeAudit} variant="checkbox" />
                  <div className="flex-1 -mt-0.5">
                    <p className="text-lg font-semibold">SOC 2 Audit</p>
                  </div>
                </div>
                <p className="text-lg font-bold">$1,500</p>
              </div>
            </CardHeader>
            <CardContent className="px-6 pt-0 pb-4">
              <p className="text-sm text-muted-foreground mb-3">
                Add now or purchase later when you're ready
              </p>
              <ul className="space-y-2">
                {auditFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Checkout Summary */}
          <Card className="bg-card/90 dark:bg-card/80 backdrop-blur-lg border-2 border-white/20 dark:border-white/10 shadow-xl">
            <CardHeader className="pb-3 pt-4 bg-muted/50 dark:bg-muted/40 backdrop-blur-sm rounded-t-lg">
              <CardTitle className="text-lg font-semibold text-center">Checkout</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {selectedPlan === 'starter' ? 'Starter' : 'Professional'} Plan
                  </span>
                  <span className="text-sm font-semibold">${currentPrice}/mo</span>
                </div>
                {!isYearly && (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Save ${currentMonthlyPrice * 12 - currentYearlyPrice * 12}/yr with annual
                  </p>
                )}
                {isYearly && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Annual billing</span>
                    <span className="text-sm text-muted-foreground">${yearlyTotal}/yr</span>
                  </div>
                )}
                {includeAudit && (
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm text-muted-foreground">SOC 2 Audit</span>
                    <span className="text-sm font-semibold">$1,500</span>
                  </div>
                )}
                <div className="border-t-2 pt-3 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-semibold">Due today</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">
                        $
                        {isYearly
                          ? yearlyTotal + (includeAudit ? 1500 : 0)
                          : currentPrice + (includeAudit ? 1500 : 0)}
                      </span>
                      {!isYearly && (
                        <span className="text-sm text-muted-foreground block">
                          then ${currentPrice}/mo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-3 flex flex-col gap-3">
              <Button
                onClick={handleSubscribe}
                disabled={isExecuting}
                size="default"
                className="w-full"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </Button>
              {!includeAudit && (
                <p className="text-xs text-muted-foreground text-center px-2">
                  Once audit-ready, you can add SOC 2 certification or work with your own auditors
                </p>
              )}
            </CardFooter>
          </Card>

          {/* Trust Signals */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground px-2">
              SSL encrypted • SOC 2 certified • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
