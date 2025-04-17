import { env } from "@/env.mjs";
import Stripe from "stripe";

export const stripeWebhookSecret = env.STRIPE_WEBHOOK_SECRET;

let stripe: Stripe | undefined;

if (env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET) {
	stripe = new Stripe(env.STRIPE_SECRET_KEY, {
		apiVersion: "2025-02-24.acacia",
	});
} else {
	console.warn(
		"Stripe environment variables (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) are not fully configured. Stripe functionality will be disabled.",
	);
}

export { stripe };
