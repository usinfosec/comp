"use client";

import { UPLOAD_TYPE } from "@/actions/types";
import { useVendorTaskAttachments } from "@/app/[locale]/(app)/(dashboard)/[orgId]/vendors/[vendorId]/tasks/[taskId]/data/useVendorTaskAttachments";
import { FileSection } from "@/components/upload/FileSection";
import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Skeleton } from "@bubba/ui/skeleton";

interface AttachmentsProps {
    taskId: string;
}

interface TaskAttachment {
    fileUrl: string;
    fileKey: string | null;
}

export default function Attachments({ taskId }: AttachmentsProps) {
    const { data, isLoading, error, mutate } = useVendorTaskAttachments({
        id: taskId,
    });
    const t = useI18n();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-60 w-full" />
            </div>
        );
    }

    if (error) {
        return <div>Error</div>;
    }

    const handleMutate = async () => {
        await mutate();
    };

    if (!data) return null;

    const attachments = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className="flex items-center justify-between gap-2">
                        {t("vendors.tasks.attachments")}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <FileSection
                    uploadType={UPLOAD_TYPE.vendorTask}
                    taskId={taskId}
                    fileUrls={attachments.map((attachment: TaskAttachment) => attachment.fileUrl)}
                    onSuccess={handleMutate}
                />
            </CardContent>
        </Card>
    );
}