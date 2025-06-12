import { fleet } from "@/lib/fleet";
import { db } from "@comp/db";
import { logger, task } from "@trigger.dev/sdk/v3";
import axios from "axios";

export const generateAgentFile = task({
  id: "generate-agent-file",
  retry: {
    maxAttempts: 3,
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
    const fleetUrl = process.env.FLEET_URL;

    if (!enrollSecret) {
      logger.error(
        "FLEET_ENROLL_SECRET is not set. Cannot create osquery agent."
      );
      return;
    }

    const fleetServiceUrl = process.env.FLEET_SERVICE_URL;

    if (!fleetServiceUrl) {
      logger.error(
        "FLEET_SERVICE_URL is not set. Cannot create osquery agent."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${fleetServiceUrl}/generate-agent-file`,
        {
          organizationId,
          fleetUrl,
          enrollSecret,
        }
      );

      logger.info("S3 Upload successful.", {
        fileUrlPkg: response.data.fileUrlPkg,
      });

      await db.organization.update({
        where: { id: organizationId },
        data: {
          osqueryAgentDownloadUrl: response.data.fileUrlPkg,
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
