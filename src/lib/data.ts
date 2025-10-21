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
  logoUrl: string;
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

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alicia Rodriguez', avatarUrl: imageMap.get('user-avatar-1')?.imageUrl ?? '', role: 'admin' },
  { id: 'user-2', name: 'Ben Carter', avatarUrl: imageMap.get('user-avatar-2')?.imageUrl ?? '', role: 'designer' },
  { id: 'user-3', name: 'Carlos Vega', avatarUrl: imageMap.get('user-avatar-3')?.imageUrl ?? '', role: 'client' },
  { id: 'user-4', name: 'Diana Smith', avatarUrl: imageMap.get('user-avatar-4')?.imageUrl ?? '', role: 'viewer' },
];

export const mockClients: Client[] = [
  { id: 'client-1', name: 'Innovate Inc.', logoUrl: imageMap.get('client-logo-1')?.imageUrl ?? '' },
  { id: 'client-2', name: 'Quantum Solutions', logoUrl: imageMap.get('client-logo-1')?.imageUrl ?? '' },
  { id: 'client-3', name: 'Synergy Corp', logoUrl: imageMap.get('client-logo-1')?.imageUrl ?? '' },
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

export const formatSpecs = [
    { platform: 'Meta/IG', name: 'Feed 1:1', spec: '1440x1440' },
    { platform: 'Meta/IG', name: 'Feed 4:5', spec: '1440x1800' },
    { platform: 'Meta/IG', name: 'Stories/Reels 9:16', spec: '1080x1920' },
    { platform: 'Meta/IG', name: 'Carrusel 1:1', spec: '1080x1080' },
    { platform: 'Google Ads', name: 'Landscape 1.91:1', spec: '1200x628' },
    { platform: 'Google Ads', name: 'Square 1:1', spec: '1200x1200' },
    { platform: 'Google Ads', name: 'Vertical 4:5', spec: '960x1200' },
    { platform: 'Google Ads', name: 'Logo 1:1', spec: '1200x1200' },
    { platform: 'Google Ads', name: 'Logo 4:1', spec: '1200x300' },
    { platform: 'Google Ads', name: 'Banner 300x250', spec: '300x250' },
    { platform: 'Google Ads', name: 'Banner 728x90', spec: '728x90' },
    { platform: 'TikTok', name: 'In-Feed 9:16', spec: '1080x1920' },
    { platform: 'TikTok', name: 'Thumbnail 1:1', spec: '1080x1080' },
];
