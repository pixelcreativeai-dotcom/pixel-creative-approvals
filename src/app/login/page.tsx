'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuthRedirect } from '@/hooks/use-auth-redirect.tsx';
import { PixelCreativeLogo } from '@/components/icons';

const loginSchema = z.object({
  email: z.string().email('Por favor, introduce un correo electrónico válido.'),
  password: z.string().min(1, 'Por favor, introduce tu contraseña.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  useAuthRedirect();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // El rediccionamiento es manejado por el hook useAuthRedirect
      toast({
        title: '¡Bienvenido de nuevo!',
        description: 'Has iniciado sesión correctamente.',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: error.message || 'Hubo un problema con tus credenciales. Por favor, intenta de nuevo.',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 flex items-center gap-2">
            <PixelCreativeLogo className="size-8 text-primary" />
            <span className="font-headline text-lg font-semibold">
                Pixel Creative
            </span>
        </div>
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                <CardDescription>
                Introduce tu correo electrónico para acceder a tu cuenta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                            <Input placeholder="nombre@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar Sesión
                    </Button>
                </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="underline">
                    Regístrate
                </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
