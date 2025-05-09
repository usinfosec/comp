import { db } from "@comp/db";
// import { FrameworksTable } from "./components/FrameworksTable"; // Old import
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable"; // New generic table

export default async function Page() {
    const frameworks = await db.frameworkEditorFramework.findMany();

    return (
        <PageLayout title="Frameworks">
            {/* <FrameworksTable frameworks={frameworks} /> */}
            <DataTable data={frameworks} searchQueryParamName="frameworks-search" />
        </PageLayout>
    );
}