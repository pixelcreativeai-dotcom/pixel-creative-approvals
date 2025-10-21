import { FormatValidatorTool } from "@/components/dashboard/format-validator-tool";

export default function FormatValidatorPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Validador de Formatos</h1>
        <p className="text-muted-foreground">
          Sube un asset para validar sus especificaciones y recibir sugerencias de la IA.
        </p>
      </div>
      <FormatValidatorTool />
    </div>
  );
}
