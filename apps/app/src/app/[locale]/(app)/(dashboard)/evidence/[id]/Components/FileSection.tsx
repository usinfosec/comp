"use client";

import { useCallback, useState } from "react";
import { FileUpload } from "./FileUpload";
import { useFileUpload } from "../hooks/useFileUpload";
import { useFileDelete } from "../hooks/useFileDelete";
import { useFilePreview } from "../hooks/useFilePreview";
import { FileCard } from "./FileCard";

interface FileSectionProps {
  evidenceId: string;
  fileUrls: string[];
  onSuccess: () => Promise<void>;
}

interface FilePreviewState {
  url: string | null;
  isLoading: boolean;
}

export function FileSection({
  evidenceId,
  fileUrls,
  onSuccess,
}: FileSectionProps) {
  const { isUploading, handleFileUpload } = useFileUpload({
    evidenceId,
    onSuccess,
  });

  const { handleDelete } = useFileDelete({
    evidenceId,
    onSuccess,
  });

  const { getPreviewUrl } = useFilePreview({
    evidenceId,
  });

  // Track preview state for each file
  const [previewStates, setPreviewStates] = useState<
    Record<string, FilePreviewState>
  >({});
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const handlePreviewClick = useCallback(
    async (fileUrl: string) => {
      try {
        setPreviewStates((prev) => ({
          ...prev,
          [fileUrl]: { url: null, isLoading: true },
        }));

        const previewUrl = await getPreviewUrl(fileUrl);

        setPreviewStates((prev) => ({
          ...prev,
          [fileUrl]: { url: previewUrl, isLoading: false },
        }));
      } catch (error) {
        console.error("Error loading preview:", error);
        setPreviewStates((prev) => ({
          ...prev,
          [fileUrl]: { url: null, isLoading: false },
        }));
      }
    },
    [getPreviewUrl]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Files</h3>
        <span className="text-xs text-muted-foreground">
          {fileUrls.length} file{fileUrls.length !== 1 ? "s" : ""} uploaded
        </span>
      </div>

      <FileUpload onFileSelect={handleFileUpload} isUploading={isUploading} />

      {fileUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fileUrls.map((url) => {
            const previewState = previewStates[url] || {
              url: null,
              isLoading: false,
            };

            return (
              <FileCard
                key={url}
                url={url}
                previewState={previewState}
                isDialogOpen={openDialogId === url}
                onOpenChange={(open) => {
                  if (open) {
                    setOpenDialogId(url);
                    handlePreviewClick(url);
                  } else {
                    setOpenDialogId(null);
                  }
                }}
                onPreviewClick={handlePreviewClick}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
