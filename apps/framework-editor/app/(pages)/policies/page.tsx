import { db } from "@comp/db";
import { PoliciesClientPage } from "./PoliciesClientPage"; // Import the new Client Component

export default async function Page() {
    const policies = await db.frameworkEditorPolicyTemplate.findMany({
        // Add any ordering if necessary, e.g., orderBy: { name: 'asc' }
    });

    return (
        <PoliciesClientPage initialPolicies={policies} />
    );
}
