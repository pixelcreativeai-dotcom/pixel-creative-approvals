'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function CreativeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
        <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error al Cargar el Creativo</AlertTitle>
            <AlertDescription>
            <p>
                No pudimos cargar los detalles del creativo. Por favor, intenta de nuevo.
            </p>
            <pre className="mt-2 text-xs opacity-80">
                {error.message}
            </pre>
            </AlertDescription>
        </Alert>
        <Button onClick={() => reset()}>
            Intentar de nuevo
        </Button>
    </div>
  );
}
