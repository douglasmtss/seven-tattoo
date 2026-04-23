import { getSettings } from "@/lib/data";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const settings = getSettings();
  return <SettingsForm initialSettings={settings} />;
}
