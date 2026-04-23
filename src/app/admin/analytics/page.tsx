import { getAnalytics } from "@/lib/data";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  const events = getAnalytics();
  return <AnalyticsDashboard events={events} />;
}
