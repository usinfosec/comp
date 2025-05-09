"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import type { Framework } from "@/lib/types"

interface FrameworkCardProps {
  id: string
  framework: Framework
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function FrameworkCard({ id, framework, onEdit, onDelete }: FrameworkCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{framework.name}</CardTitle>
        <CardDescription>Version: {framework.version}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{framework.description}</p>
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
