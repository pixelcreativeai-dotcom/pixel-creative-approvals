'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FolderKanban,
  LogOut,
  Settings,
  Users,
  Wrench,
  Loader2,
} from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PixelCreativeLogo } from '@/components/icons';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const handleLogout = () => {
    auth.signOut();
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const userAvatar = user?.photoURL || PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl;
  const userName = user?.displayName || user?.email || 'Usuario';
  const userEmail = user?.email || 'cargando...';
  const userFallback = userName?.slice(0, 2).toUpperCase() || 'U';

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/campaigns" className="flex items-center gap-2">
          <PixelCreativeLogo className="size-8 text-primary" />
          <span className="font-headline text-lg font-semibold">
            Pixel Creative
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/campaigns')}
              tooltip="Campañas"
            >
              <Link href="/campaigns">
                <FolderKanban />
                <span>Campañas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/clients')}
              tooltip="Clientes"
            >
              <Link href="/clients">
                <Users />
                <span>Clientes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/tools')}
              tooltip="Herramientas"
            >
              <Link href="/tools">
                <Wrench />
                <span>Herramientas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex-1 flex items-center gap-3 cursor-pointer">
                {isUserLoading ? (
                    <Loader2 className="size-9 animate-spin" />
                ) : (
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback>{userFallback}</AvatarFallback>
                    </Avatar>
                )}
                <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Ajustes</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden pt-4">
          © {new Date().getFullYear()} Pixel Creative Agency
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
