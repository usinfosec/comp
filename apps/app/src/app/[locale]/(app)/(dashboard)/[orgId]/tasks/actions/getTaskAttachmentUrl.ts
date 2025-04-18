"use server";

import { authActionClient } from "@/actions/safe-action";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@comp/db";
import { AttachmentEntityType } from "@comp/db/types";
import { z } from "zod";

// --- S3 Client Configuration (Copied and verified) ---
if (
	!process.env.AWS_ACCESS_KEY_ID ||
	!process.env.AWS_SECRET_ACCESS_KEY ||
	!process.env.AWS_BUCKET_NAME ||
	!process.env.AWS_REGION
) {
	// Log the error in production, don't throw as it crashes the serverless function
	console.error(
		"AWS credentials or configuration missing for getTaskAttachmentUrl",
	);
	// Avoid throwing here in serverless environments
}

const s3Client = new S3Client({
	region: process.env.AWS_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});
// --- End S3 Client Configuration ---

// --- Input Schema ---
const schema = z.object({
	attachmentId: z.string(),
	// taskId is implicitly checked via the attachment record
});
// --- End Input Schema ---

// --- Helper to extract S3 key (Copied and verified) ---
function extractS3KeyFromUrl(url: string): string {
	const fullUrlMatch = url.match(/amazonaws\.com\/(.+)$/);
	if (fullUrlMatch?.[1]) {
		// Decode URI component in case file names have special characters
		return decodeURIComponent(fullUrlMatch[1]);
	}
	// If it's already just the key (legacy or direct key storage)
	if (!url.includes("amazonaws.com") && url.split("/").length > 1) {
		return url;
	}
	console.error("Invalid S3 URL format received:", url);
	throw new Error("Invalid S3 URL format");
}
// --- End Helper ---

export const getTaskAttachmentUrl = authActionClient
	.schema(schema)
	.metadata({
		name: "getTaskAttachmentUrl",
		track: {
			event: "get-task-attachment-url",
			channel: "server",
		},
	})
	.action(async ({ parsedInput, ctx }) => {
		const { session } = ctx;
		const { attachmentId } = parsedInput;
		const organizationId = session.activeOrganizationId;

		if (!organizationId) {
			// Using return for safe actions as per pattern
			return {
				success: false,
				error: "Not authorized - no organization found",
			} as const;
		}

		try {
			// 1. Find the attachment and verify ownership/type
			const attachment = await db.attachment.findUnique({
				where: {
					id: attachmentId,
					organizationId: organizationId,
					entityType: AttachmentEntityType.task, // Ensure it's a task attachment
				},
			});

			if (!attachment) {
				return {
					success: false,
					error: "Attachment not found or access denied",
				} as const;
			}

			// 2. Extract S3 key from the stored URL
			let key: string;
			try {
				key = extractS3KeyFromUrl(attachment.url);
			} catch (extractError) {
				console.error(
					"Error extracting S3 key for attachment:",
					attachmentId,
					extractError,
				);
				return {
					success: false,
					error: "Could not process attachment URL",
				} as const;
			}

			// 3. Generate Signed URL
			try {
				const command = new GetObjectCommand({
					Bucket: process.env.AWS_BUCKET_NAME!,
					Key: key,
				});

				const signedUrl = await getSignedUrl(s3Client, command, {
					expiresIn: 3600, // URL expires in 1 hour
				});

				if (!signedUrl) {
					// This case is unlikely if getSignedUrl doesn't throw, but good to check
					console.error(
						"getSignedUrl returned undefined for key:",
						key,
					);
					return {
						success: false,
						error: "Failed to generate signed URL",
					} as const;
				}

				// 4. Return Success
				return { success: true, data: { signedUrl } };
			} catch (s3Error) {
				console.error("S3 getSignedUrl Error:", s3Error);
				// Provide a generic error message to the client
				return {
					success: false,
					error: "Could not generate access URL for the file",
				} as const;
			}
		} catch (dbError) {
			// Catch potential DB errors during findUnique
			console.error("Database Error fetching attachment:", dbError);
			return {
				success: false,
				error: "Failed to retrieve attachment details",
			} as const;
		}
	});
