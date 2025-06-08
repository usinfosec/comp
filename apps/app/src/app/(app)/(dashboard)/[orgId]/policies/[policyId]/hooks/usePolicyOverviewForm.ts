import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { updatePolicyFormAction } from "@/actions/policies/update-policy-form-action";
import { submitPolicyForApprovalAction } from "@/actions/policies/submit-policy-for-approval-action";
import {
  Frequency,
  PolicyStatus,
  type Policy,
  type Member,
  type User,
} from "@comp/db/types";
import type { PolicyFieldsGroupValue } from "../components/UpdatePolicyOverview/fields/PolicyFieldsGroup";
import { Departments } from "@comp/db/types";

// Type for signature requirement field in payloads
export type SignatureRequirement = "required" | "not_required";

interface UsePolicyOverviewFormArgs {
  policy: Policy & { approver: (Member & { user: User }) | null };
  assignees: (Member & { user: User })[];
  isPendingApproval: boolean;
}

function getPreparedFields(fields: PolicyFieldsGroupValue): {
  name: string;
  description: string;
  status: PolicyFieldsGroupValue["status"];
  assigneeId: string | null;
  department: Departments | "none";
  reviewFrequency: Frequency;
  isRequiredToSign: SignatureRequirement;
  reviewDate: Date;
} {
  return {
    name: fields.name.trim(),
    description: fields.description.trim(),
    status: fields.status,
    assigneeId: fields.assigneeId || null,
    department: fields.department ?? Departments.none,
    reviewFrequency: fields.frequency ?? Frequency.yearly,
    isRequiredToSign: fields.isRequiredToSign ? "required" : "not_required",
    reviewDate: fields.reviewDate || new Date(),
  };
}

export function usePolicyOverviewForm({
  policy,
  assignees,
  isPendingApproval,
}: UsePolicyOverviewFormArgs) {
  const [fields, setFields] = useState<PolicyFieldsGroupValue>({
    name: policy.name,
    description: policy.description || "",
    status: policy.status,
    frequency: policy.frequency ?? Frequency.yearly,
    department: policy.department,
    assigneeId: policy.assigneeId || "",
    reviewDate: policy.reviewDate ? new Date(policy.reviewDate) : null,
    isRequiredToSign: policy.isRequiredToSign,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formInteracted, setFormInteracted] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedApproverId, setSelectedApproverId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const fieldsDisabled = isPendingApproval;

  const handleFormChange = () => setFormInteracted(true);

  const handleFieldsChange = (newFields: PolicyFieldsGroupValue) => {
    setFields({
      ...newFields,
      frequency: newFields.frequency ?? Frequency.yearly,
    });
    handleFormChange();
  };

  const updatePolicyForm = useAction(updatePolicyFormAction, {
    onSuccess: () => {
      toast.success("Policy updated successfully");
      setIsSubmitting(false);
      setFormInteracted(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update policy");
      setIsSubmitting(false);
    },
  });

  const submitForApproval = useAction(submitPolicyForApprovalAction, {
    onSuccess: () => {
      toast.success("Policy submitted for approval successfully!");
      setIsSubmitting(false);
      setIsApprovalDialogOpen(false);
      setFormInteracted(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to submit policy for approval.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      name,
      description,
      status,
      assigneeId,
      department,
      reviewFrequency,
      isRequiredToSign,
      reviewDate,
    } = getPreparedFields(fields);

    const isPublishedWithChanges =
      policy.status === "published" &&
      (status !== policy.status ||
        assigneeId !== policy.assigneeId ||
        department !== policy.department ||
        reviewFrequency !== policy.frequency ||
        (policy.isRequiredToSign ? "required" : "not_required") !==
          isRequiredToSign ||
        (policy.reviewDate
          ? new Date(policy.reviewDate).toDateString()
          : "") !== reviewDate.toDateString());
    if (
      (policy.status === "draft" && status === "published") ||
      isPublishedWithChanges
    ) {
      setIsApprovalDialogOpen(true);
      setIsSubmitting(false);
    } else {
      updatePolicyForm.execute({
        id: policy.id,
        name,
        description,
        status,
        assigneeId,
        department,
        review_frequency: reviewFrequency,
        review_date: reviewDate,
        isRequiredToSign,
        approverId: null,
        entityId: policy.id,
      });
    }
  };

  const handleConfirmApproval = () => {
    if (!selectedApproverId) {
      toast.error("Approver is required.");
      return;
    }
    setIsSubmitting(true);
    const {
      name,
      description,
      status,
      assigneeId,
      department,
      reviewFrequency,
      isRequiredToSign,
      reviewDate,
    } = getPreparedFields({ ...fields, status: PolicyStatus.needs_review });
    submitForApproval.execute({
      id: policy.id,
      name,
      description,
      status,
      assigneeId,
      department,
      review_frequency: reviewFrequency,
      review_date: reviewDate,
      isRequiredToSign,
      approverId: selectedApproverId,
      entityId: policy.id,
    });
    setSelectedApproverId(null);
  };

  const hasFormChanges = formInteracted;
  const isPublishingDraft =
    policy.status === "draft" && fields.status === "published";
  const isUpdatingPublished = policy.status === "published" && hasFormChanges;
  const buttonText =
    isPublishingDraft || isUpdatingPublished ? "Submit for Approval" : "Save";

  return {
    fields,
    setFields,
    isSubmitting,
    setIsSubmitting,
    isApprovalDialogOpen,
    setIsApprovalDialogOpen,
    selectedApproverId,
    setSelectedApproverId,
    handleFieldsChange,
    handleSubmit,
    handleConfirmApproval,
    buttonText,
    fieldsDisabled,
    hasFormChanges,
    assignees,
    updatePolicyForm,
    submitForApproval,
  };
}
