import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockClients } from '@/lib/data';

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Clientes</h1>
        <Button>
          <PlusCircle />
          <span>Nuevo Cliente</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Todos los Clientes</CardTitle>
            <CardDescription>Gestiona los clientes de tu agencia.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Logo</span>
                    </TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockClients.map(client => (
                    <TableRow key={client.id}>
                        <TableCell className="hidden sm:table-cell">
                            <Image
                                alt={`${client.name} logo`}
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                src={client.logoUrl}
                                width="64"
                                data-ai-hint="client logo"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                            <Link href={`/clients/${client.id}`} className="hover:underline">
                                {client.name}
                            </Link>
                        </TableCell>
                        <TableCell>{client.contactName}</TableCell>
                        <TableCell className="hidden md:table-cell">{client.contactEmail}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
