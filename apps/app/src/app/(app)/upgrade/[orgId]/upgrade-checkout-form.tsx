'use client';

import { generateCheckoutSessionAction } from '@/app/api/stripe/generate-checkout-session/generate-checkout-session';
import { env } from '@/env.mjs';
import { Button } from '@comp/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UpgradeCheckoutFormProps {
  organizationId: string;
}

export function UpgradeCheckoutForm({ organizationId }: UpgradeCheckoutFormProps) {
  const router = useRouter();

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

  // Construct URLs for success and cancel
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const handleUpgrade = () => {
    execute({
      organizationId,
      mode: 'subscription',
      priceId: env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID,
      successUrl: `${baseUrl}/${organizationId}/settings/billing?success=true`,
      cancelUrl: `${baseUrl}/upgrade/${organizationId}`,
      allowPromotionCodes: true,
      metadata: {
        organizationId,
      },
    });
  };

  return (
    <div className="w-full space-y-4">
      <Button onClick={handleUpgrade} disabled={isExecuting} size="lg" className="w-full">
        {isExecuting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating checkout session...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Start Free Trial
          </>
        )}
      </Button>
    </div>
  );
}
