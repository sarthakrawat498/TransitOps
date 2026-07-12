import type { ReactNode } from "react";

interface FuelExpensesFormFieldProps {
  label: string;
  children: ReactNode;
  helpText?: string;
}

export function FuelExpensesFormField({ label, children, helpText }: FuelExpensesFormFieldProps) {
  return (
    <label className="space-y-2">
      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
      {helpText ? <span className="block text-xs text-muted-foreground">{helpText}</span> : null}
    </label>
  );
}
