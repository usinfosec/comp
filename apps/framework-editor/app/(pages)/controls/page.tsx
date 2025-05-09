import { db } from "@comp/db";
import PageLayout from "@/app/components/PageLayout";
// import { ControlsTable } from "./components/ControlsTable"; // Old import
import { DataTable } from "@/app/components/DataTable"; // New generic table
import { columns } from "./components/columns"; // Import the new columns

export default async function Page() {
    const controls = await db.frameworkEditorControlTemplate.findMany({
      // Optionally include related data if you plan to display it and it's not too large
      // include: {
      //   policyTemplates: true,
      //   requirements: true,
      //   taskTemplates: true,
      // }
    });

    return (
        <PageLayout breadcrumbs={[{ label: "Controls", href: "/controls" }]}>
            {/* <ControlsTable controls={controls} /> */}
            <DataTable 
              data={controls} 
              columns={columns} // Pass the columns
              searchQueryParamName="controls-search" 
            />
        </PageLayout>
    );
}