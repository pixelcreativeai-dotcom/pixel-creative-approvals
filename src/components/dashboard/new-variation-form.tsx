'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Creative, formatSpecs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const newVariationSchema = z.object({
  formatKey: z.string().min(1, 'Debes seleccionar un formato.'),
  // We'll add fields for asset upload and copy later
});

type NewVariationFormValues = z.infer<typeof newVariationSchema>;

interface NewVariationFormProps {
  creative: Creative;
  onFormSubmit: () => void;
}

export function NewVariationForm({ creative, onFormSubmit }: NewVariationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<NewVariationFormValues>({
    resolver: zodResolver(newVariationSchema),
    defaultValues: {
      formatKey: '',
    },
  });

  const onSubmit = async (data: NewVariationFormValues) => {
    setIsLoading(true);
    console.log('Form data:', data);
    
    // Here we would handle the asset upload and variation creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
        title: 'Variación Creada (Simulado)',
        description: `Se ha iniciado la creación de la variación para el formato ${data.formatKey}.`,
    });
    
    setIsLoading(false);
    onFormSubmit();
  };

  const relevantFormats = formatSpecs.filter(spec => 
    spec.platform.toLowerCase().includes(creative.platform.toLowerCase()) || spec.platform.includes('Meta')
  );


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="formatKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un formato para la variación..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {relevantFormats.map(spec => (
                            <SelectItem key={spec.name} value={spec.name}>
                                {spec.platform} - {spec.name} ({spec.spec})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              <FormDescription>
                Elige el formato y las especificaciones para esta nueva variación.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Asset uploader and copy fields will go here */}

        <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancelar</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Siguiente
            </Button>
        </div>
      </form>
    </Form>
  );
}
