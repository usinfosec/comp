'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FrameworkEditorTaskTemplate } from '@prisma/client';
import PageLayout from "@/app/components/PageLayout"; 
import { DataTable } from '@/app/components/DataTable';
import { Button } from '@comp/ui/button';
import { PlusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@comp/ui/card";

import { getColumns } from './components/columns';
import { CreateTaskDialog } from './components/CreateTaskDialog';
import { EditTaskDialog } from './components/EditTaskDialog';
import { DeleteTaskDialog } from './components/DeleteTaskDialog';

interface TasksClientPageProps {
  initialTasks: FrameworkEditorTaskTemplate[];
}

export function TasksClientPage({ initialTasks }: TasksClientPageProps) {
  const router = useRouter();
  const [tasks, setTasks] = React.useState(initialTasks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<FrameworkEditorTaskTemplate | null>(null);
  const [deletingTask, setDeletingTask] = React.useState<FrameworkEditorTaskTemplate | null>(null);

  const handleTaskCreated = (newTask: FrameworkEditorTaskTemplate) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Pick<FrameworkEditorTaskTemplate, 'id' | 'name' | 'description' | 'frequency' | 'department'>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const handleRowClick = (task: FrameworkEditorTaskTemplate) => {
    router.push(`/tasks/${task.id}`);
  };

  const handleEditClick = (e: React.MouseEvent, task: FrameworkEditorTaskTemplate) => {
    e.stopPropagation();
    setEditingTask(task);
  };

  const handleDeleteClick = (e: React.MouseEvent, task: FrameworkEditorTaskTemplate) => {
    e.stopPropagation();
    setDeletingTask(task);
  };

  return (
    <PageLayout breadcrumbs={[{ label: "Tasks", href: "/tasks" }]}>
      <DataTable
        columns={getColumns({
          onEditClick: handleEditClick,
          onDeleteClick: handleDeleteClick,
        })}
        data={tasks}
        onRowClick={handleRowClick}
        searchQueryParamName="tasks-search"
        searchPlaceholder="Search tasks..."
        createButtonLabel="Create Task"
        onCreateClick={() => setIsCreateDialogOpen(true)}
      />

      <CreateTaskDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTaskCreated={handleTaskCreated}
      />

      {editingTask && (
        <EditTaskDialog
          isOpen={!!editingTask}
          onOpenChange={(isOpen) => !isOpen && setEditingTask(null)}
          task={editingTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {deletingTask && (
        <DeleteTaskDialog
          isOpen={!!deletingTask}
          onOpenChange={(isOpen) => !isOpen && setDeletingTask(null)}
          task={deletingTask}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </PageLayout>
  );
} 