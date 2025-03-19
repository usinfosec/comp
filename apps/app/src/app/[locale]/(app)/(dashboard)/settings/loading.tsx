import { SettingsFallback } from "@/components/loaders/settings-fallback";

export default function Loading() {
  return (
    <div className="space-y-12">
      <SettingsFallback />
    </div>
  );
}
