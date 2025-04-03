import type { ActionResponse } from "@/actions/types";
import { Evidence, Member, User } from "@comp/db/types";

export interface UploadUrlResponse {
	uploadUrl: string;
	fileUrl: string;
}

export interface FileUploadResponse extends ActionResponse<UploadUrlResponse> {}

export interface UpdateUrlsResponse
	extends ActionResponse<{
		additionalUrls: string[];
	}> {}

export interface DeleteFileResponse extends ActionResponse<null> {}

export interface UploadFileResponse
	extends ActionResponse<{
		fileUrl: string;
	}> {}

export interface EvidenceDetailsProps {
	assignees: (Member & {
		user: User;
	})[];
	evidence: Evidence & {
		assignee: Member & {
			user: User;
		};
	};
}
