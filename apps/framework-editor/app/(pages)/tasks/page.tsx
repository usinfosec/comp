import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
// import { TasksTable } from "./components/TasksTable"; // Old import
import { DataTable } from "@/app/components/DataTable"; // New generic table

export default async function Page() {
    const tasks = await db.frameworkEditorTaskTemplate.findMany();

    return (
        <PageLayout title="Tasks">
            {/* <TasksTable tasks={tasks} /> */}
            <DataTable data={tasks} searchQueryParamName="tasks-search" />
        </PageLayout>
    );
}