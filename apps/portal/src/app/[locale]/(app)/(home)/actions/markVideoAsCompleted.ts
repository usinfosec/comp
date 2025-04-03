"use server";

import { authActionClient } from "@/actions/safe-action";
import { db } from "@comp/db";
import { z } from "zod";
import { logger } from "@/utils/logger";
import { revalidatePath } from "next/cache";

export const markVideoAsCompleted = authActionClient
	.schema(z.object({ videoId: z.string() }))
	.metadata({
		name: "markVideoAsCompleted",
		track: {
			event: "markVideoAsCompleted",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { videoId } = parsedInput;
		const { user } = ctx;

		logger("markVideoAsCompleted action started", {
			videoId,
			userId: user?.id,
		});

		if (!user) {
			logger("Unauthorized attempt to mark video as completed", { videoId });
			throw new Error("Unauthorized");
		}

		if (!user.organizationId) {
			logger("User does not have an organization", { userId: user.id });
			throw new Error("User does not have an organization");
		}

		const organizationTrainingVideo =
			await db.organizationTrainingVideos.findUnique({
				where: {
					id: videoId,
					organizationId: user.organizationId,
				},
			});

		if (!organizationTrainingVideo) {
			logger("Training video not found", { videoId });
			throw new Error("Training video not found");
		}

		// Check if user has already signed this policy
		if (organizationTrainingVideo.completedBy.includes(user.id)) {
			logger("User has already signed this video", {
				videoId,
				userId: user.id,
			});
			return organizationTrainingVideo;
		}

		logger("Updating video completion", { videoId, userId: user.id });
		const completedVideo = await db.organizationTrainingVideos.update({
			where: { id: videoId, organizationId: user.organizationId },
			data: {
				completedBy: [...organizationTrainingVideo.completedBy, user.id],
			},
		});

		logger("Video successfully marked as completed", {
			videoId,
			userId: user.id,
		});

		revalidatePath("/");

		return completedVideo;
	});
