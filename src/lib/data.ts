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
    platform: 'meta' | 'instagram' | 'facebook' | 'tiktok' | 'google';
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
    { id: 'creative-2', campaignId: 'camp-1', title: 'Google Display Ads', description: 'Banners estáticos y responsivos para la red de display de Google, cubriendo los principales formatos.', platform: 'google', status: 'draft', assetCount: 5, updatedAt: '2024-07-29' },
    { id: 'creative-3', campaignId: 'camp-2', title: 'TikTok - Video Viral', description: 'Video corto para la campaña de branding en TikTok, buscando un enfoque orgánico y de tendencia.', platform: 'tiktok', status: 'approved', assetCount: 1, updatedAt: '2024-07-25' },
];

export const mockVariations: Variation[] = [
    { id: 'var-1', creativeId: 'creative-1', formatKey: 'Stories/Reels 9:16', assetType: 'video', assetUrl: 'https://storage.googleapis.com/pixel-creative-assets-demo/summer-reel.mp4', status: 'review', updatedAt: '2024-07-28' },
    { id: 'var-2', creativeId: 'creative-1', formatKey: 'Feed 4:5', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-1')?.imageUrl ?? '', status: 'approved', updatedAt: '2024-07-27' },
    { id: 'var-3', creativeId: 'creative-1', formatKey: 'Feed 1:1', assetType: 'image', assetUrl: imageMap.get('campaign-thumbnail-1')?.imageUrl ?? '', status: 'changes', updatedAt: '2024-07-28' },
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
];
