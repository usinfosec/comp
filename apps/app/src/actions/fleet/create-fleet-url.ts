"use server";

import { fleet } from "@/lib/fleet";
import { authActionClient } from "@/actions/safe-action";
import { z } from "zod";

const createFleetUrlSchema = z.object({
	orgId: z.string(),
	os: z.enum(["mac", "win", "linux"]),
});

export const createFleetUrlAction = authActionClient
	.schema(createFleetUrlSchema)
	.metadata({
		name: "create-fleet-url",
		track: {
			event: "create-fleet-url",
			channel: "server",
		},
	})
	.action(async ({ parsedInput }) => {
		const { orgId, os } = parsedInput;

		try {
			console.log("Creating Fleet URL for org", orgId);
			console.log("Fleet URL", fleet.defaults.baseURL);

			// 1 create a team per-customer (or reuse a shared team)
			const {
				data: team,
				status,
				config,
			} = await fleet.post("/teams", {
				name: `org-${orgId}`,
			});

			console.log("Team created", team);
			console.log("Status", status);
			console.log("Config", config);

			if (status !== 201) {
				console.log("Team not created");
				throw new Error("Team not created");
			}

			console.log("Found team", team);

			// 2 generate / fetch an enrol secret for that team
			const {
				data: { secrets },
			} = await fleet.post(`/teams/${team.id}/secrets`, {
				secrets: [{ secret: crypto.randomUUID() }],
			});

			console.log("Found secrets", secrets);
			const secret = secrets[0].secret;

			if (!process.env.NEXT_PUBLIC_APP_URL) {
				console.log("NEXT_PUBLIC_APP_URL not found");
				throw new Error("NEXT_PUBLIC_APP_URL not found");
			}

			// 3 pre-sign a platform-specific installer URL
			const installURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/osquery/installer?teamId=${team.id}&secret=${secret}&os=${os}`;

			console.log({ installURL });

			return { installURL };
		} catch (error) {
			console.error("Error creating Fleet URL:", error);
			throw error;
		}
	});
