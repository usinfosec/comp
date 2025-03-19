"use client";

import { useI18n } from "@/locales/client";
import type { Framework } from "@bubba/db/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bubba/ui/card";
import { Button } from "@bubba/ui/button";
import { Checkbox } from "@bubba/ui/checkbox";
import { useState } from "react";
import { cn } from "@bubba/ui/cn";

interface FrameworkGridProps {
  frameworks: Framework[];
  onSubmit: (selectedFrameworks: string[]) => Promise<void>;
}

export function FrameworkGrid({ frameworks, onSubmit }: FrameworkGridProps) {
  const t = useI18n();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  /**
   * Toggles the selection state of a framework.
   * If the framework is already selected, it removes it from the selection.
   * If the framework is not selected, it adds it to the selection.
   *
   * @param frameworkId - The ID of the framework to toggle
   */
  const handleFrameworkToggle = (frameworkId: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(frameworkId)
        ? prev.filter((id) => id !== frameworkId)
        : [...prev, frameworkId],
    );
  };

  const handleSubmit = async () => {
    if (selectedFrameworks.length === 0) return;

    setIsLoading(true);
    try {
      await onSubmit(selectedFrameworks);
    } catch (error) {
      console.error("Error selecting frameworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!frameworks.length && !isSelecting) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 select-none">
        <h2 className="text-2xl font-semibold tracking-tight select-none">
          {t("frameworks.overview.grid.welcome.title")}
        </h2>
        <p className="text-muted-foreground max-w-[600px] select-none">
          {t("frameworks.overview.grid.welcome.description")}
        </p>
        <Button onClick={() => setIsSelecting(true)}>
          {t("frameworks.overview.grid.welcome.action")}
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t("frameworks.overview.grid.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {frameworks.map((framework) => (
            <div
              key={framework.id}
              className={cn(
                "relative flex flex-col p-4 rounded-lg border cursor-pointer transition-colors",
                selectedFrameworks.includes(framework.id)
                  ? "border-primary bg-primary/5"
                  : "hover:border-muted-foreground/25",
              )}
              onClick={() => handleFrameworkToggle(framework.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{framework.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {framework.description}
                  </p>
                  <p className="text-xs text-muted-foreground/75 mt-2">
                    {`${t("frameworks.overview.grid.version")}: ${framework.version}`}
                  </p>
                </div>
                <Checkbox
                  checked={selectedFrameworks.includes(framework.id)}
                  className="mt-1"
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => handleFrameworkToggle(framework.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => setSelectedFrameworks([])}
          disabled={selectedFrameworks.length === 0 || isLoading}
        >
          {t("frameworks.overview.grid.actions.clear")}
        </Button>
        <Button
          disabled={selectedFrameworks.length === 0}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          {t("frameworks.overview.grid.actions.confirm")}
        </Button>
      </CardFooter>
    </Card>
  );
}
