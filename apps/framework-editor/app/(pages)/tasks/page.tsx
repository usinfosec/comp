import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
import { DataTable } from "@/app/components/DataTable";
import { getColumns } from "./components/columns";
import { TasksClientPage } from "./TasksClientPage";

export default async function Page() {
    const tasks = await db.frameworkEditorTaskTemplate.findMany({
      // Optionally include related data if needed
      // include: { controlTemplates: true }
    });

    return <TasksClientPage initialTasks={tasks} />;
}