'use client';

import { useState, useEffect } from 'react';
import type { Variation } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Image as ImageIcon, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetaFeedPreview, InstagramStoryPreview, TikTokPreview } from '@/components/dashboard/previews';

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

const getPreviewComponent = (formatKey: string, assetType: 'image' | 'video', assetUrl: string) => {
    const props = { assetUrl, assetType };
    if (formatKey.toLowerCase().includes('stories') || formatKey.toLowerCase().includes('reels') || formatKey.includes('9:16')) {
        return <InstagramStoryPreview {...props} />;
    }
    if (formatKey.toLowerCase().includes('tiktok')) {
        return <TikTokPreview {...props} />;
    }
    // Default to Meta Feed for other formats like 1:1 or 4:5
    return <MetaFeedPreview {...props} />;
}

export function VariationCard({ variation }: { variation: Variation }) {
  const { id, formatKey, assetType, assetUrl, status, updatedAt } = variation;
  const config = statusConfig[status] || { label: 'Desconocido', className: 'bg-gray-200 text-gray-800' };
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(updatedAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
  }, [updatedAt]);


  return (
    <Card className="flex flex-col transition-all hover:shadow-md group">
      <CardContent className="p-4 flex-grow">
        <Link href={`#`} className="block overflow-hidden rounded-md border">
            {getPreviewComponent(formatKey, assetType, assetUrl)}
        </Link>
        <div className="flex justify-between items-start gap-2 mt-4">
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
          {formattedDate ? <span>{formattedDate}</span> : null}
        </div>
        <button>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Más opciones</span>
        </button>
      </CardFooter>
    </Card>
  );
}
