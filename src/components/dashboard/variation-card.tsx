'use client';

import type { Variation } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Image as ImageIcon, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

type VariationStatus = 'draft' | 'review' | 'approved' | 'changes';

const statusConfig: Record<
  VariationStatus,
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

export function VariationCard({ variation }: { variation: Variation }) {
  const { id, formatKey, assetType, assetUrl, status, updatedAt } = variation;
  const config = statusConfig[status] || { label: 'Desconocido', className: 'bg-gray-200 text-gray-800' };

  return (
    <Card className="flex flex-col transition-all hover:shadow-md group">
      <CardHeader className="p-0">
        <Link href={`#`} className="block aspect-video relative overflow-hidden rounded-t-lg">
            {assetType === 'image' ? (
                <Image 
                    src={assetUrl}
                    alt={`Preview for ${formatKey}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="creative variation"
                />
            ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                    <video 
                        src={assetUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white/80" />
                    </div>
                </div>
            )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
            <div>
                <h3 className="font-semibold leading-tight">{formatKey}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {assetType === 'image' ? <ImageIcon className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                    <span>{assetType === 'image' ? 'Imagen' : 'Video'}</span>
                </div>
            </div>
            <Badge
                variant="outline"
                className={cn('border-transparent whitespace-nowrap text-xs', config.className)}
            >
                {config.label}
            </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{new Date(updatedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
        </div>
        <button>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Más opciones</span>
        </button>
      </CardFooter>
    </Card>
  );
}
