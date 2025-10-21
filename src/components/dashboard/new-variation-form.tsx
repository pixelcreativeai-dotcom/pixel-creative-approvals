
'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Creative, formatSpecs } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
  FormField,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, UploadCloud, FileCheck2, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { validateAsset, type ValidateAssetInput, type ValidateAssetOutput } from '@/ai/flows/validate-asset-specifications';
import { suggestCreativeCropping, type SuggestCreativeCroppingInput } from '@/ai/flows/suggest-creative-cropping';

const newVariationSchema = z.object({
  formatKey: z.string().min(1, 'Debes seleccionar un formato.'),
  asset: z
    .instanceof(File)
    .refine(file => file.size > 0, 'Debes subir un archivo.'),
});

type NewVariationFormValues = z.infer<typeof newVariationSchema>;

interface NewVariationFormProps {
  creative: Creative;
  onFormSubmit: () => void;
}

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});


export function NewVariationForm({ creative, onFormSubmit }: NewVariationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidateAssetOutput['results'] | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const { toast } = useToast();
  
  const form = useForm<NewVariationFormValues>({
    resolver: zodResolver(newVariationSchema),
  });

  const selectedFormatKey = form.watch('formatKey');
  const uploadedFile = form.watch('asset');

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) return;
    form.setValue('asset', file, { shouldValidate: true });
    setValidationResult(null);
    setSuggestion(null);

    const formatKey = form.getValues('formatKey');
    if (!formatKey) {
        toast({ variant: 'destructive', title: 'Selecciona un formato primero', description: 'Debes elegir un formato antes de subir un archivo para validarlo.'});
        form.resetField('asset');
        return;
    }

    setIsLoading(true);
    try {
        const spec = formatSpecs.find(s => s.name === formatKey);
        if (!spec) {
            setValidationResult({[formatKey]: { isValid: false, message: 'Especificación no encontrada.' }});
            return;
        }

        const assetDataUri = await toBase64(file);
        const input: ValidateAssetInput = {
            assetDataUri,
            assetSizeBytes: file.size,
            formatSpecs: [{
                name: spec.name,
                width: parseInt(spec.ideal.split('x')[0]),
                height: parseInt(spec.ideal.split('x')[1]),
                ratio: spec.ratio,
                maxSizeKB: spec.maxSizeKB || 5120
            }]
        };

        const response = await validateAsset(input);
        setValidationResult(response.results);
    } catch (error) {
        console.error("Validation error:", error);
        toast({
            variant: "destructive",
            title: "Error de Validación IA",
            description: "No se pudo validar el asset. Por favor, intenta de nuevo.",
        });
    } finally {
        setIsLoading(false);
    }

  }, [form, toast]);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  }, [handleFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.jpeg', '.png', '.webp'], 'video/*': ['.mp4'] }
  });


  const handleGetSuggestion = async () => {
    if (!uploadedFile || !selectedFormatKey) return;

    setIsSuggesting(true);
    setSuggestion(null);
    try {
        const assetDataUri = await toBase64(uploadedFile);
        const formatSpec = formatSpecs.find(f => f.name === selectedFormatKey);
        if (!formatSpec) return;

        const input: SuggestCreativeCroppingInput = {
            assetDataUri,
            formatSpecs: `${formatSpec.platform}: ${formatSpec.name} ${formatSpec.spec}`
        };

        const response = await suggestCreativeCropping(input);
        setSuggestion(response.suggestions);

    } catch (error) {
        console.error("Suggestion error:", error);
        toast({
            variant: "destructive",
            title: "Error de Sugerencia",
            description: "No se pudo obtener la sugerencia de la IA.",
        });
    } finally {
        setIsSuggesting(false);
    }
  }


  const onSubmit = async (data: NewVariationFormValues) => {
    const result = validationResult ? validationResult[data.formatKey] : null;

    if (!result || !result.isValid) {
      toast({ variant: 'destructive', title: 'Asset no válido', description: 'El archivo no cumple con las especificaciones del formato seleccionado.'});
      return;
    }
    
    setIsLoading(true);
    console.log('Submitting validated data:', data);
    
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

  const currentValidation = validationResult && selectedFormatKey ? validationResult[selectedFormatKey] : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="formatKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
                <Select onValueChange={(value) => { field.onChange(value); setValidationResult(null); form.resetField('asset'); }} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="1. Selecciona un formato..." />
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="asset"
          render={() => (
            <FormItem>
                <FormLabel>Asset</FormLabel>
                <FormControl>
                    <div
                        {...getRootProps()}
                        className={cn(
                            'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors',
                            isDragActive && 'border-primary bg-accent',
                            !selectedFormatKey && 'cursor-not-allowed opacity-50',
                            uploadedFile && 'p-4'
                        )}
                    >
                        <input {...getInputProps()} disabled={!selectedFormatKey} />
                        {uploadedFile ? (
                           <div className="text-center text-sm">
                               <p className="font-semibold">{uploadedFile.name}</p>
                               <p className="text-muted-foreground">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                           </div>
                        ) : (
                            <>
                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                                <p className="mt-2 text-center text-muted-foreground text-sm">
                                {isDragActive ? 'Suelta el archivo aquí' : '2. Arrastra un archivo o haz clic'}
                                </p>
                            </>
                        )}
                    </div>
                </FormControl>
                <FormMessage {...form.getFieldState('asset')} />
            </FormItem>
          )}
        />
        
        {isLoading && (
             <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Validando asset con IA...</span>
             </div>
        )}

        {currentValidation && (
            <Alert variant={currentValidation.isValid ? 'default' : 'destructive'}>
                {currentValidation.isValid ? <FileCheck2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{currentValidation.isValid ? 'Validación Exitosa' : 'Validación Fallida'}</AlertTitle>
                <AlertDescription>
                    {currentValidation.message}
                </AlertDescription>
                 {!currentValidation.isValid && (
                    <div className="mt-4">
                        {suggestion ? (
                             <Alert className="mt-2 text-left bg-background">
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>Sugerencia IA</AlertTitle>
                                <AlertDescription className="whitespace-pre-wrap">
                                    {suggestion}
                                </AlertDescription>
                            </Alert>
                        ) : (
                             <Button size="sm" type="button" variant="outline" onClick={handleGetSuggestion} disabled={isSuggesting}>
                                {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Obtener Sugerencia IA
                            </Button>
                        )}
                    </div>
                )}
            </Alert>
        )}

        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancelar</Button>
            <Button type="submit" disabled={isLoading || !currentValidation?.isValid}>
              Crear Variación
            </Button>
        </div>
      </form>
    </Form>
  );
}
