import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampaignCard } from '@/components/dashboard/campaign-card';
import { mockCampaigns } from '@/lib/data';

export default function CampaignsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Campañas</h1>
        <Button>
          <PlusCircle />
          <span>Nueva Campaña</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
