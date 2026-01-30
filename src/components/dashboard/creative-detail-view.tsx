'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, CheckCircle2, MessageSquareText, PlusCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VariationCard } from '@/components/dashboard/variation-card';
import { NewVariationForm } from '@/components/dashboard/new-variation-form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Creative, Campaign, Variation } from '@/lib/data';
import { mockApprovalSteps, mockCopyEntries, mockFeedbackItems } from '@/lib/data';

interface CreativeDetailViewProps {
  creative: Creative;
  campaign: Campaign | undefined;
  initialVariations: Variation[];
}

export function CreativeDetailView({ creative, campaign, initialVariations }: CreativeDetailViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variations, setVariations] = useState<Variation[]>(initialVariations);

  const approvalSteps = mockApprovalSteps.filter(step => step.creativeId === creative.id);
  const copyEntries = mockCopyEntries.filter(copy => copy.creativeId === creative.id);
  const feedbackItems = mockFeedbackItems.filter(item => item.creativeId === creative.id);

  const platformLabels: Record<Creative['platform'], string> = {
    meta: 'Meta Ads',
    instagram: 'Instagram',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    google: 'Google Ads',
    linkedin: 'LinkedIn',
  };

  const approvalStatusStyles: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-blue-100 text-blue-700',
    pending: 'bg-slate-100 text-slate-600',
    changes: 'bg-orange-100 text-orange-700',
  };

  const copyStatusStyles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-600',
    review: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    changes: 'bg-orange-100 text-orange-700',
  };

  const handleAddVariation = (newVariation: Variation) => {
    setVariations(prev => [newVariation, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
              <Button variant="ghost" asChild>
                  <Link href={`/campaigns/${creative.campaignId}`} className="flex items-center gap-2 text-muted-foreground">
                      <ArrowLeft className="h-4 w-4" />
                      <span>Volver a {campaign?.name || 'la campaña'}</span>
                  </Link>
              </Button>
              <h1 className="font-headline text-3xl font-semibold mt-2">{creative.title}</h1>
              <p className="text-muted-foreground max-w-xl">{creative.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
                <Badge variant="outline" className="border-transparent bg-slate-100 text-slate-600">
                  {platformLabels[creative.platform]}
                </Badge>
                {campaign?.client ? (
                  <span>Cuenta: {campaign.client.name}</span>
                ) : null}
                {campaign?.client?.contactName ? <span>Contacto: {campaign.client.contactName}</span> : null}
              </div>
          </div>
          <DialogTrigger asChild>
              <Button>
                  <PlusCircle />
                  <span>Nueva Variación</span>
              </Button>
          </DialogTrigger>
        </div>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-headline font-semibold">Variaciones</h2>
                <Badge variant="outline" className="border-transparent bg-slate-100 text-slate-600">
                  {variations.length} formatos activos
                </Badge>
              </div>
              {variations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            </section>

            <section>
              <h2 className="text-xl font-headline font-semibold mb-4">Copys cargados</h2>
              {copyEntries.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {copyEntries.map(copy => (
                    <div key={copy.id} className="rounded-lg border p-4 space-y-3 bg-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{copy.title}</h3>
                          <p className="text-sm text-muted-foreground">{copy.owner}</p>
                        </div>
                        <Badge variant="outline" className={cn('border-transparent', copyStatusStyles[copy.status])}>
                          {copy.status === 'review' ? 'En revisión' : copy.status === 'approved' ? 'Aprobado' : copy.status === 'changes' ? 'Con cambios' : 'Borrador'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Primary:</span> {copy.primaryText}</p>
                        <p><span className="font-medium">Headline:</span> {copy.headline}</p>
                        <p><span className="font-medium">CTA:</span> {copy.callToAction}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {copy.placements.map(placement => (
                          <span key={placement} className="rounded-full bg-slate-100 px-2 py-1">{placement}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                  No hay copys cargados todavía.
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-lg border p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Flujo de aprobación</h3>
              </div>
              <div className="space-y-3">
                {approvalSteps.length > 0 ? (
                  approvalSteps.map(step => (
                    <div key={step.id} className="rounded-md border border-dashed p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{step.title}</p>
                          <p className="text-xs text-muted-foreground">{step.owner} · {step.role}</p>
                        </div>
                        <Badge variant="outline" className={cn('border-transparent text-xs', approvalStatusStyles[step.status])}>
                          {step.status === 'completed' ? 'Listo' : step.status === 'in_progress' ? 'En curso' : step.status === 'changes' ? 'Cambios' : 'Pendiente'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{step.description}</p>
                      <p className="text-[11px] text-muted-foreground mt-2">Actualizado: {new Date(step.updatedAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay pasos definidos para esta aprobación.</p>
                )}
              </div>
            </section>

            <section className="rounded-lg border p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Comentarios y revisiones</h3>
              </div>
              {feedbackItems.length > 0 ? (
                <div className="space-y-3">
                  {feedbackItems.map(item => (
                    <div key={item.id} className="rounded-md border border-dashed p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{item.author}</p>
                          <p className="text-xs text-muted-foreground">{item.role}</p>
                        </div>
                        <Badge variant="outline" className={cn('border-transparent text-xs', copyStatusStyles[item.status])}>
                          {item.status === 'changes' ? 'Con cambios' : item.status === 'review' ? 'En revisión' : item.status === 'approved' ? 'Aprobado' : 'Borrador'}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2">{item.message}</p>
                      <p className="text-[11px] text-muted-foreground mt-2"> {new Date(item.createdAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin comentarios todavía.</p>
              )}
            </section>

            <section className="rounded-lg border p-4 space-y-4 bg-card">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Notificaciones automáticas</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                  Media buyer recibe alertas cuando el cliente deja comentarios.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                  Copywriter actualiza copys directamente si hay cambios de texto.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                  Diseñadora recibe tareas cuando hay cambios de diseño o video.
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
              <DialogTitle>Crear Nueva Variación</DialogTitle>
          </DialogHeader>
          <NewVariationForm creative={creative} onFormSubmit={handleAddVariation} />
      </DialogContent>
    </Dialog>
  );
}
