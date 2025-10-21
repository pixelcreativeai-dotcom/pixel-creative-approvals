'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

const AUTH_PAGES = ['/login', '/signup'];
const DASHBOARD_ROOT = '/campaigns';

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (isUserLoading) {
      return; // Espera a que se determine el estado de autenticación
    }

    const isAuthPage = AUTH_PAGES.includes(pathname);

    if (user && isAuthPage) {
      // Si el usuario está logueado y en una página de autenticación, redirige al panel
      router.push(DASHBOARD_ROOT);
    } else if (!user && !isAuthPage) {
      // Si el usuario no está logueado y no está en una página de autenticación, redirige al login
      router.push('/login');
    }
  }, [user, isUserLoading, pathname, router]);

  // Muestra un loader a pantalla completa mientras se comprueba el estado
  if (isUserLoading) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    )
  }

  // Permite renderizar la página si el hook no necesita redirigir
  return null;
}
