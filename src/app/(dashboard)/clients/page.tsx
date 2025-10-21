import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="font-headline text-2xl font-semibold">Gestión de Clientes</h3>
        <p className="text-muted-foreground">
          Esta sección está en construcción.
        </p>
      </div>
    </div>
  );
}
