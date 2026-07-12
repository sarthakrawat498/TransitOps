import { NextResponse } from "next/server";

import * as tripsService from "@/server/modules/trips/trips.service";
import {
  createTripSchema,
  tripIdParamSchema,
  tripListQuerySchema,
  updateTripSchema,
} from "@/server/modules/trips/trips.validators";
import { authorizeRead, authorizeWrite } from "@/server/shared/middleware/rbac";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

interface RouteContext {
  params?: Promise<{ tripId?: string }> | { tripId?: string };
}

function getSearchParam(request: Request, key: string): string | undefined {
  return new URL(request.url).searchParams.get(key) ?? undefined;
}

async function getTripIdFromContext(context?: unknown): Promise<string> {
  const params = await (context as RouteContext | undefined)?.params;
  return tripIdParamSchema.parse(params?.tripId);
}

export async function handleListTrips(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "trips");

  const filters = tripListQuerySchema.parse({
    status: getSearchParam(request, "status"),
    vehicleId: getSearchParam(request, "vehicleId"),
    driverId: getSearchParam(request, "driverId"),
    source: getSearchParam(request, "source"),
    destination: getSearchParam(request, "destination"),
    page: getSearchParam(request, "page"),
    pageSize: getSearchParam(request, "pageSize"),
  });
  const result = await tripsService.listTrips(filters);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trips fetched successfully",
      data: { trips: result.trips },
      meta: result.pagination,
      requestId,
    }),
  );
}

export async function handleCreateTrip(request: Request) {
  const requestId = createRequestId();
  const authUser = await authorizeWrite(request, "trips");
  const input = createTripSchema.parse(await request.json());
  const trip = await tripsService.createTrip({ ...input, createdById: authUser.id });

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip created successfully",
      data: { trip },
      requestId,
    }),
    { status: 201 },
  );
}

export async function handleCreateAndDispatchTrip(request: Request) {
  const requestId = createRequestId();
  const authUser = await authorizeWrite(request, "trips");
  const input = createTripSchema.parse(await request.json());
  const trip = await tripsService.createAndDispatchTrip({ ...input, createdById: authUser.id });

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip dispatched successfully",
      data: { trip },
      requestId,
    }),
    { status: 201 },
  );
}

export async function handleGetTrip(request: Request, context?: unknown) {
  const requestId = createRequestId();
  await authorizeRead(request, "trips");
  const tripId = await getTripIdFromContext(context);
  const trip = await tripsService.getTrip(tripId);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip fetched successfully",
      data: { trip },
      requestId,
    }),
  );
}

export async function handleUpdateTrip(request: Request, context?: unknown) {
  const requestId = createRequestId();
  await authorizeWrite(request, "trips");
  const tripId = await getTripIdFromContext(context);
  const input = updateTripSchema.parse(await request.json());
  const trip = await tripsService.updateTrip(tripId, input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip updated successfully",
      data: { trip },
      requestId,
    }),
  );
}

export async function handleDeleteTrip(request: Request, context?: unknown) {
  const requestId = createRequestId();
  await authorizeWrite(request, "trips");
  const tripId = await getTripIdFromContext(context);
  const trip = await tripsService.deleteTrip(tripId);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip deleted successfully",
      data: { trip },
      requestId,
    }),
  );
}

export async function handleDispatchTrip(request: Request, context?: unknown) {
  const requestId = createRequestId();
  await authorizeWrite(request, "trips");
  const tripId = await getTripIdFromContext(context);
  const trip = await tripsService.dispatchTrip(tripId);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip dispatched successfully",
      data: { trip },
      requestId,
    }),
  );
}

export async function handleCancelTrip(request: Request, context?: unknown) {
  const requestId = createRequestId();
  await authorizeWrite(request, "trips");
  const tripId = await getTripIdFromContext(context);
  const trip = await tripsService.cancelTrip(tripId);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip cancelled successfully",
      data: { trip },
      requestId,
    }),
  );
}

export async function handleGetTripOptions(request: Request) {
  const requestId = createRequestId();
  await authorizeWrite(request, "trips");
  const options = await tripsService.getOptions();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Trip options fetched successfully",
      data: options,
      requestId,
    }),
  );
}
