"use client";

import type { OrganizationIntegrations } from "@bubba/db";
import { integrations } from "@bubba/integrations";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@bubba/ui/accordion";
import { Button } from "@bubba/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { IntegrationsCard } from "./integrations-card";

export function OrganizationIntegration({
  installed,
}: {
  installed: OrganizationIntegrations[];
}) {
  const searchParams = useSearchParams();
  const isInstalledPage = searchParams.get("tab") === "installed";
  const search = searchParams.get("q");
  const router = useRouter();
  const installedIntegrations = installed.map((i) => i.name.toLowerCase());

  const installedSettings: Record<string, unknown> = installed.reduce(
    (acc, integration) => {
      acc[integration.name.toLowerCase()] = integration.user_settings;
      return acc;
    },
    {} as Record<string, unknown>,
  );

  const integrationsByCategory = integrations
    .filter(
      (integration) =>
        !isInstalledPage || installedIntegrations.includes(integration.id),
    )
    .filter(
      (integration) =>
        !search ||
        integration.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((integration) => integration.settings)
    .reduce(
      (acc, integration) => {
        const category = integration.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(integration);
        return acc;
      },
      {} as Record<string, typeof integrations>,
    );

  if (search && Object.keys(integrationsByCategory).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
        <h3 className="text-lg font-semibold text-foreground">
          No integrations found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
          No integrations found for your search, let us know if you want to see
          a specific integration.
        </p>

        <Button
          onClick={() => router.push("/integrations")}
          className="mt-4"
          variant="outline"
        >
          Clear search
        </Button>
      </div>
    );
  }

  if (!search && Object.keys(integrationsByCategory).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-400px)]">
        <h3 className="text-lg font-semibold text-foreground">
          No integrations installed
        </h3>
        <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
          You haven't installed any integrations yet. Go to the 'All
          Integrations' tab to browse available integrations.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-8">
      <Accordion
        type="multiple"
        defaultValue={Object.keys(integrationsByCategory)}
      >
        {Object.entries(integrationsByCategory).map(
          ([category, integrations]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="text-lg font-semibold">
                {category}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {integrations.map((integration) => (
                    <IntegrationsCard
                      key={integration.id}
                      {...integration}
                      images={integration.images.map((img) => img.src)}
                      installed={installedIntegrations.includes(
                        integration.id.toLowerCase(),
                      )}
                      settings={integration.settings}
                      category={integration.category}
                      installedSettings={
                        installedSettings[integration.id.toLowerCase()] || {}
                      }
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
    </div>
  );
}
