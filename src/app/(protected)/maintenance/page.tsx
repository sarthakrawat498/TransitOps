import { RequireAccess } from "@/components/layout/require-access";
import { MaintenancePage } from "@/features/maintenance/components/maintenance-page";

export default function MaintenanceRoute() {
  return (
    <RequireAccess module="maintenance" moduleLabel="Maintenance">
      <MaintenancePage />
    </RequireAccess>
  );
}
