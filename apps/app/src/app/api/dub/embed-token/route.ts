import { env } from '@/env.mjs';
import { auth } from '@/utils/auth';
import { Dub } from 'dub';
import { NextResponse } from 'next/server';

const dub = new Dub({
  token: env.DUB_API_KEY,
});

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const user = session?.user;

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const programId = env.DUB_PROGRAM_ID;

  if (!programId) {
    return NextResponse.json({ error: 'Program ID is not set' }, { status: 500 });
  }

  try {
    const { publicToken } = await dub.embedTokens.referrals({
      programId, // program ID from your Dub dashboard (in the URL)
      tenantId: user.id, // the user's ID within your application
      partner: {
        name: user.name, // the user's name
        email: user.email, // the user's email
        image: user.image, // the user's image/avatar
        tenantId: user.id, // the user's ID within your application
      },
    });

    return NextResponse.json({ publicToken });
  } catch (error) {
    console.error('Error fetching embed token:', error);
    return NextResponse.json({ error: 'Failed to fetch embed token' }, { status: 500 });
  }
}
