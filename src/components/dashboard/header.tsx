'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Bell,
  Home,
  PanelLeft,
  Search,
  Settings,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useSidebar, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './sidebar';
import { mockClients, mockCampaigns, mockCreatives } from '@/lib/data';

function BreadcrumbResponsive() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    const segmentToSpanish: { [key: string]: string } = {
        'campaigns': 'Campañas',
        'clients': 'Clientes',
        'creatives': 'Creativos',
        'tools': 'Herramientas',
        'format-validator': 'Validador de Formatos',
    }

    return (
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/campaigns">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join('/')}`;
              const isLast = index === segments.length - 1;
              
              let name = segmentToSpanish[segment] || segment;
              
              if (segments[index-1] === 'clients' && !segmentToSpanish[segment]) {
                const client = mockClients.find(c => c.id === segment);
                if(client) name = client.name;
              } else if (segments[index-1] === 'campaigns' && !segmentToSpanish[segment]) {
                const campaign = mockCampaigns.find(c => c.id === segment);
                if(campaign) name = campaign.name;
              } else if (segments[index-1] === 'creatives' && !segmentToSpanish[segment]) {
                const creative = mockCreatives.find(c => c.id === segment);
                if(creative) name = creative.title;
              }


              return (
                  <React.Fragment key={href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className="font-headline">{name}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link href={href}>{name}</Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                  </React.Fragment>
              )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
}


export function DashboardHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs p-0">
               <DashboardSidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <SidebarTrigger />
        )}
      <BreadcrumbResponsive />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notificaciones</span>
      </Button>
    </header>
  );
}
