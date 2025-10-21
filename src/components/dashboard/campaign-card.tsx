'use client';
import { useState, useEffect } from 'react';
import type { Campaign, CampaignStatus } from '@/lib/data';
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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

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
  completed: {
    label: 'Completado',
    className: 'bg-green-200 text-green-800',
  },
  archived: { label: 'Archivado', className: 'bg-gray-400 text-white' },
};

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { name, client, status, progress, team, dueDate } = campaign;
  const config = statusConfig[status];
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    setFormattedDate(new Date(dueDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
  }, [dueDate]);

  return (
    <Card className="flex flex-col transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">
                <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                    {name}
                </Link>
            </CardTitle>
            <Badge
                variant="outline"
                className={cn('border-transparent whitespace-nowrap', config.className)}
            >
                {config.label}
            </Badge>
        </div>
        <CardDescription>{client.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} aria-label={`${progress}% de progreso`} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {team.map((user) => (
            <Avatar key={user.id} className="border-2 border-card">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          {formattedDate ? <span>{formattedDate}</span> : null}
        </div>
      </CardFooter>
    </Card>
  );
}
