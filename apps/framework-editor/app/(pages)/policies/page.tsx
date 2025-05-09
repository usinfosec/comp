import PageLayout from "@/app/components/PageLayout";
import { db } from "@comp/db";
// import { PoliciesTable } from "./components/PoliciesTable"; // Old import, commented out
import { DataTable } from "@/app/components/DataTable"; // New generic table
import { columns } from "./components/columns"; // Import the new columns

export default async function Page() {
    const policies = await db.frameworkEditorPolicyTemplate.findMany();

    await new Promise(resolve => setTimeout(resolve, 10000));

    return (
        <PageLayout breadcrumbs={[{ label: "Policies", href: "/policies" }]}>
            {/* <PoliciesTable policies={policies} /> */}
            <DataTable 
              data={policies} 
              columns={columns} // Pass the columns
              searchQueryParamName="policies-search" 
            />
        </PageLayout>
    );
}
