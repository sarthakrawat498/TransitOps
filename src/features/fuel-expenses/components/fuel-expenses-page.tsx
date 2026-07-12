"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddExpenseDialog } from "@/features/fuel-expenses/components/add-expense-dialog";
import { ExpenseTable } from "@/features/fuel-expenses/components/expense-table";
import { FuelExpensesSection } from "@/features/fuel-expenses/components/fuel-expenses-section";
import { FuelLogsTable } from "@/features/fuel-expenses/components/fuel-logs-table";
import { LogFuelDialog } from "@/features/fuel-expenses/components/log-fuel-dialog";
import { OperationalCostSummary } from "@/features/fuel-expenses/components/operational-cost-summary";
import { useFuelExpenses } from "@/features/fuel-expenses/hooks/use-fuel-expenses";

export function FuelExpensesPage() {
  const fuelExpensesQuery = useFuelExpenses();

  if (fuelExpensesQuery.isError) {
    return <FuelExpensesErrorState onRetry={() => void fuelExpensesQuery.refetch()} />;
  }

  const overview = fuelExpensesQuery.data;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Fuel & Expense Management
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Fuel & Expenses</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <LogFuelDialog vehicles={overview?.vehicles ?? []} trips={overview?.trips ?? []} />
          <AddExpenseDialog vehicles={overview?.vehicles ?? []} />
        </div>
      </div>

      <div className="min-h-[32rem] rounded-sm border border-white/15 bg-[#0f0f0f] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        {fuelExpensesQuery.isLoading || !overview ? (
          <FuelExpensesSkeleton />
        ) : (
          <>
            <FuelExpensesSection title="Fuel Logs">
              <FuelLogsTable rows={overview.fuelLogs} />
            </FuelExpensesSection>

            <FuelExpensesSection title="Other Expenses (Toll / Misc)" className="mt-6">
              <ExpenseTable rows={overview.expenses} />
            </FuelExpensesSection>

            <OperationalCostSummary total={overview.summary.totalOperationalCost} />
          </>
        )}
      </div>
    </div>
  );
}

function FuelExpensesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 rounded-none bg-white/10" />
      <Skeleton className="h-40 rounded-none bg-white/10" />
    </div>
  );
}

function FuelExpensesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[24rem] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-xl border border-white/10 bg-card/70 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">Fuel and expenses unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The fuel and expense API did not return the expected data. Check the backend, then try
          again.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
