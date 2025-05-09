import { db } from "@comp/db";
import { FrameworksClientPage } from "./FrameworksClientPage"; // Import the Client Component

export default async function Page() {
    const frameworks = await db.frameworkEditorFramework.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <FrameworksClientPage initialFrameworks={frameworks} />
    );
} 