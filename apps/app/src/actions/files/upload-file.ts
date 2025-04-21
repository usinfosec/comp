"use server";

import { authActionClient } from "@/actions/safe-action";
// UPLOAD_TYPE might not be needed anymore if we only use AttachmentEntityType
// import { UPLOAD_TYPE } from "@/actions/types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@comp/db";
import { AttachmentEntityType, AttachmentType } from "@comp/db/types";
import { z } from "zod";
import { s3Client, BUCKET_NAME } from "@/app/s3";

// Helper to map MIME type to AttachmentType enum
function mapFileTypeToAttachmentType(fileType: string): AttachmentType {
	const type = fileType.split("/")[0];
	switch (type) {
		case "image":
			return AttachmentType.image;
		case "video":
			return AttachmentType.video;
		case "audio":
			return AttachmentType.audio;
		// Add more specific checks if needed (e.g., application/pdf)
		case "application":
			return AttachmentType.document;
		default:
			return AttachmentType.other;
	}
}

// Update schema to include base64 file data
const uploadAttachmentSchema = z.object({
	fileName: z.string(),
	fileType: z.string(),
	fileData: z.string(), // Base64 encoded file content
	entityId: z.string(),
	entityType: z.nativeEnum(AttachmentEntityType),
});

export const uploadFile = authActionClient
	.schema(uploadAttachmentSchema)
	.metadata({
		name: "uploadFile",
		track: { event: "upload-file", channel: "server" },
	})
	.action(async ({ ctx, parsedInput }) => {
		const { session } = ctx;
		// Destructure updated input
		const { fileName, fileType, fileData, entityId, entityType } =
			parsedInput;
		const organizationId = session.activeOrganizationId;

		if (!organizationId) {
			return {
				success: false,
				error: "Not authorized - no organization found",
			} as const;
		}

		try {
			// 1. Decode Base64 Data
			const fileBuffer = Buffer.from(fileData, "base64");

			// 2. Prepare S3 Key
			const timestamp = Date.now();
			const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
			const key = `${organizationId}/attachments/${entityType}/${entityId}/${timestamp}-${sanitizedFileName}`;

			// 3. Upload directly to S3 using shared client and bucket name
			const command = new PutObjectCommand({
				Bucket: BUCKET_NAME!,
				Key: key,
				Body: fileBuffer,
				ContentType: fileType,
			});
			await s3Client.send(command);

			// 4. Construct Final URL using imported BUCKET_NAME and region
			const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

			// 5. Create Attachment Record in DB
			const attachment = await db.attachment.create({
				data: {
					name: fileName,
					url: fileUrl,
					type: mapFileTypeToAttachmentType(fileType),
					entityId: entityId,
					entityType: entityType,
					organizationId: organizationId,
				},
			});

			// 6. Return Success with only Attachment Info
			return {
				success: true,
				data: {
					// Remove uploadUrl
					attachment,
				},
			} as const;
		} catch (error) {
			console.error("Upload file action error:", error);
			// Consider more specific error handling (S3 vs DB error)
			return {
				success: false,
				error: "Failed to process file upload.",
			} as const;
		}
	});
