import { NextResponse } from "next/server";

import * as fuelExpensesService from "@/server/modules/fuel-expenses/fuel-expenses.service";
import {
  createExpenseSchema,
  createFuelLogSchema,
} from "@/server/modules/fuel-expenses/fuel-expenses.validators";
import { ALL_ROLES, authorizeRoles } from "@/server/shared/middleware/rbac";
import { buildSuccessResponse, createRequestId } from "@/server/shared/responses/response-builder";

function setNoStoreHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function handleGetFuelExpenses(request: Request) {
  const requestId = createRequestId();
  await authorizeRoles(request, ALL_ROLES);

  const overview = await fuelExpensesService.getOverview();
  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Fuel and expense overview fetched successfully",
      data: overview,
      requestId,
    }),
  );

  return setNoStoreHeaders(response);
}

export async function handleCreateFuelLog(request: Request) {
  const requestId = createRequestId();
  await authorizeRoles(request, ALL_ROLES);

  const body = await request.json();
  const input = createFuelLogSchema.parse(body);
  const fuelLog = await fuelExpensesService.createFuelLog(input);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Fuel log created successfully",
      data: { fuelLog },
      requestId,
    }),
    { status: 201 },
  );

  return setNoStoreHeaders(response);
}

export async function handleCreateExpense(request: Request) {
  const requestId = createRequestId();
  await authorizeRoles(request, ALL_ROLES);

  const body = await request.json();
  const input = createExpenseSchema.parse(body);
  const expense = await fuelExpensesService.createExpense(input);

  const response = NextResponse.json(
    buildSuccessResponse({
      message: "Expense created successfully",
      data: { expense },
      requestId,
    }),
    { status: 201 },
  );

  return setNoStoreHeaders(response);
}
