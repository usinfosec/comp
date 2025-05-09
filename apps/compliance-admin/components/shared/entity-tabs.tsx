"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface EntityTabsProps {
  detailsContent: React.ReactNode
  mappingsContent: React.ReactNode
  mappedControlsCount: number
  entityType: "policy" | "task" | "requirement"
}

export default function EntityTabs({
  detailsContent,
  mappingsContent,
  mappedControlsCount,
  entityType,
}: EntityTabsProps) {
  const [activeTab, setActiveTab] = useState("details")

  // Get badge color based on entity type
  const getBadgeColor = () => {
    if (entityType === "policy") return "bg-green-50 text-green-700"
    if (entityType === "task") return "bg-amber-50 text-amber-700"
    return "bg-blue-50 text-blue-700" // For requirements
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="mappings" className="flex items-center justify-center gap-2">
          Control Mappings
          {mappedControlsCount > 0 && (
            <Badge variant="outline" className={`${getBadgeColor()} rounded-full`}>
              {mappedControlsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">{detailsContent}</TabsContent>
      <TabsContent value="mappings">{mappingsContent}</TabsContent>
    </Tabs>
  )
}
