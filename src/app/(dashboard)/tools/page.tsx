import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Scan, Scale } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'Validador de Formatos',
    description: 'Valida tus assets (imágenes/videos) según las especificaciones de cada plataforma.',
    href: '/tools/format-validator',
    icon: Scan,
  },
  {
    title: 'Sugerencias de Recorte (IA)',
    description: 'Recibe sugerencias de cropping y resizing para optimizar tus creativos.',
    href: '/tools/cropping-suggestions',
    icon: Scale,
  },
];

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold">Herramientas</h1>
        <p className="text-muted-foreground">Utilidades para optimizar tu flujo de trabajo creativo.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title}>
            <Card className="flex h-full flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-accent p-3 rounded-md">
                    <tool.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="p-6 pt-0 flex justify-end">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
