"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { FuelExpensesFormField } from "@/features/fuel-expenses/components/fuel-expenses-form-field";
import { getFuelExpensesFormError } from "@/features/fuel-expenses/components/form-errors";
import { useCreateExpense } from "@/features/fuel-expenses/hooks/use-create-expense";
import type { FuelExpenseVehicleOption } from "@/features/fuel-expenses/types";

const expenseCategories = ["TOLL", "PERMIT", "INSURANCE", "FINE", "PARKING", "OTHER"] as const;

interface AddExpenseDialogProps {
  vehicles: FuelExpenseVehicleOption[];
}

interface ExpenseFormValues {
  vehicleId: string;
  category: (typeof expenseCategories)[number];
  amount: string;
  expenseDate: string;
  description: string;
}

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function getDefaultFormValues(vehicles: FuelExpenseVehicleOption[]): ExpenseFormValues {
  return {
    vehicleId: vehicles[0]?.id ?? "",
    category: "TOLL",
    amount: "",
    expenseDate: todayInputValue(),
    description: "",
  };
}

export function AddExpenseDialog({ vehicles }: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const defaultValues = useMemo(() => getDefaultFormValues(vehicles), [vehicles]);
  const [formValues, setFormValues] = useState<ExpenseFormValues>(defaultValues);
  const createExpenseMutation = useCreateExpense();
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === formValues.vehicleId);

  const handleChange = (key: keyof ExpenseFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.vehicleId) {
      toast.error("Please select a vehicle before adding an expense.");
      return;
    }

    try {
      await createExpenseMutation.mutateAsync({
        vehicleId: formValues.vehicleId,
        category: formValues.category,
        amount: Number(formValues.amount),
        expenseDate: new Date(`${formValues.expenseDate}T00:00:00`),
        description: formValues.description || undefined,
      });
      toast.success("Expense added");
      setOpen(false);
    } catch (error) {
      toast.error(getFuelExpensesFormError(error, "Unable to add expense."));
    }
  };

  return (
    <>
      <Button
        type="button"
        className="min-w-32 bg-orange-500 text-orange-950 hover:bg-orange-400"
        onClick={() => {
          setFormValues(defaultValues);
          setOpen(true);
        }}
      >
        <Plus className="size-4" />
        Add Expense
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-white/10 bg-[#151515] text-foreground sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>
              Add toll, permit, insurance, parking, fine, or other operational expenses.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleSubmit}>
            <FuelExpensesFormField label="Vehicle">
              <Select
                value={formValues.vehicleId}
                onValueChange={(value) => {
                  if (value) {
                    handleChange("vehicleId", value);
                  }
                }}
              >
                <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
                  <span className={selectedVehicle ? undefined : "text-muted-foreground"}>
                    {selectedVehicle
                      ? `${selectedVehicle.registrationNumber} - ${selectedVehicle.model}`
                      : "Select vehicle"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FuelExpensesFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FuelExpensesFormField label="Category">
                <Select
                  value={formValues.category}
                  onValueChange={(value) => {
                    if (
                      value &&
                      expenseCategories.includes(value as ExpenseFormValues["category"])
                    ) {
                      handleChange("category", value);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 w-full border-white/30 bg-white/10 text-foreground">
                    <span>{formValues.category}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FuelExpensesFormField>

              <FuelExpensesFormField label="Amount">
                <Input
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={formValues.amount}
                  className="h-10 border-white/30 bg-white/10 text-foreground"
                  onChange={(event) => handleChange("amount", event.target.value)}
                />
              </FuelExpensesFormField>
            </div>

            <FuelExpensesFormField label="Date">
              <Input
                required
                type="date"
                value={formValues.expenseDate}
                className="h-10 border-white/30 bg-white/10 text-foreground"
                onChange={(event) => handleChange("expenseDate", event.target.value)}
              />
            </FuelExpensesFormField>

            <FuelExpensesFormField label="Description">
              <Input
                value={formValues.description}
                className="h-10 border-white/30 bg-white/10 text-foreground"
                placeholder="Toll booth, permit renewal..."
                onChange={(event) => handleChange("description", event.target.value)}
              />
            </FuelExpensesFormField>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createExpenseMutation.isPending}>
                {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
