import { formatNumber } from "@/features/fuel-expenses/components/formatters";

interface OperationalCostSummaryProps {
  total: number;
}

export function OperationalCostSummary({ total }: OperationalCostSummaryProps) {
  return (
    <div className="flex items-center border-t-2 border-white/80 py-2 text-sm font-semibold uppercase tracking-[0.12em]">
      <span>Total Operational Cost (Auto) = Fuel + Maintenance + Expenses</span>
      <span className="ml-auto text-lg font-bold tracking-normal text-orange-400">
        {formatNumber(total)}
      </span>
    </div>
  );
}
