"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Control } from "@/lib/types"

interface ControlCardProps {
  id: string
  control: Control
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  getRequirementName: (frameworkId: string, requirementId: string) => string
  getPolicyName: (policyId: string) => string
  getTaskName: (taskId: string) => string
}

export default function ControlCard({
  id,
  control,
  onEdit,
  onDelete,
  getRequirementName,
  getPolicyName,
  getTaskName,
}: ControlCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{control.name}</CardTitle>
        <CardDescription className="line-clamp-2">{control.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {control.mappedRequirements.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Requirements:</h4>
            <div className="flex flex-wrap gap-2">
              {control.mappedRequirements.map((req, index) => (
                <Badge key={index} variant="outline">
                  {req.frameworkId}:{req.requirementId}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {control.mappedArtifacts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Policies:</h4>
            <div className="flex flex-wrap gap-2">
              {control.mappedArtifacts
                .filter((artifact) => artifact.type === "policy")
                .map((artifact, index) => (
                  <Badge key={index} variant="outline">
                    {getPolicyName(artifact.policyId)}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {control.mappedTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Tasks:</h4>
            <div className="flex flex-wrap gap-2">
              {control.mappedTasks.map((task, index) => (
                <Badge key={index} variant="outline">
                  {getTaskName(task.taskId)}
                </Badge>
              ))}
            </div>
          </div>
        )}
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
