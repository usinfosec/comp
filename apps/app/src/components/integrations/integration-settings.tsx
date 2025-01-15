import { updateIntegrationSettingsAction } from "@/actions/integrations/update-integration-settings-action";
import { Button } from "@bubba/ui/button";
import { Input } from "@bubba/ui/input";
import { Label } from "@bubba/ui/label";
import { Switch } from "@bubba/ui/switch";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

export type IntegrationSettingsItem = {
  id: string;
  label: string;
  description: string;
  type: "switch" | "text" | "select";
  required: boolean;
  value: string | boolean;
  isSet?: boolean;
};

function IntegrationSettingsItem({
  setting,
  integrationId,
  onSettingChange,
  installedSettings,
}: {
  setting: IntegrationSettingsItem;
  integrationId: string;
  installedSettings: Record<string, any>;
  onSettingChange: (id: string, value: string | boolean) => void;
}) {
  switch (setting.type) {
    case "switch":
      return (
        <div className="flex items-center justify-between">
          <div className="pr-4 space-y-1">
            <Label className="text-muted-foreground">{setting.label}</Label>
            <p className="text-xs text-muted-foreground">
              {setting.description}
            </p>
          </div>
          <Switch
            checked={Boolean(setting.value)}
            onCheckedChange={(checked) => {
              onSettingChange(setting.id, Boolean(checked));
            }}
          />
        </div>
      );
    case "text":
      return (
        <div className="flex flex-col gap-2 justify-between">
          <div className="pr-4 space-y-1">
            <Label className="text-muted-foreground flex items-center gap-1">
              {setting.label}
            </Label>
            <p className="text-xs text-muted-foreground">
              {setting.description}
            </p>
          </div>
          <Input
            type={installedSettings[setting.id] ? "password" : "text"}
            value={setting.value as string}
            placeholder={installedSettings[setting.id] ? "••••••••" : ""}
            onChange={(e) => {
              onSettingChange(setting.id, e.target.value);
            }}
          />
        </div>
      );
    default:
      return null;
  }
}

export function IntegrationSettings({
  settings,
  integrationId,
  installedSettings,
}: {
  settings?: IntegrationSettingsItem[];
  integrationId: string;
  installedSettings: Record<string, any>;
}) {
  const updateIntegrationSettings = useAction(updateIntegrationSettingsAction, {
    onSuccess: () => {
      toast.success("Settings updated");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (id: string, value: string | boolean) => {
    setLocalSettings((prevSettings) =>
      prevSettings?.map((setting) =>
        setting.id === id ? { ...setting, value } : setting,
      ),
    );
  };

  const handleSave = () => {
    if (!localSettings) {
      return;
    }

    for (const setting of localSettings) {
      updateIntegrationSettings.execute({
        integration_id: integrationId,
        option: { id: setting.id, value: setting.value },
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {localSettings?.map((setting) => (
        <div key={setting.id}>
          <IntegrationSettingsItem
            setting={setting}
            integrationId={integrationId}
            installedSettings={installedSettings}
            onSettingChange={handleSettingChange}
          />
        </div>
      ))}

      {settings && settings.length > 0 && (
        <Button
          onClick={handleSave}
          disabled={updateIntegrationSettings.isPending}
        >
          {updateIntegrationSettings.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save settings"
          )}
        </Button>
      )}
    </div>
  );
}
