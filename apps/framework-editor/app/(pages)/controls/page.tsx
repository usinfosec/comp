import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
// import { ControlsTable } from "./components/ControlsTable"; // Old import
import { DataTable } from "@/app/components/DataTable"; // New generic table

export default async function Page() {
    const controls = await db.frameworkEditorControlTemplate.findMany();

    return (
        <PageLayout title="Controls">
            {/* <ControlsTable controls={controls} /> */}
            <DataTable data={controls} searchQueryParamName="controls-search" />
        </PageLayout>
    );
}