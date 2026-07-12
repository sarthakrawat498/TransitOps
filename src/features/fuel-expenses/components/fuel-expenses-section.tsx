import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FuelExpensesSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FuelExpensesSection({ title, children, className }: FuelExpensesSectionProps) {
  const headingId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-heading`;

  return (
    <section className={cn("space-y-2", className)} aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
      >
        {title}
      </h2>
      <div className="overflow-hidden border-y border-white/15 bg-[#101010]/70">{children}</div>
    </section>
  );
}
