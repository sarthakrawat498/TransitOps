"use client";

import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TripDispatchForm } from "@/features/trips/components/trip-dispatch-form";
import { TripLifecycle } from "@/features/trips/components/trip-lifecycle";
import { TripLiveBoard } from "@/features/trips/components/trip-live-board";
import type { CreateTripInput, UpdateTripInput } from "@/features/trips/schemas";
import {
  useCancelTrip,
  useCreateAndDispatchTrip,
  useDeleteTrip,
  useDispatchTrip,
  useTripOptions,
  useTrips,
  useUpdateTrip,
} from "@/features/trips/hooks/use-trips";

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "Trip operation failed. Please try again.";
}

export function TripsPage() {
  const tripsQuery = useTrips({ pageSize: 50 });
  const optionsQuery = useTripOptions();
  const createAndDispatchMutation = useCreateAndDispatchTrip();
  const dispatchMutation = useDispatchTrip();
  const cancelMutation = useCancelTrip();
  const deleteMutation = useDeleteTrip();
  const updateMutation = useUpdateTrip();

  const isActionPending =
    createAndDispatchMutation.isPending ||
    dispatchMutation.isPending ||
    cancelMutation.isPending ||
    deleteMutation.isPending ||
    updateMutation.isPending;

  const handleCreateAndDispatch = async (input: CreateTripInput) => {
    try {
      await createAndDispatchMutation.mutateAsync(input);
      toast.success("Trip dispatched successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDispatch = async (id: string) => {
    try {
      await dispatchMutation.mutateAsync(id);
      toast.success("Trip dispatched successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Trip cancelled successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Draft trip deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdate = async (id: string, input: UpdateTripInput) => {
    try {
      await updateMutation.mutateAsync({ id, input });
      toast.success("Draft trip updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (tripsQuery.isError) {
    return (
      <TripsErrorState
        onRetry={() => {
          void tripsQuery.refetch();
          void optionsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(0,1.55fr)]">
      <h1 className="sr-only">TransitOps trips</h1>

      <div className="space-y-6">
        <TripLifecycle />
        <TripDispatchForm
          options={optionsQuery.data}
          isLoading={optionsQuery.isLoading}
          isPending={createAndDispatchMutation.isPending}
          onDispatch={handleCreateAndDispatch}
        />
      </div>

      <TripLiveBoard
        trips={tripsQuery.data?.trips ?? []}
        options={optionsQuery.data}
        isLoading={tripsQuery.isLoading}
        isActionPending={isActionPending}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onDispatch={handleDispatch}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

function TripsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[24rem] w-full max-w-7xl items-center justify-center">
      <div className="max-w-md rounded-xl border border-white/10 bg-card/70 p-6 text-center">
        <h1 className="font-heading text-2xl font-semibold">Trips unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The trips API did not return the expected data. Check the backend route and try again.
        </p>
        <Button type="button" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}
