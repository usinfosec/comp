"use client";

import { useOrganizationControl } from "../hooks/useOrganizationControl";

interface SingleControlProps {
  controlId: string;
}

export const SingleControl = ({ controlId }: SingleControlProps) => {
  const { data: control } = useOrganizationControl(controlId);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold">{control?.control.name}</h1>
      <p className="text-sm text-muted-foreground">
        {control?.control.description}
      </p>
    </div>
  );
};
