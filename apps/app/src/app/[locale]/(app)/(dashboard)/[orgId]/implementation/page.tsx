import { db } from "@comp/db";
import { Icons } from "@comp/ui/icons";
import { BookOpen, ListCheck, NotebookText, Store, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { cache } from 'react'
import { Checklist } from "./components/Checklist";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { ChecklistItemProps } from "./types/ChecklistProps.types";

const getChecklistItems = cache(async (orgId: string): Promise<{ checklistItems: ChecklistItemProps[], completedItems: number, totalItems: number } | { error: string }> => {
    const onboarding = await db.onboarding.findUnique({
        where: {
            organizationId: orgId,
        },
    });

    if (!onboarding) {
        return { error: "Organization onboarding not found" };
    }

    const checklistItems: ChecklistItemProps[] = [
        {
            title: "Check & Publish Policies",
            description: "We've given you all of the policies you need to get started. Go through them, make sure they're relevant to your organization and then publish them for your employees to sign.",
            href: `/${orgId}/policies`,
            dbColumn: "policies",
            completed: onboarding.policies,
            docs: "https://trycomp.ai/docs/policies",
            buttonLabel: "Publish Policies",
            icon: <NotebookText className="h-5 w-5" />,
        },
        {
            title: "Add Employees",
            description: "You should add all of your employees to Comp AI, either through an integration or by manually adding them and then ask them to sign the policies you published in the employee portal.",
            href: `/${orgId}/employees`,
            dbColumn: "employees",
            completed: onboarding.employees,
            docs: "https://trycomp.ai/docs/employees",
            buttonLabel: "Add an Employee",
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: "Add Vendors",
            description: "For frameworks like SOC 2, you must assess and report on your vendors. You can add your vendors to Comp AI, and assign risk levels to them. Auditors can review the vendors and their risk levels.",
            href: `/${orgId}/vendors`,
            dbColumn: "vendors",
            completed: onboarding.vendors,
            docs: "https://trycomp.ai/docs/vendors",
            buttonLabel: "Add a Vendor",
            icon: <Store className="h-5 w-5" />,
        },
        {
            title: "Manage Risks",
            description: "You can manage your risks in Comp AI by adding them to your organization and then assigning them to employees or vendors. Auditors can review the risks and their status.",
            href: `/${orgId}/risk`,
            dbColumn: "risk",
            completed: onboarding.risk,
            docs: "https://trycomp.ai/docs/risks",
            buttonLabel: "Create a Risk",
            icon: <Icons.Risk className="h-5 w-5" />,
        },
        {
            title: "Upload Evidence",
            description: "Evidence in Comp AI is automatically generated for you, based on the frameworks you selected. Evidence tasks are linked to controls, which are determined by your policies. By uploading evidence, you can show auditors that you are following your own policies.",
            href: `/${orgId}/evidence`,
            dbColumn: "evidence",
            completed: onboarding.evidence,
            docs: "https://trycomp.ai/docs/evidence",
            buttonLabel: "Upload Evidence",
            icon: <ListCheck className="h-5 w-5" />,
        }
    ];

    const completedItems = checklistItems.filter((item) => item.completed).length;
    const totalItems = checklistItems.length;

    if (completedItems === totalItems) {
        return redirect(`/${orgId}/frameworks`);
    }

    return { checklistItems, completedItems, totalItems };
})

export default async function Page({
    params,
}: {
    params: Promise<{ orgId: string }>;
}) {
    const { orgId } = await params;
    const checklistData = await getChecklistItems(orgId);

    if ('error' in checklistData) {
        return <div>{checklistData.error}</div>;
    }

    return (
        <div className="space-y-6">
            <OnboardingProgress
                completedSteps={checklistData.completedItems}
                totalSteps={checklistData.totalItems}
            />
            <Checklist items={checklistData.checklistItems} />
        </div>
    )
}
