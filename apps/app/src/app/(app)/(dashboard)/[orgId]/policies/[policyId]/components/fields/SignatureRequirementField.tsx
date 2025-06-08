import { Switch } from "@comp/ui/switch";
import React from "react";

interface SignatureRequirementFieldProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SignatureRequirementField({ value, onChange, disabled }: SignatureRequirementFieldProps) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <label htmlFor="isRequiredToSign" className="text-sm font-medium">
        Employee Signature Requirement
      </label>
      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="isRequiredToSign"
          name="isRequiredToSign"
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
        />
        <span className="text-sm text-gray-500">
          {value ? "Required" : "Not Required"}
        </span>
      </div>
    </div>
  );
}
