import { db } from "@comp/db";

export default async function Page() {

    const frameworks = await db.frameworkEditorFramework.findMany();
    
    return (
        <div>
            <h1>Frameworks</h1>
            <ul>
                {frameworks.map((framework) => (
                    <li key={framework.id}>{framework.name}</li>
                ))}
            </ul>
        </div>
    );
}