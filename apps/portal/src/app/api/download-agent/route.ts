import { auth } from '@/app/lib/auth';
import { logger } from '@/utils/logger';
import { db } from '@comp/db';
import { type NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createAgentArchive } from './archive';
import { createFleetLabel } from './fleet-label';
import { generateMacScript, generateWindowsScript } from './scripts';
import type { SupportedOS, DownloadAgentRequest } from './types';

export async function POST(req: NextRequest) {
  // Authentication
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Validate request body
  const { orgId, employeeId, os = 'macos' }: DownloadAgentRequest = await req.json();

  if (!orgId || !employeeId) {
    return new NextResponse('Missing orgId or employeeId', { status: 400 });
  }

  if (!['macos', 'windows'].includes(os)) {
    return new NextResponse('Invalid OS. Must be "macos" or "windows"', { status: 400 });
  }

  // Check environment configuration
  const fleetDevicePathMac = process.env.FLEET_DEVICE_PATH_MAC;
  const fleetDevicePathWindows = process.env.FLEET_DEVICE_PATH_WINDOWS;

  if (!fleetDevicePathMac || !fleetDevicePathWindows) {
    logger(
      'FLEET_DEVICE_PATH_MAC or FLEET_DEVICE_PATH_WINDOWS not configured in environment variables',
    );
    return new NextResponse(
      'Server configuration error: FLEET_DEVICE_PATH_MAC or FLEET_DEVICE_PATH_WINDOWS is missing.',
      {
        status: 500,
      },
    );
  }

  // Validate member and organization
  const member = await validateMemberAndOrg(session.user.id, orgId);
  if (!member) {
    return new NextResponse('Member not found or organization invalid', { status: 404 });
  }

  // Generate OS-specific script
  const fleetDevicePath = os === 'macos' ? fleetDevicePathMac : fleetDevicePathWindows;
  const script =
    os === 'macos'
      ? generateMacScript({ orgId, employeeId, fleetDevicePath })
      : generateWindowsScript({ orgId, employeeId, fleetDevicePath });

  // Create temporary directory
  const tempDir = path.join(tmpdir(), `compai-agent-${Date.now()}`);
  await fs.mkdir(tempDir, { recursive: true });

  try {
    // Create the archive
    const stream = await createAgentArchive({
      os: os as SupportedOS,
      script,
      tempDir,
    });

    // Create Fleet label
    await createFleetLabel({
      employeeId,
      memberId: member.id,
      os: os as SupportedOS,
      fleetDevicePathMac,
      fleetDevicePathWindows,
    });

    const filename = `compai-device-agent-${os}.zip`;

    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } finally {
    // Clean up temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      logger('Failed to clean up temp directory', { error: cleanupError, tempDir });
    }
  }
}

async function validateMemberAndOrg(userId: string, orgId: string) {
  const member = await db.member.findFirst({
    where: {
      userId,
      organizationId: orgId,
    },
  });

  if (!member) {
    logger('Member not found', { userId, orgId });
    return null;
  }

  const org = await db.organization.findUnique({
    where: {
      id: orgId,
    },
  });

  if (!org) {
    logger('Organization not found', { orgId });
    return null;
  }

  return member;
}
