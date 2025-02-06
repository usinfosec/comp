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
import { Label } from "@bubba/ui/label";
import { formatDate } from "@/utils/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bubba/ui/tabs";

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

  console.log({ employee });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        {employee.name} ({employee.isActive ? "Active" : "Inactive"})
      </h1>

      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <p>{employee.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Email</Label>
              <p>{employee.email}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Join Date</Label>
              <p>
                {formatDate(employee.createdAt.toISOString(), "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Department</Label>
              <p>{employee.department}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="trainings">Trainings</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Tasks</Label>
              <p>{tasks.length}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <Label>Documents</Label>
          </div>
        </TabsContent>

        <TabsContent value="trainings">
          <div className="space-y-6">
            <Label>Trainings</Label>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
