import { db } from "@comp/db";
// import { FrameworksTable } from "./components/FrameworksTable"; // Old import
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable"; // New generic table
import { columns } from "./components/columns"; // Import the columns

export default async function Page() {
    const frameworks = await db.frameworkEditorFramework.findMany();

    return (
        <PageLayout title="Frameworks">
            {/* <FrameworksTable frameworks={frameworks} /> */}
            <DataTable data={frameworks} columns={columns} searchQueryParamName="frameworks-search" />
        </PageLayout>
    );
}