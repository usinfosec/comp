"use client";

import { Button } from "@bubba/ui/button";
import { Input } from "@bubba/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { useUrlManagement } from "../hooks/useUrlManagement";

interface UrlSectionProps {
  evidenceId: string;
  additionalUrls: string[];
  onSuccess: () => Promise<void>;
}

export function UrlSection({
  evidenceId,
  additionalUrls,
  onSuccess,
}: UrlSectionProps) {
  const {
    draftUrls,
    handleAddDraft,
    handleUpdateDraft,
    handleRemoveDraft,
    handleSaveUrls,
    handleUrlRemove,
  } = useUrlManagement({
    evidenceId,
    currentUrls: additionalUrls,
    onSuccess,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Additional Links</h3>
        <span className="text-xs text-muted-foreground">
          {additionalUrls.length} link{additionalUrls.length !== 1 ? "s" : ""}{" "}
          added
        </span>
      </div>

      <div className="flex flex-col items-start w-full">
        <div className="w-full max-w-sm space-y-2">
          {/* Existing URLs */}
          {additionalUrls.map((url) => (
            <div
              key={url}
              className="group flex items-center gap-2 rounded-md border bg-card p-2 hover:bg-accent/50"
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 truncate text-sm text-primary hover:underline"
              >
                {url}
              </a>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleUrlRemove(url)}
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Draft URLs */}
          {draftUrls.map((draft) => (
            <div
              key={draft.id}
              className="group flex items-center gap-2 rounded-md border bg-card p-2"
            >
              <Input
                type="url"
                placeholder="Enter URL"
                value={draft.url}
                onChange={(e) => handleUpdateDraft(draft.id, e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.url.trim()) {
                    e.preventDefault();
                    handleSaveUrls();
                  }
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleRemoveDraft(draft.id)}
                className="h-8 w-8 hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAddDraft}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
            {draftUrls.length > 0 && (
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleSaveUrls}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Links
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
