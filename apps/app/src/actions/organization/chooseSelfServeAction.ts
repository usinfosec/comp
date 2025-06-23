'use server';

import { getOrganization } from '@/data/getOrganization';
import { db } from '@comp/db';
import { redirect } from 'next/navigation';

export async function chooseSelfServeAction() {
  const organization = await getOrganization();

  if (!organization) {
    throw new Error('No organization found');
  }

  // Update organization to mark as self-serve
  await db.organization.update({
    where: { id: organization.id },
    data: {
      subscriptionType: 'SELF_SERVE',
    },
  });

  // Redirect to dashboard
  redirect(`/${organization.slug}`);
}
