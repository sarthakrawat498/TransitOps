import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  formatLiters,
  formatNumber,
} from "@/features/fuel-expenses/components/formatters";
import type { FuelExpenseFuelLog } from "@/features/fuel-expenses/types";

export function FuelLogsTable({ rows }: { rows: FuelExpenseFuelLog[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10 hover:bg-transparent">
          <TableHead className="h-9 w-[28%] text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Vehicle
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Date
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Trip
          </TableHead>
          <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Liters
          </TableHead>
          <TableHead className="h-9 text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Cost
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.id} className="border-white/5 hover:bg-white/5">
              <TableCell className="py-2 font-semibold">{row.vehicle}</TableCell>
              <TableCell className="py-2 text-muted-foreground">
                {formatDate(row.logDate)}
              </TableCell>
              <TableCell className="max-w-56 truncate py-2 text-muted-foreground">
                {row.trip ?? "-"}
              </TableCell>
              <TableCell className="py-2 text-muted-foreground">
                {formatLiters(row.liters)}
              </TableCell>
              <TableCell className="py-2 text-right font-semibold">
                {formatNumber(row.cost)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
              No fuel logs yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
