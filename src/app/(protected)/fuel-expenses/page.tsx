import { RequireAccess } from "@/components/layout/require-access";
import { FuelExpensesPage } from "@/features/fuel-expenses/components/fuel-expenses-page";

export default function FuelExpensesRoute() {
  return (
    <RequireAccess module="fuelAndExpenses" moduleLabel="Fuel & expenses">
      <FuelExpensesPage />
    </RequireAccess>
  );
}
