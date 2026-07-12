import { Badge } from "@/components/ui/badge";
import { STACK_ITEMS } from "@/constants";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Odoo Hackathon
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            main event is running
          </h1>
          <p className="text-muted-foreground">
            Your team starter is ready. Clone, install, and start building.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {STACK_ITEMS.map((item) => (
            <Badge key={item} variant="secondary" className="px-3 py-1 text-sm">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
