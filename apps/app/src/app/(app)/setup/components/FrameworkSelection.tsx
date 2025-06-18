'use client';

import { FrameworkCard } from '@/components/framework-card';
import type { FrameworkEditorFramework } from '@comp/db/types';
import { Skeleton } from '@comp/ui/skeleton';
import { useEffect, useState } from 'react';

interface FrameworkSelectionProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function FrameworkSelection({ value, onChange }: FrameworkSelectionProps) {
  const [frameworks, setFrameworks] = useState<
    Pick<FrameworkEditorFramework, 'id' | 'name' | 'description' | 'version' | 'visible'>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFrameworks() {
      try {
        const response = await fetch('/api/frameworks');
        if (!response.ok) throw new Error('Failed to fetch frameworks');
        const data = await response.json();
        setFrameworks(data.frameworks);
      } catch (error) {
        console.error('Error fetching frameworks:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFrameworks();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
      {frameworks
        .filter((framework) => framework.visible)
        .map((framework) => (
          <FrameworkCard
            key={framework.id}
            framework={framework}
            isSelected={value.includes(framework.id)}
            onSelectionChange={(checked) => {
              onChange(
                checked ? [...value, framework.id] : value.filter((id) => id !== framework.id),
              );
            }}
          />
        ))}
    </div>
  );
}
