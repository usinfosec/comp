import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comp/ui/select";
import { StatusIndicator } from "@/components/status-indicator";
import { PolicyStatus } from "@comp/db/types";
import React from "react";

interface StatusFieldProps {
  value: PolicyStatus;
  onChange: (value: PolicyStatus) => void;
  disabled?: boolean;
}

export function StatusField({ value, onChange, disabled }: StatusFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="status" className="text-sm font-medium">
        Status
      </label>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="status"
        id="status"
        value={value}
      />
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(val) => onChange(val as PolicyStatus)}
      >
        <SelectTrigger value={value}>
          <SelectValue placeholder="Select status">
            <StatusIndicator status={value} />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(PolicyStatus).map((statusOption) => (
            <SelectItem key={statusOption} value={statusOption}>
              <StatusIndicator status={statusOption} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
