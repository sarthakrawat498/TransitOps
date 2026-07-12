import { NextResponse } from "next/server";

import * as driversService from "./drivers.service";
import {
  createDriverSchema,
  updateDriverSchema,
  listDriversSchema,
} from "./drivers.validators";
import { authorizeRead, authorizeWrite } from "@/server/shared/middleware/rbac";
import {
  buildSuccessResponse,
  createRequestId,
} from "@/server/shared/responses/response-builder";

export async function handleListDrivers(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "drivers");
  const { searchParams } = new URL(request.url);

  const input = listDriversSchema.parse({
    status: searchParams.get("status") || undefined,
    page: searchParams.get("page") || undefined,
    limit: searchParams.get("limit") || undefined,
  });

  const result = await driversService.listDrivers(input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Drivers fetched successfully",
      data: result,
      requestId,
    }),
  );
}

export async function handleGetDriver(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const requestId = createRequestId();
  await authorizeRead(request, "drivers");
  const { id } = await context.params;

  const driver = await driversService.getDriver(id);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Driver fetched successfully",
      data: { driver },
      requestId,
    }),
  );
}

export async function handleCreateDriver(request: Request) {
  const requestId = createRequestId();
  await authorizeWrite(request, "drivers");
  const body = await request.json();
  const input = createDriverSchema.parse(body);

  const driver = await driversService.createDriver(input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Driver created successfully",
      data: { driver },
      requestId,
    }),
    { status: 201 },
  );
}

export async function handleUpdateDriver(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const requestId = createRequestId();
  await authorizeWrite(request, "drivers");
  const { id } = await context.params;
  const body = await request.json();
  const input = updateDriverSchema.parse(body);

  const driver = await driversService.updateDriver(id, input);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Driver updated successfully",
      data: { driver },
      requestId,
    }),
  );
}

export async function handleDeleteDriver(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const requestId = createRequestId();
  await authorizeWrite(request, "drivers");
  const { id } = await context.params;

  await driversService.deleteDriver(id);

  return NextResponse.json(
    buildSuccessResponse({
      message: "Driver deleted successfully",
      requestId,
    }),
  );
}

export async function handleGetAvailableDrivers(request: Request) {
  const requestId = createRequestId();
  await authorizeRead(request, "drivers");

  const drivers = await driversService.getAvailableDrivers();

  return NextResponse.json(
    buildSuccessResponse({
      message: "Available drivers fetched successfully",
      data: { drivers },
      requestId,
    }),
  );
}
