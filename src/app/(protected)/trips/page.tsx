import { RequireAccess } from "@/components/layout/require-access";
import { TripsPage } from "@/features/trips/components/trips-page";

export default function ProtectedTripsPage() {
  return (
    <RequireAccess module="trips" moduleLabel="Trips">
      <TripsPage />
    </RequireAccess>
  );
}
