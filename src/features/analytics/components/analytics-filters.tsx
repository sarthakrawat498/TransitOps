"use client";

import type {
  AnalyticsFilter,
  AnalyticsFilterKey,
  AnalyticsFilterValues,
} from "@/features/analytics/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsFiltersProps {
  disabled?: boolean;
  filters: AnalyticsFilter[];
  values: AnalyticsFilterValues;
  onChange: (key: AnalyticsFilterKey, value: string) => void;
}

export function AnalyticsFilters({
  disabled = false,
  filters,
  values,
  onChange,
}: AnalyticsFiltersProps) {
  return (
    <section aria-label="Analytics filters" className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Reports & Analytics
          </p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Fleet performance insights
          </h1>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-6xl xl:grid-cols-4">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={values[filter.key]}
            onValueChange={(value) => onChange(filter.key, value ?? "all")}
          >
            <SelectTrigger
              disabled={disabled}
              className="w-full rounded-md border-white/20 bg-card/70"
            >
              <span className="text-muted-foreground">{filter.label}:</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="border border-white/10 bg-popover">
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </section>
  );
}
