'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockCampaigns, mockCreatives, mockVariations } from '@/lib/data';
import { VariationCard } from '@/components/dashboard/variation-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NewVariationForm } from '@/components/dashboard/new-variation-form';
import { useState } from 'react';

export default function CreativeDetailPage({ params }: { params: { creativeId: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const creative = mockCreatives.find(c => c.id === params.creativeId);

  if (!creative) {
    notFound();
  }
  
  const campaign = mockCampaigns.find(c => c.id === creative.campaignId);
  const variations = mockVariations.filter(v => v.creativeId === creative.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
            <Button variant="ghost" asChild>
                <Link href={`/campaigns/${creative.campaignId}`} className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a {campaign?.name || 'la campaña'}</span>
                </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold mt-2">{creative.title}</h1>
            <p className="text-muted-foreground max-w-xl">{creative.description}</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle />
                    <span>Nueva Variación</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Variación</DialogTitle>
                </DialogHeader>
                <NewVariationForm creative={creative} onFormSubmit={() => setIsModalOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-xl font-headline font-semibold mb-4">Variaciones</h2>
        {variations.length > 0 ? (
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {variations.map(variation => (
                    <VariationCard key={variation.id} variation={variation} />
                ))}
            </div>
        ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-12 text-center">
                <p className="text-lg font-medium">Sin Variaciones Todavía</p>
                <p className="text-muted-foreground mt-2">Crea la primera variación para este creativo.</p>
                <DialogTrigger asChild>
                    <Button className="mt-4">
                        <PlusCircle />
                        <span>Crear Variación</span>
                    </Button>
                </DialogTrigger>
            </div>
        )}
      </div>
    </div>
  );
}
