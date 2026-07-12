"use client";

import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  AnalyticsExpensePoint,
  AnalyticsMonthlyPoint,
  AnalyticsOverviewViewData,
  AnalyticsVehicleCostPoint,
} from "@/features/analytics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartColors = ["#60a5fa", "#f97316", "#22c55e", "#a78bfa", "#fb7185"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function tooltipStyle() {
  return {
    backgroundColor: "rgb(24 24 27)",
    border: "1px solid rgb(255 255 255 / 0.12)",
    borderRadius: "0.75rem",
    color: "rgb(244 244 245)",
  };
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.03] text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function RevenueCostChart({ data }: { data: AnalyticsMonthlyPoint[] }) {
  const hasData = data.some((point) => point.revenue > 0 || point.operationalCost > 0);

  return (
    <Card className="border-white/10 bg-card/70">
      <CardHeader>
        <CardTitle>Monthly Revenue vs Cost</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="rgb(255 255 255 / 0.08)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#a1a1aa" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#a1a1aa" }}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle()}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Legend />
                <Bar
                  dataKey="operationalCost"
                  name="Operational cost"
                  fill="#f97316"
                  radius={[8, 8, 0, 0]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#60a5fa33"
                  stroke="#60a5fa"
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart message="No revenue or cost data for this period." />
        )}
      </CardContent>
    </Card>
  );
}

export function TopCostliestVehiclesChart({ data }: { data: AnalyticsVehicleCostPoint[] }) {
  return (
    <Card className="border-white/10 bg-card/70">
      <CardHeader>
        <CardTitle>Top Costliest Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
              >
                <CartesianGrid stroke="rgb(255 255 255 / 0.08)" horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#a1a1aa" }}
                  tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="registrationNumber"
                  tickLine={false}
                  axisLine={false}
                  width={82}
                  tick={{ fill: "#d4d4d8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle()}
                  formatter={(value) => formatCurrency(Number(value))}
                />
                <Bar dataKey="totalCost" name="Total cost" radius={[0, 8, 8, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={entry.vehicleId} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart message="No vehicle cost data for this period." />
        )}
      </CardContent>
    </Card>
  );
}

export function ExpenseBreakdownChart({ data }: { data: AnalyticsExpensePoint[] }) {
  const visibleData = data.filter((item) => item.amount > 0);

  return (
    <Card className="border-white/10 bg-card/70">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {visibleData.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visibleData}
                    dataKey="amount"
                    nameKey="label"
                    innerRadius={48}
                    outerRadius={78}
                    paddingAngle={3}
                  >
                    {visibleData.map((entry, index) => (
                      <Cell key={entry.category} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle()}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {visibleData.map((item, index) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                      />
                      {item.label}
                    </span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: chartColors[index % chartColors.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyChart message="No expenses recorded for this period." />
        )}
      </CardContent>
    </Card>
  );
}

export function CostSummaryPanel({
  summary,
}: {
  summary: AnalyticsOverviewViewData["costSummary"];
}) {
  const items = [
    { label: "Revenue", value: summary.revenue, color: "bg-sky-400" },
    { label: "Fuel", value: summary.fuel, color: "bg-orange-400" },
    { label: "Maintenance", value: summary.maintenance, color: "bg-emerald-400" },
    { label: "Expenses", value: summary.expenses, color: "bg-violet-400" },
  ];

  return (
    <Card className="border-white/10 bg-card/70">
      <CardHeader>
        <CardTitle>Financial Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <span className={`size-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
            <p className="mt-2 font-heading text-xl font-semibold">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
