"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/app/actions/actions"; // Ensure correct path
import { auth } from "@/utils/auth"; // Server-side auth
import { authClient } from "@/utils/auth-client"; // Client-side SDK usage for consistency (can use server-side directly too)
import { headers } from "next/headers";

// Schema for individual email validation
const emailSchema = z.string().email({ message: "Invalid email format" });

// Input schema for the bulk invite action
const schema = z.object({
	organizationId: z.string(), // Org ID needed for invitation
	emails: z
		.array(emailSchema)
		.min(1, { message: "At least one email is required." }),
});

// Define the structure for the results array
// This will be placed inside the 'data' field of ActionResponse
interface InviteResult {
	email: string;
	success: boolean;
	error?: string;
}

// Success data structure is just an array of results
// No need for a separate interface if ActionResponse is not generic
// interface BulkInviteSuccessData {
// 	results: InviteResult[];
// }

// Use the standard ActionResponse type
// type BulkInviteActionResponse = ActionResponse<BulkInviteSuccessData>; // Removed generic

export const bulkInviteEmployees = createSafeActionClient()
	.schema(schema)
	// Correctly destructure from parsedInput inside the action function argument
	.action(async ({ parsedInput }): Promise<ActionResponse> => {
		// Corrected signature and return type
		const { organizationId, emails } = parsedInput; // Destructure here

		// Note: Using authClient for consistency with single invite, but requires careful handling on server
		// Alternatively, could use server-side auth helpers directly if authClient causes issues.

		// Check server-side session (optional but good practice)
		const session = await auth.api.getSession({ headers: await headers() });
		if (session?.session.activeOrganizationId !== organizationId) {
			return {
				success: false,
				error: "Unauthorized or invalid organization.",
			}; // TODO: Use appErrors
		}

		const results: InviteResult[] = [];
		let allSuccess = true; // Track if all invites succeeded

		for (const email of emails) {
			try {
				// Call the invite member function for each email
				// We assume the role is always 'employee' for this action
				await authClient.organization.inviteMember({
					email: email,
					role: "employee",
					// organizationId is implicitly handled by authClient context or needs to be passed if required by SDK method
				});
				results.push({ email, success: true });
			} catch (error) {
				allSuccess = false; // Mark as not fully successful if any invite fails
				console.error(`Failed to invite ${email}:`, error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Invitation failed";
				results.push({ email, success: false, error: errorMessage });
			}
		}

		// Return results within the 'data' field.
		// Decide overall success based on whether *all* invites succeeded.
		// Consider returning partial failures in the error field or just in data.
		// For now, return success: true, and let the client parse the 'data' field for details.
		return { success: true, data: results };
	});
