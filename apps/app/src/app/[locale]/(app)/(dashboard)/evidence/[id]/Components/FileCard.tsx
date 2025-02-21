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
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="pt-6">
        <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <button type="button" className="w-full focus:outline-none">
              <div className="flex items-center justify-center h-32 bg-accent/20 rounded-md overflow-hidden">
                {previewState.isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <FileIcon fileName={fileName} />
                )}
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="mt-4 text-sm font-medium truncate text-center">
                {fileName}
              </h4>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fileName}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter className="justify-center gap-2 p-2">
        <Button size="sm" variant="ghost" asChild className="h-8 w-8">
          <a
            href={previewState.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 hover:text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
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
              <AlertDialogAction
                onClick={() => onDelete(url)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
