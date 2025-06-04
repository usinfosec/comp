"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const getInstaller = createSafeActionClient()
	.schema(
		z.object({
			os: z.enum(["mac", "win", "linux"]),
			teamId: z.string().optional(),
			secret: z.string(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const { os, teamId, secret } = parsedInput;
		const fleet = process.env.FLEET_URL;

		if (os === "mac") {
			const script = `
      #!/bin/bash
      curl -fsSL https://orbit.fleetctl.com/install.sh | \
        FLEET_URL='${fleet}' \
        ENROLL_SECRET='${secret}' \
        FLEET_DESKTOP=0 \
        sh
    `;
			return {
				content: script,
				contentType: "text/x-shellscript",
			};
		}

		if (os === "win") {
			// wrap Orbit.msi + secret into a self-extracting .exe
			const url = "https://dl.fleetdm.com/orbit/windows/OrbitSetup.msi";
			const ps = `
      Start-Process msiexec.exe -Wait -ArgumentList '/i','${url}',
        'FLEET_URL=${fleet}','ENROLL_SECRET=${secret}','/qn'
    `;
			return {
				content: ps,
				contentType: "text/plain",
			};
		}

		/* linux … */
		return {
			content: "",
			contentType: "text/plain",
		};
	});
