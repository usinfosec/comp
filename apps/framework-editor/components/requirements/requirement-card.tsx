"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import type { Requirement } from "@/lib/types"

interface RequirementCardProps {
  id: string
  data: Requirement
  mappedControlsCount: number
  onEdit: () => void
  onDelete: () => void
}

export default function RequirementCard({ id, data, mappedControlsCount, onEdit, onDelete }: RequirementCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{data.name}</CardTitle>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs font-mono">{id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{data.description}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {mappedControlsCount > 0 && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            {mappedControlsCount} {mappedControlsCount === 1 ? "control" : "controls"}
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}
