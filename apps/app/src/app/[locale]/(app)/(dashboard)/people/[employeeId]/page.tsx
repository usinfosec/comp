import { auth } from "@/auth";
import {
  type Employee,
  type EmployeeTask,
  type EmployeeRequiredTask,
  type EmployeeTaskStatus,
  db,
} from "@bubba/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@bubba/ui/card";
import { Progress } from "@bubba/ui/progress";
import { getI18n } from "@/locales/server";
import { cn } from "@bubba/ui/cn";

interface PageProps {
  params: Promise<{
    employeeId: string;
  }>;
}

interface EmployeeWithTasks extends Employee {
  employeeTasks?: (EmployeeTask & {
    requiredTask: EmployeeRequiredTask;
  })[];
}

export default async function EmployeeDetailsPage({ params }: PageProps) {
  const session = await auth();
  const t = await getI18n();
  const { employeeId } = await params;
  const organizationId = session?.user.organizationId;

  if (!organizationId) {
    return redirect("/");
  }

  try {
    const employee = (await db.employee.findUnique({
      where: {
        id: employeeId,
        organizationId,
        isActive: true,
      },
      include: {
        employeeTasks: true,
      },
    })) as EmployeeWithTasks | null;

    console.log({ employee });

    if (!employee) {
      return redirect("/people");
    }

    const tasks = employee.employeeTasks ?? [];
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
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
                {tasks.map((task) => (
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
  } catch (error) {
    console.error("Error loading employee details:", error);
    return redirect("/people");
  }
}
