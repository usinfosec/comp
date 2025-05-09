import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
// import { TasksTable } from "./components/TasksTable"; // Old import
import { DataTable } from "@/app/components/DataTable"; // New generic table
import { columns } from "./components/columns"; // Import the new columns

export default async function Page() {
    const tasks = await db.frameworkEditorTaskTemplate.findMany({
      // Optionally include related data if needed
      // include: { controlTemplates: true }
    });

    return (
        <PageLayout breadcrumbs={[{ label: "Tasks", href: "/tasks" }]}>
            {/* <TasksTable tasks={tasks} /> */}
            <DataTable 
              data={tasks} 
              columns={columns} // Pass the columns
              searchQueryParamName="tasks-search" 
            />
        </PageLayout>
    );
}