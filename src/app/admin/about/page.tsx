import { getSettings } from "@/lib/data";
import AboutManager from "@/components/admin/AboutManager";

export const dynamic = "force-dynamic";

export default function AdminAboutPage() {
  const settings = getSettings();
  return <AboutManager initialSettings={settings} />;
}
