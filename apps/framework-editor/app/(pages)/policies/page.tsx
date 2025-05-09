import PageLayout from "@/app/components/PageLayout";
import { db } from "@comp/db";
// import { PoliciesTable } from "./components/PoliciesTable"; // Old import, commented out
import { DataTable } from "@/app/components/DataTable"; // New generic table

export default async function Page() {
    const policies = await db.frameworkEditorPolicyTemplate.findMany();

    return (
        <PageLayout title="Policies">
            {/* <PoliciesTable policies={policies} /> */}
            <DataTable data={policies} searchQueryParamName="policies-search" />
        </PageLayout>
    );
}
