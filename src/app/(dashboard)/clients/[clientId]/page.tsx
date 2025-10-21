import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CampaignCard } from '@/components/dashboard/campaign-card';
import { mockClients, mockCampaigns } from '@/lib/data';
import Image from 'next/image';

export default function ClientDetailPage({ params }: { params: { clientId: string } }) {
  const client = mockClients.find(c => c.id === params.clientId);
  const campaigns = mockCampaigns.filter(c => c.client.id === params.clientId);

  if (!client) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
            <Button variant="ghost" asChild>
                <Link href="/clients" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Volver a Clientes</span>
                </Link>
            </Button>
            <div className="flex items-center gap-4 mt-2">
                <Image 
                    src={client.logoUrl}
                    alt={`${client.name} logo`}
                    width={64}
                    height={64}
                    className="rounded-md"
                    data-ai-hint="client logo"
                />
                <div>
                    <h1 className="font-headline text-3xl font-semibold">{client.name}</h1>
                    <p className="text-muted-foreground">{client.contactName} - {client.contactEmail}</p>
                </div>
            </div>
        </div>
        <Button>
          <PlusCircle />
          <span>Nueva Campaña</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campañas de {client.name}</CardTitle>
          <CardDescription>Todas las campañas asociadas a este cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {campaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm p-12">
              <p className="text-muted-foreground">Este cliente aún no tiene campañas.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
