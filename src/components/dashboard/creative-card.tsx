import type { Creative, CampaignStatus } from '@/lib/data';
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

const statusConfig: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  draft: { label: 'Borrador', className: 'bg-gray-200 text-gray-800' },
  in_review: {
    label: 'En Revisión',
    className: 'bg-yellow-200 text-yellow-800',
  },
  approved: { label: 'Aprobado', className: 'bg-blue-200 text-blue-800' },
  completed: { // Reusing campaign statuses for now
    label: 'Completado',
    className: 'bg-green-200 text-green-800',
  },
  archived: { label: 'Archivado', className: 'bg-gray-400 text-white' },
};

export function CreativeCard({ creative }: { creative: Creative }) {
  const { title, description, status, assetCount, updatedAt } = creative;
  // The 'as' is a type assertion needed because creative status can be 'review', which is not in CampaignStatus.
  // This is a temporary solution.
  const config = statusConfig[status as 'in_review'];


  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
                <Link href={`#`} className="hover:underline">
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