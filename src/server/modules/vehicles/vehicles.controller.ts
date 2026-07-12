import { NextResponse } from "next/server";

import * as vehiclesService from "./vehicles.service";
import {
  createVehicleSchema,
  updateVehicleSchema,
  listVehiclesSchema,
} from "./vehicles.validators";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

export async function handleListVehicles(request: Request) {
  const requestId = createRequestId();
  const { searchParams } = new URL(request.url);

  const input = listVehiclesSchema.parse({
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    region: searchParams.get("region") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });

  const result = await vehiclesService.listVehicles(input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Vehicles fetched successfully",
      data: result,
      requestId,
    })
  );
}

export async function handleGetVehicle(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId();
  const { id } = await context.params;

  const vehicle = await vehiclesService.getVehicle(id);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Vehicle fetched successfully",
      data: { vehicle },
      requestId,
    })
  );
}

export async function handleCreateVehicle(request: Request) {
  const requestId = createRequestId();
  const body = await request.json();
  const input = createVehicleSchema.parse(body);

  const vehicle = await vehiclesService.createVehicle(input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Vehicle created successfully",
      data: { vehicle },
      requestId,
    }),
    { status: 201 }
  );
}

export async function handleUpdateVehicle(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId();
  const { id } = await context.params;
  const body = await request.json();
  const input = updateVehicleSchema.parse(body);

  const vehicle = await vehiclesService.updateVehicle(id, input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Vehicle updated successfully",
      data: { vehicle },
      requestId,
    })
  );
}

export async function handleDeleteVehicle(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId();
  const { id } = await context.params;

  await vehiclesService.deleteVehicle(id);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Vehicle deleted successfully",
      requestId,
    })
  );
}

export async function handleGetAvailableVehicles() {
  const requestId = createRequestId();

  const vehicles = await vehiclesService.getAvailableVehicles();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Available vehicles fetched successfully",
      data: { vehicles },
      requestId,
    })
  );
}
