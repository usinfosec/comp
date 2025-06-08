import type { Control, Member, Policy, User } from "@comp/db/types";
import type { JSONContent } from "novel";
// biome-ignore lint/style/useImportType: <explanation>
import {
	Comments,
	CommentWithAuthor,
} from "../../../../../../../components/comments/Comments";
// biome-ignore lint/style/useImportType: <explanation>
import { AuditLogWithRelations } from "../data";
import { PolicyPageEditor } from "../editor/components/PolicyDetails";
import { PolicyOverview } from "./PolicyOverview";
import { RecentAuditLogs } from "./RecentAuditLogs";

export default function PolicyPage({
	policy,
	assignees,
	mappedControls,
	allControls,
	isPendingApproval,
	policyId,
	logs,
	comments,
}: {
	policy: Policy & { approver: (Member & { user: User }) | null };
	assignees: (Member & { user: User })[];
	mappedControls: Control[];
	allControls: Control[];
	isPendingApproval: boolean;
	policyId: string;
	logs: AuditLogWithRelations[];
	comments: CommentWithAuthor[];
}) {
	return (
		<>
			<PolicyOverview
				policy={policy}
				assignees={assignees}
				mappedControls={mappedControls}
				allControls={allControls}
				isPendingApproval={isPendingApproval}
			/>
			<PolicyPageEditor
				isPendingApproval={isPendingApproval}
				policyId={policyId}
				policyContent={policy?.content ? (policy.content as JSONContent[]) : []}
			/>

			<RecentAuditLogs logs={logs} />

			<Comments entityId={policyId} comments={comments} entityType="policy" />
		</>
	);
}
