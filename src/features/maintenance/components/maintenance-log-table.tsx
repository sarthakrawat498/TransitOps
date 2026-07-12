import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/features/maintenance/components/formatters";
import { MaintenanceStatusBadge } from "@/features/maintenance/components/maintenance-status-badge";
import type { MaintenanceLogItem } from "@/features/maintenance/types";

export function MaintenanceLogTable({ logs }: { logs: MaintenanceLogItem[] }) {
  return (
    <section className="space-y-3" aria-labelledby="service-log-heading">
      <h2
        id="service-log-heading"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Service Log
      </h2>
      <div className="overflow-hidden border-y border-white/15 bg-[#101010]/70">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Vehicle
              </TableHead>
              <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Service
              </TableHead>
              <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Cost
              </TableHead>
              <TableHead className="h-9 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/5">
                  <TableCell className="py-2 font-semibold">{log.vehicle}</TableCell>
                  <TableCell className="max-w-72 truncate py-2 text-muted-foreground">
                    {log.service}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    {formatNumber(log.cost)}
                  </TableCell>
                  <TableCell className="py-2">
                    <MaintenanceStatusBadge status={log.status} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                  No service logs yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
