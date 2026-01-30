
import { notFound } from 'next/navigation';
import { mockCampaigns, mockCreatives } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreativeCard } from '@/components/dashboard/creative-card';

// Esta página ahora es un Server Component por defecto, lo cual es ideal para
// obtener datos (data fetching).

export default async function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  const creatives = mockCreatives.filter(c => c.campaignId === campaignId);

  if (!campaign) {
    notFound();
  }

  // El estado y la interactividad se pueden manejar en Client Components más pequeños si es necesario.
  // Por ahora, esta página es mayormente estática.

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <Button variant="ghost" asChild>
                <Link href="/campaigns" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Campañas</span>
                </Link>
            </Button>
            <h1 className="font-headline text-3xl font-semibold mt-2">{campaign.name}</h1>
            <p className="text-muted-foreground">{campaign.client.name}</p>
        </div>
        <Button>
          <PlusCircle />
          <span>Nuevo Creativo</span>
        </Button>
      </div>

      <Tabs defaultValue="creatives">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="creatives">
            <FileText className="mr-2" />
            Creativos
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="mr-2" />
            Actividad
          </TabsTrigger>
          <TabsTrigger value="approvals">
            <CheckCircle className="mr-2" />
            Aprobaciones
          </TabsTrigger>
        </TabsList>
        <TabsContent value="creatives" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {creatives.map(creative => (
                    <CreativeCard key={creative.id} creative={creative} />
                ))}
            </div>
        </TabsContent>
        <TabsContent value="activity">
          <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12">
            <p className="text-muted-foreground">La actividad de la campaña aparecerá aquí.</p>
          </div>
        </TabsContent>
        <TabsContent value="approvals">
          <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12">
            <p className="text-muted-foreground">El resumen de aprobaciones aparecerá aquí.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
