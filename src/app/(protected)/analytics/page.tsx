import { RequireAccess } from "@/components/layout/require-access";
import { AnalyticsOverview } from "@/features/analytics/components/analytics-overview";

export default function AnalyticsPage() {
  return (
    <RequireAccess module="analytics" moduleLabel="Analytics">
      <AnalyticsOverview />
    </RequireAccess>
  );
}
