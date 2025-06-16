import { stripe } from '@/actions/organization/lib/stripe';
import { getServersideSession } from '@/lib/get-session';
import { db } from '@comp/db';
import { client } from '@comp/kv';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { user } = await getServersideSession(req);

  // Extract organizationId from query parameters
  const url = new URL(req.url);
  const organizationId = url.searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  // Check that user.id is a member of the organization
  const memberRecord = await db.member.findFirst({
    where: {
      userId: user.id,
      organizationId,
    },
  });

  if (!memberRecord) {
    return NextResponse.json(
      { error: 'User is not a member of the organization' },
      { status: 403 },
    );
  }

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
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
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

  // ALWAYS create a checkout with a stripeCustomerId. They should enforce this.
  const checkout = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    success_url: 'https://t3.chat/success',
    // Add additional checkout session parameters here
  });

  return NextResponse.json(checkout);
}

//https://github.com/t3dotgg/stripe-recommendations
