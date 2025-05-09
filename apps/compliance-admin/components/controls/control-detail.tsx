"use client"

import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit } from "lucide-react"
import type { Control, Framework, Requirement, TemplatePolicy, Task } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ControlDetailProps {
  control: Control
  frameworks: Record<string, Framework>
  requirements: Record<string, Record<string, Requirement>>
  policies: Record<string, TemplatePolicy>
  tasks: Record<string, Task>
  getRequirementName: (frameworkId: string, requirementId: string) => string
  getPolicyName: (policyId: string) => string
  getTaskName: (taskId: string) => string
  onEdit: () => void
  onClose: () => void
}

export default function ControlDetail({
  control,
  frameworks,
  requirements,
  policies,
  tasks,
  getRequirementName,
  getPolicyName,
  getTaskName,
  onEdit,
  onClose,
}: ControlDetailProps) {
  const requirementsCount = control.mappedRequirements.length
  const policiesCount = control.mappedArtifacts.filter((a) => a.type === "policy").length
  const tasksCount = control.mappedTasks.length

  return (
    <>
      <DialogHeader>
        <div className="flex justify-between items-start">
          <div>
            <DialogTitle className="text-xl">{control.name}</DialogTitle>
            <DialogDescription className="mt-1">
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">{control.id}</span>
            </DialogDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={onEdit}>
            <Edit className="h-3 w-3" />
            Edit
          </Button>
        </div>
      </DialogHeader>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-1">Description</h3>
        <p className="text-sm text-muted-foreground">{control.description || "No description provided."}</p>
      </div>

      <Tabs defaultValue="requirements" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requirements" className="flex items-center gap-2">
            Requirements
            {requirementsCount > 0 && (
              <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 hover:bg-blue-50 rounded-full">
                {requirementsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            Policies
            {policiesCount > 0 && (
              <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 hover:bg-green-50 rounded-full">
                {policiesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            Tasks
            {tasksCount > 0 && (
              <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700 hover:bg-amber-50 rounded-full">
                {tasksCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-4">
          {requirementsCount > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Framework</TableHead>
                    <TableHead>Requirement ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {control.mappedRequirements.map((req, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {frameworks[req.frameworkId]?.name || req.frameworkId}
                      </TableCell>
                      <TableCell>{req.requirementId}</TableCell>
                      <TableCell>{getRequirementName(req.frameworkId, req.requirementId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No requirements mapped to this control.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          {policiesCount > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {control.mappedArtifacts
                    .filter((artifact) => artifact.type === "policy")
                    .map((artifact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{artifact.policyId}</TableCell>
                        <TableCell>{getPolicyName(artifact.policyId)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No policies mapped to this control.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {tasksCount > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {control.mappedTasks.map((task, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{task.taskId}</TableCell>
                      <TableCell>{getTaskName(task.taskId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No tasks mapped to this control.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  )
}
