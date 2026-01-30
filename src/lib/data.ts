import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const imageMap = new Map<string, ImagePlaceholder>(
  PlaceHolderImages.map(img => [img.id, img])
);

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'admin' | 'designer' | 'client' | 'viewer';
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  contactName: string;
  contactEmail: string;
}

export type CampaignStatus = 'draft' | 'in_review' | 'approved' | 'completed' | 'archived';

export interface Campaign {
  id: string;
  name: string;
  client: Client;
  status: CampaignStatus;
  dueDate: string;
  team: User[];
  progress: number;
}

export type CreativeStatus = 'draft' | 'review' | 'approved' | 'changes';

export interface Creative {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  platform: 'meta' | 'instagram' | 'facebook' | 'tiktok' | 'google' | 'linkedin';
  status: CreativeStatus;
  assetCount: number;
  updatedAt: string;
}

export type VariationStatus = 'draft' | 'review' | 'approved' | 'changes';
export type AssetType = 'image' | 'video';

export interface Variation {
  id: string;
  creativeId: string;
  formatKey: string;
  assetType: AssetType;
  assetUrl: string;
  status: VariationStatus;
  updatedAt: string;
}

export interface FormatSpec {
    platform: string;
    name: string;
    spec: string;
    ideal: string;
    min?: string;
    ratio: string;
    maxSizeKB?: number;
}

export type ApprovalStepStatus = 'completed' | 'in_progress' | 'pending' | 'changes';

export interface ApprovalStep {
  id: string;
  creativeId: string;
  title: string;
  owner: string;
  role: string;
  status: ApprovalStepStatus;
  description: string;
  updatedAt: string;
}

export interface CopyEntry {
  id: string;
  creativeId: string;
  title: string;
  primaryText: string;
  headline: string;
  callToAction: string;
  placements: string[];
  status: VariationStatus;
  owner: string;
  updatedAt: string;
}

export interface FeedbackItem {
  id: string;
  creativeId: string;
  author: string;
  role: string;
  message: string;
  status: VariationStatus;
  createdAt: string;
}


export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alicia Rodriguez', avatarUrl: imageMap.get('user-avatar-1')?.imageUrl ?? '', role: 'admin' },
  { id: 'user-2', name: 'Ben Carter', avatarUrl: imageMap.get('user-avatar-2')?.imageUrl ?? '', role: 'designer' },
  { id: 'user-3', name: 'Carlos Vega', avatarUrl: imageMap.get('user-avatar-3')?.imageUrl ?? '', role: 'client' },
  { id: 'user-4', name: 'Diana Smith', avatarUrl: imageMap.get('user-avatar-4')?.imageUrl ?? '', role: 'viewer' },
];

export const mockClients: Client[] = [
  { id: 'client-1', name: 'Innovate Inc.', slug: 'innovate-inc', logoUrl: imageMap.get('client-logo-1')?.imageUrl ?? '', contactName: 'Laura Evans', contactEmail: 'laura@innovate.com' },
  { id: 'client-2', name: 'Quantum Solutions', slug: 'quantum-solutions', logoUrl: imageMap.get('client-logo-2')?.imageUrl ?? '', contactName: 'Mark Chen', contactEmail: 'mark@quantum.io' },
  { id: 'client-3', name: 'Synergy Corp', slug: 'synergy-corp', logoUrl: imageMap.get('client-logo-2')?.imageUrl ?? '', contactName: 'Olivia Wilde', contactEmail: 'olivia@synergy.org' },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Lanzamiento Verano 2024',
    client: mockClients[0],
    status: 'in_review',
    dueDate: '2024-08-15',
    team: [mockUsers[0], mockUsers[1]],
    progress: 75,
  },
  {
    id: 'camp-2',
    name: 'Campaña de Branding Q3',
    client: mockClients[1],
    status: 'approved',
    dueDate: '2024-09-01',
    team: [mockUsers[1], mockUsers[3]],
    progress: 100,
  },
  {
    id: 'camp-3',
    name: 'Promoción Vuelta al Cole',
    client: mockClients[2],
    status: 'draft',
    dueDate: '2024-08-25',
    team: [mockUsers[0], mockUsers[1], mockUsers[2]],
    progress: 20,
  },
  {
    id: 'camp-4',
    name: 'Ofertas Black Friday',
    client: mockClients[0],
    status: 'completed',
    dueDate: '2023-11-28',
    team: [mockUsers[1]],
    progress: 100,
  },
];

export const mockCreatives: Creative[] = [
    { id: 'creative-1', campaignId: 'camp-1', title: 'IG Stories - Anuncio Principal', description: 'Historias para Instagram con enfoque en el producto estrella de la temporada de verano. Deben ser vibrantes y captar la atención rápidamente.', platform: 'instagram', status: 'review', assetCount: 3, updatedAt: '2024-07-28' },
    { id: 'creative-2', campaignId: 'camp-1', title: 'Google Display Ads', description: 'Banners estáticos y responsivos para la red de display de Google, cubriendo los principales formatos.', platform: 'google', status: 'draft', assetCount: 2, updatedAt: '2024-07-29' },
    { id: 'creative-3', campaignId: 'camp-2', title: 'TikTok - Video Viral', description: 'Video corto para la campaña de branding en TikTok, buscando un enfoque orgánico y de tendencia.', platform: 'tiktok', status: 'approved', assetCount: 1, updatedAt: '2024-07-25' },
    { id: 'creative-4', campaignId: 'camp-3', title: 'LinkedIn Sponsored Content', description: 'Piezas para LinkedIn enfocadas en liderazgo de pensamiento y generación de leads B2B.', platform: 'linkedin', status: 'changes', assetCount: 2, updatedAt: '2024-07-30' },
    { id: 'creative-5', campaignId: 'camp-2', title: 'Facebook Feed - Retargeting', description: 'Creativos estáticos para retargeting en Facebook con enfoque en beneficios y urgencia.', platform: 'facebook', status: 'review', assetCount: 1, updatedAt: '2024-07-30' },
];

export const mockVariations: Variation[] = [
    { id: 'var-1', creativeId: 'creative-1', formatKey: 'Stories/Reels 9:16', assetType: 'video', assetUrl: 'https://storage.googleapis.com/pixel-creative-assets-demo/summer-reel.mp4', status: 'review', updatedAt: '2024-07-28' },
    { id: 'var-2', creativeId: 'creative-1', formatKey: 'Feed 4:5', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-1')?.imageUrl ?? '', status: 'approved', updatedAt: '2024-07-27' },
    { id: 'var-3', creativeId: 'creative-1', formatKey: 'Feed 1:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-1')?.imageUrl ?? '', status: 'changes', updatedAt: '2024-07-28' },
    { id: 'var-4', creativeId: 'creative-2', formatKey: 'Banner 300x250', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-2')?.imageUrl ?? '', status: 'review', updatedAt: '2024-07-29' },
    { id: 'var-5', creativeId: 'creative-2', formatKey: 'Horizontal 1.91:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-3')?.imageUrl ?? '', status: 'draft', updatedAt: '2024-07-29' },
    { id: 'var-6', creativeId: 'creative-3', formatKey: 'In-Feed 9:16', assetType: 'video', assetUrl: 'https://storage.googleapis.com/pixel-creative-assets-demo/tiktok-demo.mp4', status: 'approved', updatedAt: '2024-07-25' },
    { id: 'var-7', creativeId: 'creative-4', formatKey: 'LinkedIn Feed 1.91:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-4')?.imageUrl ?? '', status: 'changes', updatedAt: '2024-07-30' },
    { id: 'var-8', creativeId: 'creative-4', formatKey: 'LinkedIn Carousel 1:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-5')?.imageUrl ?? '', status: 'review', updatedAt: '2024-07-30' },
    { id: 'var-9', creativeId: 'creative-5', formatKey: 'Feed 1:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-6')?.imageUrl ?? '', status: 'review', updatedAt: '2024-07-30' },
];


export const formatSpecs: FormatSpec[] = [
    // Meta / IG / FB
    { platform: 'Meta/IG/FB', name: 'Feed 1:1', spec: '1440x1440', ideal: '1440x1440', min: '600x600', ratio: '1:1', maxSizeKB: 30000 },
    { platform: 'Meta/IG/FB', name: 'Feed 4:5', spec: '1440x1800', ideal: '1440x1800', ratio: '4:5', maxSizeKB: 30000 },
    { platform: 'Meta/IG/FB', name: 'Stories/Reels 9:16', spec: '1080x1920+', ideal: '1080x1920', ratio: '9:16', maxSizeKB: 200000 },
    { platform: 'Meta/IG/FB', name: 'Carrusel 1:1', spec: '≥1080x1080', ideal: '1080x1080', min: '1080x1080', ratio: '1:1', maxSizeKB: 30000 },
    
    // Google Ads (Responsive Display)
    { platform: 'Google Ads', name: 'Horizontal 1.91:1', spec: '1200x628', ideal: '1200x628', min: '600x314', ratio: '1.91:1', maxSizeKB: 5120 },
    { platform: 'Google Ads', name: 'Cuadrado 1:1', spec: '1200x1200', ideal: '1200x1200', min: '300x300', ratio: '1:1', maxSizeKB: 5120 },
    { platform: 'Google Ads', name: 'Vertical 4:5', spec: '960x1200', ideal: '960x1200', min: '480x600', ratio: '4:5', maxSizeKB: 5120 },
    { platform: 'Google Ads', name: 'Logo 1:1', spec: '1200x1200', ideal: '1200x1200', min: '128x128', ratio: '1:1', maxSizeKB: 5120 },
    { platform: 'Google Ads', name: 'Logo 4:1', spec: '1200x300', ideal: '1200x300', min: '512x128', ratio: '4:1', maxSizeKB: 5120 },
    
    // Google Ads (Banners estáticos)
    { platform: 'Google Ads', name: 'Banner 300x250', spec: '300x250', ideal: '300x250', ratio: '1.2:1', maxSizeKB: 150 },
    { platform: 'Google Ads', name: 'Banner 336x280', spec: '336x280', ideal: '336x280', ratio: '1.2:1', maxSizeKB: 150 },
    { platform: 'Google Ads', name: 'Banner 728x90', spec: '728x90', ideal: '728x90', ratio: '8.09:1', maxSizeKB: 150 },
    { platform: 'Google Ads', name: 'Banner 160x600', spec: '160x600', ideal: '160x600', ratio: '1:3.75', maxSizeKB: 150 },
    { platform: 'Google Ads', name: 'Banner 300x600', spec: '300x600', ideal: '300x600', ratio: '1:2', maxSizeKB: 150 },
    { platform: 'Google Ads', name: 'Banner 970x250', spec: '970x250', ideal: '970x250', ratio: '3.88:1', maxSizeKB: 150 },
    
    // TikTok
    { platform: 'TikTok', name: 'In-Feed 9:16', spec: '1080x1920', ideal: '1080x1920', ratio: '9:16', maxSizeKB: 200000 },
    { platform: 'TikTok', name: 'Thumbnail 1:1', spec: '1080x1080', ideal: '1080x1080', ratio: '1:1', maxSizeKB: 30000 },

    // LinkedIn
    { platform: 'LinkedIn', name: 'LinkedIn Feed 1.91:1', spec: '1200x627', ideal: '1200x627', ratio: '1.91:1', maxSizeKB: 5000 },
    { platform: 'LinkedIn', name: 'LinkedIn Carousel 1:1', spec: '1080x1080', ideal: '1080x1080', ratio: '1:1', maxSizeKB: 5000 },
    { platform: 'LinkedIn', name: 'LinkedIn Video 4:5', spec: '1080x1350', ideal: '1080x1350', ratio: '4:5', maxSizeKB: 200000 },
];

export const mockApprovalSteps: ApprovalStep[] = [
  {
    id: 'step-1',
    creativeId: 'creative-1',
    title: 'Copys cargados por media buyer y copywriter',
    owner: 'Alicia Rodriguez',
    role: 'Media Buyer',
    status: 'completed',
    description: 'Primera versión de copys y mensajes clave para Instagram Stories.',
    updatedAt: '2024-07-26',
  },
  {
    id: 'step-2',
    creativeId: 'creative-1',
    title: 'Diseño de piezas y assets',
    owner: 'Ben Carter',
    role: 'Diseñador',
    status: 'completed',
    description: 'Creativos listos en formatos 9:16 y 4:5.',
    updatedAt: '2024-07-27',
  },
  {
    id: 'step-3',
    creativeId: 'creative-1',
    title: 'Aprobación interna media buyer',
    owner: 'Alicia Rodriguez',
    role: 'Media Buyer',
    status: 'in_progress',
    description: 'Revisión interna antes de enviar al cliente.',
    updatedAt: '2024-07-28',
  },
  {
    id: 'step-4',
    creativeId: 'creative-1',
    title: 'Revisión del cliente',
    owner: 'Laura Evans',
    role: 'Cliente',
    status: 'pending',
    description: 'Cliente revisa piezas y envía comentarios.',
    updatedAt: '2024-07-29',
  },
  {
    id: 'step-5',
    creativeId: 'creative-1',
    title: 'Ajustes y reenvío',
    owner: 'Equipo creativo',
    role: 'Equipo',
    status: 'pending',
    description: 'Aplicar cambios de copy o diseño según feedback.',
    updatedAt: '2024-07-29',
  },
  {
    id: 'step-1b',
    creativeId: 'creative-4',
    title: 'Copys para LinkedIn listos',
    owner: 'Alicia Rodriguez',
    role: 'Media Buyer',
    status: 'completed',
    description: 'Mensajes orientados a leads B2B.',
    updatedAt: '2024-07-28',
  },
  {
    id: 'step-2b',
    creativeId: 'creative-4',
    title: 'Diseño de carrusel',
    owner: 'Ben Carter',
    role: 'Diseñador',
    status: 'changes',
    description: 'Cliente solicitó ajustar la portada y CTA.',
    updatedAt: '2024-07-30',
  },
];

export const mockCopyEntries: CopyEntry[] = [
  {
    id: 'copy-1',
    creativeId: 'creative-1',
    title: 'Hook principal',
    primaryText: 'Este verano, tu piel merece el mejor cuidado. Descubre nuestra nueva línea solar.',
    headline: 'Protección + hidratación',
    callToAction: 'Comprar ahora',
    placements: ['Instagram Stories', 'Instagram Reels'],
    status: 'review',
    owner: 'Copywriter - Diana Smith',
    updatedAt: '2024-07-26',
  },
  {
    id: 'copy-2',
    creativeId: 'creative-1',
    title: 'Versión con oferta',
    primaryText: 'Solo por hoy: 20% OFF en protectores solares premium. ¡Corre!',
    headline: 'Descuento por tiempo limitado',
    callToAction: 'Ver colección',
    placements: ['Instagram Stories', 'Facebook Stories'],
    status: 'changes',
    owner: 'Copywriter - Diana Smith',
    updatedAt: '2024-07-28',
  },
  {
    id: 'copy-3',
    creativeId: 'creative-4',
    title: 'LinkedIn Thought Leadership',
    primaryText: 'Cómo las marcas B2B están elevando su performance con creativos centrados en valor.',
    headline: 'Insights para líderes de marketing',
    callToAction: 'Conoce más',
    placements: ['LinkedIn Feed', 'LinkedIn Carousel'],
    status: 'review',
    owner: 'Copywriter - Carlos Vega',
    updatedAt: '2024-07-29',
  },
];

export const mockFeedbackItems: FeedbackItem[] = [
  {
    id: 'feedback-1',
    creativeId: 'creative-1',
    author: 'Laura Evans',
    role: 'Cliente',
    message: '¿Podemos reforzar el beneficio de hidratación en el primer frame?',
    status: 'changes',
    createdAt: '2024-07-28',
  },
  {
    id: 'feedback-2',
    creativeId: 'creative-1',
    author: 'Alicia Rodriguez',
    role: 'Media Buyer',
    message: 'Actualicé el copy en la versión con oferta. Falta ajustar el mockup.',
    status: 'review',
    createdAt: '2024-07-28',
  },
  {
    id: 'feedback-3',
    creativeId: 'creative-4',
    author: 'Olivia Wilde',
    role: 'Cliente',
    message: 'El carrusel se ve muy cargado, necesitamos más aire en el slide 2.',
    status: 'changes',
    createdAt: '2024-07-30',
  },
];
