'use client';

import type { Creative } from '@/lib/data';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type CreativeStatus = 'draft' | 'review' | 'approved' | 'changes';

const statusConfig: Record<
  CreativeStatus,
  { label: string; className: string }
> = {
  draft: { label: 'Borrador', className: 'bg-gray-200 text-gray-800' },
  review: {
    label: 'En Revisión',
    className: 'bg-yellow-200 text-yellow-800',
  },
  approved: { label: 'Aprobado', className: 'bg-blue-200 text-blue-800' },
  changes: {
    label: 'Con Cambios',
    className: 'bg-orange-200 text-orange-800',
  },
};

export function CreativeCard({ creative }: { creative: Creative }) {
  const { id, title, description, status, assetCount, updatedAt } = creative;
  const config = statusConfig[status] || { label: 'Desconocido', className: 'bg-gray-200 text-gray-800' };

  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
                <Link href={`/creatives/${id}`} className="hover:underline">
                    {title}
                </Link>
            </CardTitle>
            <Badge
                variant="outline"
                className={cn('border-transparent whitespace-nowrap', config.className)}
            >
                {config.label}
            </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{assetCount} {assetCount === 1 ? 'variación' : 'variaciones'}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Actualizado {new Date(updatedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
