"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  id: string
  task: Task
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ id, task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{task.frequency}</Badge>
          <Badge variant="outline">{task.department}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-muted/50 p-2">
        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => onEdit(id)}>
          <Edit className="h-3 w-3" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => onDelete(id)}>
          <Trash className="h-3 w-3" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
