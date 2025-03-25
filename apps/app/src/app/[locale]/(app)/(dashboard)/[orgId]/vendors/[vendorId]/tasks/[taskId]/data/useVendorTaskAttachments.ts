"use client";

import useSWR from "swr";
import { getVendorTaskAttachments } from "./getVendorTaskAttachments";

interface UseVendorTaskAttachmentProps {
	id: string;
}

async function fetchVendorTaskAttachments({ id }: UseVendorTaskAttachmentProps) {
	const result = await getVendorTaskAttachments(id);

	if (!result || "error" in result) {
		throw new Error(
			typeof result?.error === "string"
				? result.error
				: "Failed to fetch vendor task attachments",
		);
	}

	return result.data;
}

export function useVendorTaskAttachments({ id }: UseVendorTaskAttachmentProps) {
	return useSWR(["vendor-task-attachments", id], () => fetchVendorTaskAttachments({ id }), {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
} 