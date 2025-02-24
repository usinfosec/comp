"use client";

import { Button } from "@bubba/ui/button";
import { Card, CardContent, CardFooter } from "@bubba/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@bubba/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@bubba/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@bubba/ui/tooltip";
import { ExternalLink, Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { FileIcon } from "./FileIcon";

interface FilePreviewState {
  url: string | null;
  isLoading: boolean;
}

interface FileCardProps {
  url: string;
  previewState: FilePreviewState;
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPreviewClick: (url: string) => Promise<void>;
  onDelete: (url: string) => Promise<void>;
}

export function FileCard({
  url,
  previewState,
  isDialogOpen,
  onOpenChange,
  onPreviewClick,
  onDelete,
}: FileCardProps) {
  const fileName = url.split("/").pop() || url;
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  const isPdf = /\.pdf$/i.test(fileName);

  return (
    <Card className="group transition-all hover:shadow-md h-[220px] flex flex-col overflow-hidden">
      <CardContent className="p-0 flex-grow overflow-hidden">
        <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <button type="button" className="w-full h-full focus:outline-none">
              <div className="flex flex-col items-center justify-center p-4 h-full">
                <div className="flex items-center justify-center h-20 w-20 bg-accent/20 rounded-md overflow-hidden mb-2">
                  {previewState.isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <FileIcon fileName={fileName} />
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h4 className="text-sm font-medium truncate text-center max-w-full">
                        {fileName}
                      </h4>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{fileName}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            {previewState.url ? (
              <div className="relative w-full h-[80vh]">
                {isImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewState.url}
                      alt={fileName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                    />
                  </div>
                ) : isPdf ? (
                  <iframe
                    src={previewState.url}
                    className="w-full h-full"
                    title={fileName}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      Preview not available. Click the download button to view
                      the file.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[80vh]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="justify-center gap-3 py-2 px-3 border-t mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="h-10 w-10 rounded-full"
              >
                <a
                  href={previewState.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 flex items-center justify-center"
                  onClick={(e) => {
                    if (!previewState.url) {
                      e.preventDefault();
                      onPreviewClick(url);
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full hover:text-destructive hover:border-destructive h-10 w-10"
                  >
                    <Trash className="w-full h-full" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete File</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(url)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
