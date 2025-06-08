import type { Member, Policy } from "@comp/db/types";
import { Frequency, type User } from "@comp/db/types";
import { AssigneeField } from "./AssigneeField";
import { DepartmentField } from "./DepartmentField";
import { ReviewDateField } from "./ReviewDateField";
import { ReviewFrequencyField } from "./ReviewFrequencyField";
import { SignatureRequirementField } from "./SignatureRequirementField";
import { StatusField } from "./StatusField";

export interface PolicyFieldsGroupValue {
	status: Policy["status"];
	frequency: Policy["frequency"];
	department: Policy["department"];
	assigneeId: string;
	reviewDate: Date | null;
	isRequiredToSign: boolean;
}

interface PolicyFieldsGroupProps {
	value: PolicyFieldsGroupValue;
	assignees: (Member & { user: User })[];
	onChange: (value: PolicyFieldsGroupValue) => void;
	fieldsDisabled: boolean;
}

export function PolicyFieldsGroup({
	value,
	assignees,
	onChange,
	fieldsDisabled,
}: PolicyFieldsGroupProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<StatusField
				value={value.status}
				onChange={(status) => onChange({ ...value, status })}
				disabled={fieldsDisabled}
			/>

			<ReviewFrequencyField
				value={value.frequency ?? Frequency.monthly}
				onChange={(frequency) => onChange({ ...value, frequency })}
				disabled={fieldsDisabled}
			/>

			<DepartmentField
				value={value.department}
				onChange={(department) => onChange({ ...value, department })}
				disabled={fieldsDisabled}
			/>

			<AssigneeField
				assignees={assignees}
				value={value.assigneeId}
				onChange={(assigneeId) => onChange({ ...value, assigneeId })}
				disabled={fieldsDisabled}
			/>

			<ReviewDateField
				value={value.reviewDate}
				onChange={(reviewDate) => onChange({ ...value, reviewDate })}
				disabled={fieldsDisabled}
			/>

			<SignatureRequirementField
				value={value.isRequiredToSign}
				onChange={(isRequiredToSign) =>
					onChange({ ...value, isRequiredToSign })
				}
				disabled={fieldsDisabled}
			/>
		</div>
	);
}
