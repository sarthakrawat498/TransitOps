"use client";

import type {
  DashboardFilter,
  DashboardFilterKey,
  DashboardFilterValues,
} from "@/features/dashboard/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  disabled?: boolean;
  filters: DashboardFilter[];
  values: DashboardFilterValues;
  onChange: (key: DashboardFilterKey, value: string) => void;
}

export function DashboardFilters({
  disabled = false,
  filters,
  values,
  onChange,
}: DashboardFiltersProps) {
  return (
    <section aria-label="Dashboard filters" className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Filters
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:max-w-5xl xl:grid-cols-4">
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
