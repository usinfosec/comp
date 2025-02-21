"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Cloud, Loader2 } from "lucide-react";
import { cn } from "@bubba/ui/cn";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export function FileUpload({
  onFileSelect,
  isUploading,
  accept = {
    "application/pdf": [".pdf"],
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxSize = 10 * 1024 * 1024, // 10MB
}: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple: false,
    });

  return (
    <div className="flex justify-start w-full">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center w-full max-w-sm rounded-lg border-2 border-dashed p-6 transition-colors",
          isDragActive
            ? "border-primary/50 bg-primary/5"
            : "border-muted-foreground/25",
          isDragReject && "border-destructive/50 bg-destructive/5",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          {isUploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="mt-2">Uploading file...</p>
            </>
          ) : (
            <>
              <Cloud className="h-6 w-6 text-primary" />
              <p className="mt-2">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag & drop a file here, or click to select"}
              </p>
              <p className="mt-1">
                Max file size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
