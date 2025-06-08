import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@comp/ui/select";
import { Frequency } from "@comp/db/types";
import React from "react";

interface ReviewFrequencyFieldProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
  disabled?: boolean;
}

export function ReviewFrequencyField({ value, onChange, disabled }: ReviewFrequencyFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="review_frequency" className="text-sm font-medium">
        Review Frequency
      </label>
      <Select
        name="review_frequency"
        value={value}
        disabled={disabled}
        onValueChange={(val) => onChange(val as Frequency)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select review frequency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(Frequency).map((frequency) => (
            <SelectItem key={frequency} value={frequency}>
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
