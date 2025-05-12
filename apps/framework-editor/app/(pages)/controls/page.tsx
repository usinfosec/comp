import { db } from "@comp/db";
// import PageLayout from "@/app/components/PageLayout"; // No longer needed here
// import { DataTable } from "@/app/components/DataTable"; // No longer needed here
// import { columns } from "./components/columns"; // No longer needed here
import { ControlsClientPage } from "./ControlsClientPage"; // Import the new Client Component

export default async function Page() {
    const controls = await db.frameworkEditorControlTemplate.findMany({
      include: {
        policyTemplates: {
          select: {
            id: true,
            name: true,
          }
        },
        requirements: {
          select: {
            id: true,
            name: true,
            framework: {
              select: {
                name: true,
              }
            }
          }
        },
        taskTemplates: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: {
        name: "asc",
      },
    });

    // Sort controls in a case-insensitive way
    const sortedControls = [...controls].sort((a, b) => 
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    return (
        <ControlsClientPage initialControls={sortedControls} />
    );
}