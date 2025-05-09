"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { exportToZip } from "@/lib/export-utils"
import { useAppData } from "@/app/contexts/AppDataContext"

// Import manager components
import FrameworksRequirementsManager from "@/components/frameworks-requirements/frameworks-requirements-manager"
import ControlsManager from "@/components/controls/controls-manager"
import PoliciesManager from "@/components/policies/policies-manager"
import TasksManager from "@/components/tasks/tasks-manager"

export default function ComplianceAdmin() {
  const { toast } = useToast()
  const { isLoading, appData } = useAppData()

  const handleExport = async () => {
    if (isLoading || !appData.frameworks) {
      toast({
        title: "Cannot Export Yet",
        description: "Data is still loading or not available.",
        variant: "destructive",
      })
      return;
    }
    try {
      await exportToZip()
      toast({
        title: "Export Successful",
        description: "Your compliance data has been exported as a ZIP file.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
      console.error("Export error:", error)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading App Data...</div>
  }

  if (!appData.frameworks || !appData.policies) {
     return <div className="flex items-center justify-center h-screen">App data could not be loaded.</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compliance Management Dashboard</h1>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="frameworks" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks">
          <FrameworksRequirementsManager />
        </TabsContent>

        <TabsContent value="controls">
          <ControlsManager />
        </TabsContent>

        <TabsContent value="policies">
          <PoliciesManager />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
