import { logger, task } from "@trigger.dev/sdk/v3";
import { db } from "@comp/db";
import { fleet } from "@/lib/fleet";
import { promisify } from "node:util";
import { exec as callbackExec } from "node:child_process";
import { createReadStream, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/app/s3";

export const generateAgentFile = task({
  id: "generate-agent-file",
  retry: {
    maxAttempts: 3,
  },
  cleanup: async ({ organizationId }: { organizationId: string }) => {
    // Delete the tmp dir.
    const tmpDir = path.join(tmpdir(), `pkg-${organizationId}-`);
    if (existsSync(tmpDir)) {
      rmSync(tmpDir, { recursive: true });
    }
  },
  run: async ({ organizationId }: { organizationId: string }) => {
    const organization = await db.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      logger.error(`Organization ${organizationId} not found`);
      return;
    }

    if (organization.isFleetSetupCompleted) {
      logger.info(`Organization ${organizationId} already has fleet set up`);
      return;
    }

    const fleetDevicePathMac = process.env.FLEET_DEVICE_PATH_MAC;
    if (!fleetDevicePathMac) {
      logger.error("FLEET_DEVICE_PATH_MAC not configured");
      return;
    }

    // Create a manual label that we can assign to hosts.
    const response = await fleet.post("/labels", {
      name: organization.id,
      query: `SELECT 1 FROM file WHERE path = '${fleetDevicePathMac}/${organizationId}' LIMIT 1;`,
    });

    const enrollSecret = organization.fleetDmSecret;

    const secretsResponse = await fleet.get("/spec/enroll_secret");
    const existingSecrets = secretsResponse.data.spec.secrets;

    await fleet.post("/spec/enroll_secret", {
      spec: {
        secrets: [
          ...existingSecrets,
          {
            secret: enrollSecret,
            name: organization.id,
          },
        ],
      },
    });

    if (!response.data) {
      logger.error(`Failed to create label for organization ${organizationId}`);
      return;
    }

    // Store label ID in organization.
    await db.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        fleetDmLabelId: response.data.label.id,
      },
    });

    // Create osquery agent file.
    const execAsync = promisify(callbackExec);
    const fleetUrl = process.env.FLEET_URL;

    if (!enrollSecret) {
      logger.error(
        "FLEET_ENROLL_SECRET is not set. Cannot create osquery agent."
      );
      return;
    }

    try {
      const workDir = mkdtempSync(
        path.join(tmpdir(), `pkg-${organizationId}-`)
      );

      logger.info(`Building .pkg in ${workDir}`);

      const commandMac = `fleetctl package \
--type=pkg \
--fleet-url ${fleetUrl} \
--enable-scripts \
--fleet-desktop \
--verbose \
--enroll-secret "${enrollSecret}"`;

      logger.info(`Executing; command: ${commandMac}`);

      await execAsync(commandMac, {
        cwd: workDir,
      });

      const pkgPath = path.join(workDir, "fleet-osquery.pkg");

      logger.info(`Created fleet-osquery.pkg in ${pkgPath}`);

      const s3KeyPkg = `${organizationId}/macos/fleet-osquery.pkg`;

      // Upload the zip to S3
      const putObjectCommandPkg = new PutObjectCommand({
        Bucket: "compai-fleet-packages",
        Key: s3KeyPkg,
        Body: createReadStream(pkgPath),
        ContentType: "application/octet-stream",
      });

      logger.info(`Uploading fleet-osquery.pkg to S3: ${s3KeyPkg}`);
      await s3Client.send(putObjectCommandPkg);

      const s3Region = await s3Client.config.region();
      const s3ObjectUrlPkg = `https://compai-fleet-packages.s3.${s3Region}.amazonaws.com/${s3KeyPkg}`;

      logger.info("S3 Upload successful.", {
        fileUrlPkg: s3ObjectUrlPkg,
      });

      await db.organization.update({
        where: { id: organizationId },
        data: {
          osqueryAgentDownloadUrl: s3ObjectUrlPkg,
          isFleetSetupCompleted: true,
        },
      });
      logger.info(`Stored S3 bundle URL for organization ${organizationId}`);
    } catch (error) {
      logger.error("Error in fleetctl packaging or S3 upload process", {
        error,
      });
    }
  },
});
