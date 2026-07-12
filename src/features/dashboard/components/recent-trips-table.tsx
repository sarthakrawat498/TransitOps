import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentTrip, TripStatus } from "@/features/dashboard/types";
import { cn } from "@/lib/utils";

const statusClassNames: Record<TripStatus, string> = {
  Draft: "border-slate-400/40 bg-slate-400/20 text-slate-100",
  Dispatched: "border-sky-400/40 bg-sky-400/20 text-sky-100",
  Completed: "border-lime-500/40 bg-lime-500/25 text-lime-100",
  Cancelled: "border-rose-500/40 bg-rose-500/20 text-rose-100",
};

export function RecentTripsTable({ trips }: { trips: RecentTrip[] }) {
  return (
    <section className="space-y-3" aria-labelledby="recent-trips-heading">
      <h2
        id="recent-trips-heading"
        className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        Recent Trips
      </h2>
      <div className="rounded-lg border border-white/10 bg-card/30">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Trip
              </TableHead>
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Vehicle
              </TableHead>
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Route
              </TableHead>
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Driver
              </TableHead>
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-8 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Timeline
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id} className="border-white/5 text-sm hover:bg-white/5">
                <TableCell className="py-2 font-medium text-foreground">{trip.id}</TableCell>
                <TableCell className="py-2">{trip.vehicle}</TableCell>
                <TableCell className="py-2 text-muted-foreground">{trip.route}</TableCell>
                <TableCell className="py-2">{trip.driver}</TableCell>
                <TableCell className="py-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-6 min-w-24 justify-center rounded-md text-xs font-medium",
                      statusClassNames[trip.status],
                    )}
                  >
                    {trip.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-2 text-muted-foreground">{trip.timeline}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
