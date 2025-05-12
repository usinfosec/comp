import PageLayout from "@/app/components/PageLayout";
import { db } from "@comp/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card"; // Assuming card components are here
import { PolicyEditorClient } from "./PolicyEditorClient"; // Import the client component
import "@comp/ui/editor.css"; // Import editor styles

interface PolicyDetailPageProps {
    params: Promise<{
        policyId: string;
    }>;
}

export default async function PolicyDetailPage({ params }: PolicyDetailPageProps) {
    const { policyId } = await params; // Extract policyId first

    const policy = await db.frameworkEditorPolicyTemplate.findUnique({
        where: { id: policyId }, // Use the extracted variable
        // Ensure content is selected (default behavior, but explicit is fine)
        // select: { id: true, name: true, description: true, frequency: true, department: true, content: true }
    });

    if (!policy) {
        notFound();
    }

    // --- DEBUGGING STEP 1: Log content on server ---
    console.log("Policy Content from DB (Server):", JSON.stringify(policy.content, null, 2));
    // --- END DEBUGGING STEP ---

    return (
        <PageLayout breadcrumbs={[
            { label: "Policies", href: "/policies" },
            { label: policy.name, href: `/policies/${policy.id}` }
        ]}>
            {/* Display existing details */}
            <Card className="rounded-sm">
                <CardHeader>
                    <CardTitle>{policy.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Description:</strong> {policy.description}</p>
                    <p><strong>Frequency:</strong> {policy.frequency}</p>
                    <p><strong>Department:</strong> {policy.department}</p>
                </CardContent>
            </Card>

            {/* Add the Editor Client Component */}
            <PolicyEditorClient 
                policyId={policy.id}
                policyName={policy.name}
                initialContent={policy.content as any} // Cast Prisma.JsonValue to any for now
            />
        </PageLayout>
    );
} 