'use client';

import { Button } from '@comp/ui/button';
import { generateCheckoutSessionAction } from '@/app/api/stripe/generate-checkout-session/generate-checkout-session';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';

export function CheckoutForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();

  const { execute, result, status, isExecuting } = useAction(generateCheckoutSessionAction, {
    onSuccess: ({ data }) => {
      if (data?.checkoutUrl) {
        router.push(data.checkoutUrl);
      }
    },
    onError: ({ error }) => {
      // Optional: Log errors to monitoring service
      console.error('Checkout session error:', error);
    },
  });

  return (
    <div className="space-y-4">
      {/* Show validation errors */}
      {result.validationErrors && (
        <div className="rounded-xs border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          <p className="font-medium">Validation Error</p>
          <pre className="mt-1 text-xs">{JSON.stringify(result.validationErrors, null, 2)}</pre>
        </div>
      )}

      {/* Show server errors */}
      {result.serverError && (
        <div className="rounded-xs border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
          {result.serverError}
        </div>
      )}

      <Button
        onClick={() =>
          execute({
            organizationId,
            mode: 'subscription',
            allowPromotionCodes: true,
          })
        }
        disabled={isExecuting}
      >
        {isExecuting ? 'Creating session...' : 'Create Checkout Session'}
      </Button>

      {/* Optional: Show status for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <p className="text-muted-foreground text-xs">Status: {status}</p>
      )}
    </div>
  );
}
