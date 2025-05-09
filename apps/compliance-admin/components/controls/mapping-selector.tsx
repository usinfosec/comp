"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, X } from "lucide-react"

interface MappingSelectorProps {
  title: string
  selectedValue: string
  onValueChange: (value: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  options: { id: string; name: string }[]
  selectedItems: { id: string; name: string }[]
  disabled?: boolean
}

export default function MappingSelector({
  title,
  selectedValue,
  onValueChange,
  onAdd,
  onRemove,
  options,
  selectedItems,
  disabled = false,
}: MappingSelectorProps) {
  return (
    <div className="grid gap-2">
      <Label>{title}</Label>
      <div className="flex gap-2">
        <Select value={selectedValue} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder={`Select ${title}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" variant="outline" size="icon" onClick={onAdd} disabled={disabled || !selectedValue}>
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedItems.map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item.name}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1"
              onClick={() => onRemove(item.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
