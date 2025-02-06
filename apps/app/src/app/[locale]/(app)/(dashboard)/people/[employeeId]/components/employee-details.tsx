"use client";

import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import { useI18n } from "@/locales/client";
import { cn } from "@bubba/ui/cn";
import { useEmployeeDetails } from "../../hooks/useEmployee";
import { Skeleton } from "@bubba/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@bubba/ui/alert";
import type { EmployeeTask } from "../types";

interface EmployeeDetailsProps {
  employeeId: string;
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const t = useI18n();
  const { employee, isLoading, error } = useEmployeeDetails(employeeId);

  if (error) {
    if (error.code === "NOT_FOUND") {
      redirect("/people");
    }

    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "An unexpected error occurred"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!employee) return null;

  const tasks = employee.employeeTasks ?? [];
  const completedTasks = tasks.filter(
    (task: EmployeeTask) => task.status === "completed"
  ).length;
  const totalTasks = tasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{employee.name}</h1>
        <p className="text-muted-foreground">{employee.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("people.details.taskProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progressPercentage} />
              <p className="text-sm text-muted-foreground">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("people.details.tasks")}</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task: EmployeeTask) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{task.requiredTask.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.requiredTask.description}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1",
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : task.status === "overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              {t("people.details.noTasks")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
