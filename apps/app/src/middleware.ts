import { getSubscriptionData } from '@/app/api/stripe/getSubscriptionData';
import { auth } from '@/utils/auth';
import { db } from '@comp/db';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'nodejs',
  matcher: [
    // Skip auth-related routes
    '/((?!api|_next/static|_next/image|favicon.ico|monitoring|ingest|onboarding|research).*)',
  ],
};

// Routes that don't require subscription
const SUBSCRIPTION_EXEMPT_ROUTES = ['/auth', '/invite', '/setup', '/upgrade', '/settings/billing'];

function isSubscriptionExempt(pathname: string): boolean {
  return SUBSCRIPTION_EXEMPT_ROUTES.some((route) => pathname.includes(route));
}

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const response = NextResponse.next();
  const nextUrl = request.nextUrl;

  // Add x-path-name
  response.headers.set('x-pathname', nextUrl.pathname);

  // Allow unauthenticated access to invite routes
  if (nextUrl.pathname.startsWith('/invite/')) {
    return response;
  }

  // 1. Not authenticated
  if (!session && nextUrl.pathname !== '/auth') {
    const url = new URL('/auth', request.url);
    return NextResponse.redirect(url);
  }

  // 2. Authenticated users
  if (session) {
    // Special handling for /setup path - it's used for creating organizations
    if (nextUrl.pathname.startsWith('/setup')) {
      // Check if user already has an organization
      const hasOrg = await db.organization.findFirst({
        where: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });

      // Allow access if:
      // - User has no organization (new user)
      // - User is intentionally creating additional org (intent=create-additional)
      // - User is in a setup session (has setupId in path)
      const isIntentionalSetup = nextUrl.searchParams.get('intent') === 'create-additional';
      const isSetupSession = nextUrl.pathname.match(/^\/setup\/[a-zA-Z0-9]+/);

      if (!hasOrg || isIntentionalSetup || isSetupSession) {
        return response;
      }

      // If user has org and not intentionally creating new one, redirect to their org
      if (hasOrg && !isIntentionalSetup && !isSetupSession) {
        return NextResponse.redirect(new URL(`/${hasOrg.id}/frameworks`, request.url));
      }
    }

    // Check subscription status for organization routes
    const orgMatch = nextUrl.pathname.match(/^\/org_[a-zA-Z0-9]+/);
    if (orgMatch && !isSubscriptionExempt(nextUrl.pathname)) {
      const orgId = orgMatch[0].substring(1); // Remove leading slash

      // Get organization's subscription details
      const org = await db.organization.findUnique({
        where: { id: orgId },
        select: {
          stripeCustomerId: true,
          choseSelfServe: true,
        },
      });

      // Allow access if they chose self-serve (free plan)
      if (org?.choseSelfServe) {
        return response;
      }

      // Check paid subscription status
      if (org?.stripeCustomerId) {
        const subscription = await getSubscriptionData(org.stripeCustomerId);

        // If no active subscription, redirect to upgrade page
        if (
          !subscription ||
          (subscription.status !== 'active' && subscription.status !== 'trialing')
        ) {
          return NextResponse.redirect(new URL(`/upgrade/${orgId}`, request.url));
        }
      } else {
        // No Stripe customer ID and not self-serve means no plan selected yet
        return NextResponse.redirect(new URL(`/upgrade/${orgId}`, request.url));
      }
    }

    // Heal sessions for organization-dependent routes
    const isOrgRoute = nextUrl.pathname.includes('/org_');
    const isRootPath = nextUrl.pathname === '/';

    if ((isOrgRoute || isRootPath) && !session.session.activeOrganizationId) {
      // Try to find and set an organization for the user
      const userOrg = await db.organization.findFirst({
        where: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (userOrg) {
        // Set the active organization
        await auth.api.setActiveOrganization({
          headers: await headers(),
          body: {
            organizationId: userOrg.id,
          },
        });

        // Refresh to get the updated session
        return NextResponse.redirect(new URL(nextUrl.pathname, request.url));
      }
    }
  }

  return response;
}
