"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UpdateTripInput } from "@/features/trips/schemas";
import { TripEditDialog } from "@/features/trips/components/trip-edit-dialog";
import type { TripBoardItem, TripOptions } from "@/features/trips/types";
import { cn } from "@/lib/utils";

const statusClassNames = {
  muted: "border-slate-400/40 bg-slate-400/20 text-slate-100",
  info: "border-sky-400/40 bg-sky-400/20 text-sky-100",
  success: "border-lime-500/40 bg-lime-500/25 text-lime-100",
  danger: "border-rose-500/40 bg-rose-500/20 text-rose-100",
};

export function TripLiveBoard({
  trips,
  options,
  isLoading,
  isActionPending,
  onCancel,
  onDelete,
  onDispatch,
  onUpdate,
}: {
  trips: TripBoardItem[];
  options?: TripOptions;
  isLoading: boolean;
  isActionPending: boolean;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDispatch: (id: string) => Promise<void>;
  onUpdate: (id: string, input: UpdateTripInput) => Promise<void>;
}) {
  return (
    <section className="space-y-3" aria-labelledby="live-board-heading">
      <h2
        id="live-board-heading"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        Live Board
      </h2>

      <div className="space-y-3">
        {isLoading ? (
          <TripLiveBoardSkeleton />
        ) : trips.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/15 bg-card/30 p-6 text-sm text-muted-foreground">
            No trips found. Dispatch a vehicle and driver to start the live board.
          </div>
        ) : (
          trips.map((trip) => (
            <article
              key={trip.id}
              className="rounded-lg border border-dashed border-white/15 bg-card/20 p-4"
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem]">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-sm font-semibold tracking-wide">
                      {trip.displayId}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-6 rounded-md px-3 text-xs",
                        statusClassNames[trip.statusTone],
                      )}
                    >
                      {trip.statusLabel}
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-foreground">{trip.route}</p>
                  <p className="text-xs text-muted-foreground">{trip.primaryMeta}</p>
                </div>

                <div className="space-y-1 text-left text-xs text-muted-foreground lg:text-right">
                  <p>{trip.vehicleLabel}</p>
                  <p>{trip.driverName}</p>
                  <p>{trip.secondaryMeta}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {trip.canDispatch ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isActionPending}
                    onClick={() => void onDispatch(trip.id)}
                  >
                    Dispatch
                  </Button>
                ) : null}
                {trip.canDelete ? (
                  <TripEditDialog
                    item={trip}
                    options={options}
                    isPending={isActionPending}
                    onUpdate={onUpdate}
                  />
                ) : null}
                {trip.canCancel ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={isActionPending}
                    onClick={() => void onCancel(trip.id)}
                  >
                    Cancel
                  </Button>
                ) : null}
                {trip.canDelete ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isActionPending}
                    onClick={() => {
                      if (window.confirm("Delete this draft trip?")) {
                        void onDelete(trip.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        On complete: odometer -&gt; fuel log -&gt; expenses -&gt; vehicle and driver available.
      </p>
    </section>
  );
}

function TripLiveBoardSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-lg bg-white/10" />
      ))}
    </>
  );
}
