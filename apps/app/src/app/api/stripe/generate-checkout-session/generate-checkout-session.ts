'use server';

import { stripe } from '@/actions/organization/lib/stripe';
import { db } from '@comp/db';
import { client } from '@comp/kv';
import { authWithOrgAccessClient } from '@/actions/safe-action';
import { z } from 'zod';

const generateCheckoutSessionSchema = z.object({
  organizationId: z.string(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  mode: z.enum(['payment', 'setup', 'subscription']).default('subscription'),
  priceId: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  allowPromotionCodes: z.boolean().optional(),
  trialPeriodDays: z.number().int().positive().optional(),
  metadata: z.record(z.string()).optional(),
});

export const generateCheckoutSessionAction = authWithOrgAccessClient
  .inputSchema(generateCheckoutSessionSchema)
  .metadata({
    name: 'generate-checkout-session',
    track: {
      event: 'generate-checkout-session',
      description: 'Generate Stripe checkout session',
      channel: 'server',
    },
  })
  .action(async ({ parsedInput, ctx }) => {
    const { user, member, organizationId } = ctx;
    const {
      successUrl,
      cancelUrl,
      mode,
      priceId,
      quantity,
      allowPromotionCodes,
      trialPeriodDays,
      metadata,
    } = parsedInput;

    let stripeCustomerId;

    // First, check the KV store for the stripeCustomerId
    stripeCustomerId = await client.get(`stripe:organization:${organizationId}`);

    // If not present in KV, check the database for the organization and stripeCustomerId
    if (!stripeCustomerId) {
      const organization = await db.organization.findUnique({
        where: {
          id: organizationId,
        },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      if (organization.stripeCustomerId) {
        stripeCustomerId = organization.stripeCustomerId;
      }
    }

    // Create a new Stripe customer if this organization doesn't have one
    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organizationId,
          userId: user.id,
        },
      });

      // Store the relation between organizationId and stripeCustomerId in your KV & database
      await client.set(`stripe:organization:${organizationId}`, newCustomer.id);
      await db.organization.update({
        where: {
          id: organizationId,
        },
        data: {
          stripeCustomerId: newCustomer.id,
        },
      });
      stripeCustomerId = newCustomer.id;
    }

    // Build line items based on mode
    const lineItems = priceId
      ? [
          {
            price: priceId,
            quantity: quantity || 1,
          },
        ]
      : undefined;

    // Build subscription data if applicable
    const subscriptionData =
      mode === 'subscription' && trialPeriodDays
        ? {
            trial_period_days: trialPeriodDays,
          }
        : undefined;

    // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
    const checkout = await stripe.checkout.sessions.create({
      customer: stripeCustomerId as string,
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
      mode,
      line_items: lineItems,
      allow_promotion_codes: allowPromotionCodes,
      subscription_data: subscriptionData,
      metadata: {
        organizationId,
        userId: user.id,
        memberId: member.id,
        ...metadata,
      },
      customer_update: {
        address: 'auto',
      },
    });

    return {
      success: true,
      checkoutUrl: checkout.url,
      sessionId: checkout.id,
    };
  });

//https://github.com/t3dotgg/stripe-recommendations
