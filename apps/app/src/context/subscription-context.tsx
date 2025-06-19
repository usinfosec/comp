'use client';

import { STRIPE_SUB_CACHE } from '@/app/api/stripe/stripeDataToKv.type';
import { createContext, useContext } from 'react';

interface SubscriptionContextValue {
  subscription: STRIPE_SUB_CACHE;
  hasActiveSubscription: boolean;
  isTrialing: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({
  children,
  subscription,
}: {
  children: React.ReactNode;
  subscription: STRIPE_SUB_CACHE;
}) {
  const hasActiveSubscription =
    subscription.status === 'active' || subscription.status === 'trialing';

  const isTrialing = subscription.status === 'trialing';

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        hasActiveSubscription,
        isTrialing,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
