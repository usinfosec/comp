import { auth } from '@/app/lib/auth';
import { logger } from '@/utils/logger';
import { BUCKET_NAME, getPresignedDownloadUrl } from '@/utils/s3';
import { type NextRequest, NextResponse } from 'next/server';
import { createFleetLabel } from './fleet-label';
import {
  generateMacScript,
  generateWindowsScript,
  getPackageFilename,
  getScriptFilename,
} from './scripts';
import type { DownloadAgentRequest, SupportedOS } from './types';
import { detectOSFromUserAgent, validateMemberAndOrg } from './utils';

export async function POST(req: NextRequest) {
  // Authentication
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Validate request body
  const { orgId, employeeId }: DownloadAgentRequest = await req.json();

  if (!orgId || !employeeId) {
    return new NextResponse('Missing orgId or employeeId', { status: 400 });
  }

  // Auto-detect OS from User-Agent
  const userAgent = req.headers.get('user-agent');
  const detectedOS = detectOSFromUserAgent(userAgent);

  if (!detectedOS) {
    return new NextResponse(
      'Could not detect OS from User-Agent. Please use a standard browser on macOS or Windows.',
      { status: 400 },
    );
  }

  const os = detectedOS;
  logger('Auto-detected OS from User-Agent', { os, userAgent });

  // Check environment configuration
  const fleetDevicePathMac = process.env.FLEET_DEVICE_PATH_MAC;
  const fleetDevicePathWindows = process.env.FLEET_DEVICE_PATH_WINDOWS;
  const fleetBucketName = process.env.FLEET_AGENT_BUCKET_NAME;

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

  if (!fleetBucketName || !BUCKET_NAME) {
    return new NextResponse('Server configuration error: S3 bucket names are missing.', {
      status: 500,
    });
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

  try {
    // Create Fleet label
    await createFleetLabel({
      employeeId,
      memberId: member.id,
      os: os as SupportedOS,
      fleetDevicePathMac,
      fleetDevicePathWindows,
    });

    // Get script filename
    const scriptFilename = getScriptFilename(os);

    // Get presigned URL for the Fleet agent package
    const packageFilename = getPackageFilename(os);
    const packageKey = `${os}/fleet-osquery.${os === 'macos' ? 'pkg' : 'msi'}`;
    const packageDownloadUrl = await getPresignedDownloadUrl({
      bucketName: fleetBucketName,
      key: packageKey,
      expiresIn: 3600, // 1 hour
    });

    return NextResponse.json({
      scriptContent: script,
      scriptFilename,
      packageDownloadUrl,
      packageFilename,
    });
  } catch (error) {
    logger('Error generating presigned URLs', { error });
    return new NextResponse('Failed to generate download URLs', { status: 500 });
  }
}
