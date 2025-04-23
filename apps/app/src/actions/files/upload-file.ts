"use server";

import { db } from "@comp/db";
import { AttachmentEntityType, AttachmentType } from "@comp/db/types";
import { z } from "zod";
import { s3Client, BUCKET_NAME } from "@/app/s3";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const uploadFile = async (
	input: z.infer<typeof uploadAttachmentSchema>,
) => {
	const { fileName, fileType, fileData, entityId, entityType } = input;
	const session = await auth.api.getSession({ headers: await headers() });
	const organizationId = session?.session.activeOrganizationId;

	if (!organizationId) {
		return {
			success: false,
			error: "Not authorized - no organization found",
			data: null,
		};
	}

	try {
		// 1. Decode Base64 Data
		const fileBuffer = Buffer.from(fileData, "base64");

		// 2. Prepare S3 Key
		const timestamp = Date.now();
		const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
		const key = `${organizationId}/attachments/${entityType}/${entityId}/${timestamp}-${sanitizedFileName}`;

		// 3. Upload directly to S3 using shared client and bucket name
		const putCommand = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: fileBuffer,
			ContentType: fileType,
		});
		await s3Client.send(putCommand);

		// 4. S3 Key is now stored in the DB. No need to construct full public URL here.

		// 5. Create Attachment Record in DB
		const attachment = await db.attachment.create({
			data: {
				name: fileName,
				url: key, // Store the S3 key in the 'url' field
				type: mapFileTypeToAttachmentType(fileType),
				entityId: entityId,
				entityType: entityType,
				organizationId: organizationId,
			},
		});

		// 6. Generate Pre-signed URL for immediate access
		const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
		const signedUrl = await getSignedUrl(s3Client, getCommand, {
			expiresIn: 900, // Expires in 15 minutes
		});

		// 7. Return Success with Attachment Info AND Signed URL
		return {
			success: true,
			data: {
				...attachment, // Include all DB record fields
				signedUrl: signedUrl, // Add the temporary signed URL
			},
			error: null,
		} as const;
	} catch (error) {
		console.error("Upload file action error:", error);

		return {
			success: false,
			error: "Failed to process file upload.",
			data: null,
		} as const;
	}
};
