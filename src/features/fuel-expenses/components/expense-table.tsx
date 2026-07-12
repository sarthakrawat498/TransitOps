import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatNumber } from "@/features/fuel-expenses/components/formatters";
import type { FuelExpenseExpense } from "@/features/fuel-expenses/types";

function getTollAmount(row: FuelExpenseExpense): number {
  return row.category === "TOLL" ? row.amount : 0;
}

function getMaintenanceAmount(row: FuelExpenseExpense): number {
  return row.category === "MAINTENANCE" ? row.amount : 0;
}

function getOtherAmount(row: FuelExpenseExpense): number {
  return row.category !== "TOLL" && row.category !== "MAINTENANCE" ? row.amount : 0;
}

export function ExpenseTable({ rows }: { rows: FuelExpenseExpense[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10 hover:bg-transparent">
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Date
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Vehicle
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Toll
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Other
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Maintenance (Linked)
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Total
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.id} className="border-white/5 hover:bg-white/5">
              <TableCell className="py-2 text-muted-foreground">
                {formatDate(row.expenseDate)}
              </TableCell>
              <TableCell className="py-2 font-semibold">{row.vehicle}</TableCell>
              <TableCell className="py-2 text-muted-foreground">
                {formatNumber(getTollAmount(row))}
              </TableCell>
              <TableCell className="py-2 text-muted-foreground">
                {formatNumber(getOtherAmount(row))}
              </TableCell>
              <TableCell className="py-2 text-muted-foreground">
                {formatNumber(getMaintenanceAmount(row))}
              </TableCell>
              <TableCell className="max-w-80 truncate py-2 text-muted-foreground">
                {formatNumber(row.amount)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableCell colSpan={6} className="py-6 text-center text-muted-foreground">
              No expenses yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
