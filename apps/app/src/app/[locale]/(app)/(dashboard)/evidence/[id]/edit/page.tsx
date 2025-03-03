"use client";

import { useI18n } from "@/locales/client";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Skeleton } from "@bubba/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { FileSection } from "../Components/FileSection";
import { UrlSection } from "../Components/UrlSection";
import { useOrganizationEvidence } from "../hooks/useOrganizationEvidence";

export default function EditEvidencePage() {
  const t = useI18n();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, mutate } = useOrganizationEvidence({ id });

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (error) {
    return <div>Error</div>;
  }

  const handleMutate = async () => {
    await mutate();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (!data?.data) return null;

  const evidence = data.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-2">
            {t("evidence.details.content")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileSection
          evidenceId={id}
          fileUrls={evidence.fileUrls}
          onSuccess={handleMutate}
        />

        <UrlSection
          evidenceId={id}
          additionalUrls={evidence.additionalUrls}
          onSuccess={handleMutate}
        />
      </CardContent>
    </Card>
  );
}
