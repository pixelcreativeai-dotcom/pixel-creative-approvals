
import { notFound } from 'next/navigation';
import { mockCampaigns, mockCreatives, mockVariations, type Creative } from '@/lib/data';
import { CreativeDetailView } from '@/components/dashboard/creative-detail-view';

// Esta página ahora es un Server Component.
// Obtiene los datos en el servidor y se los pasa al Client Component.
export default function CreativeDetailPage({ params }: { params: { creativeId: string } }) {
  const { creativeId } = params;

  const creative = mockCreatives.find(c => c.id === creativeId);

  if (!creative) {
    notFound();
  }

  const campaign = mockCampaigns.find(c => c.id === creative.campaignId);
  const variations = mockVariations.filter(v => v.creativeId === creative.id);

  // Pasamos los datos necesarios al Client Component.
  return <CreativeDetailView creative={creative} campaign={campaign} variations={variations} />;
}
