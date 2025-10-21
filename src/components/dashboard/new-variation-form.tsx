
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Creative, formatSpecs, type Variation } from '@/lib/data';
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
import { suggestCreativeCropping, type SuggestCreativeCroppingInput } from '@/ai/flows/suggest-creative-cropping';

const newVariationSchema = z.object({
  formatKey: z.string().min(1, 'Debes seleccionar un formato.'),
  asset: z
    .instanceof(File)
    .refine(file => file.size > 0, 'Debes subir un archivo.'),
});

type NewVariationFormValues = z.infer<typeof newVariationSchema>;

interface ValidationResult {
    isValid: boolean;
    message: string;
    width?: number;
    height?: number;
    sizeKB?: number;
    aspectRatio?: string;
}

interface NewVariationFormProps {
  creative: Creative;
  onFormSubmit: (newVariation: Variation) => void;
}

const getAssetDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.onload = () => resolve({ width: img.width, height: img.height });
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.onloadedmetadata = () => {
                resolve({ width: video.videoWidth, height: video.videoHeight });
            };
            video.onerror = reject;
            video.src = URL.createObjectURL(file);
        } else {
            reject(new Error('Tipo de archivo no soportado para obtener dimensiones.'));
        }
    });
};


export function NewVariationForm({ creative, onFormSubmit }: NewVariationFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
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

    setIsProcessing(true);
    try {
        const spec = formatSpecs.find(s => s.name === formatKey);
        if (!spec) {
            setValidationResult({ isValid: false, message: 'Especificación no encontrada.' });
            return;
        }

        const { width, height } = await getAssetDimensions(file);
        const sizeKB = file.size / 1024;
        const assetAspectRatio = (width / height).toFixed(2);
        
        const specRatioValue = eval(spec.ratio.replace(':', '/')).toFixed(2);
        const [specWidth, specHeight] = spec.ideal.split('x').map(Number);
        
        let isValid = true;
        let message = 'El asset cumple con las especificaciones.';

        if (width !== specWidth || height !== specHeight) {
            isValid = false;
            message = `Dimensiones no coinciden. Esperado: ${spec.ideal}, actual: ${width}x${height}.`;
        } else if (assetAspectRatio !== specRatioValue) {
            isValid = false;
            message = `Aspect ratio no coincide. Esperado: ${spec.ratio}, actual: ~${assetAspectRatio}:1.`;
        } else if (spec.maxSizeKB && sizeKB > spec.maxSizeKB) {
            isValid = false;
            message = `El archivo es muy pesado. Máximo: ${spec.maxSizeKB} KB, actual: ${sizeKB.toFixed(0)} KB.`;
        }
        
        setValidationResult({ isValid, message, width, height, sizeKB, aspectRatio: assetAspectRatio });

    } catch (error) {
        console.error("Validation error:", error);
        toast({
            variant: "destructive",
            title: "Error de Validación",
            description: "No se pudo validar el asset localmente. Por favor, intenta de nuevo.",
        });
        setValidationResult({ isValid: false, message: 'Error al procesar el archivo.' });
    } finally {
        setIsProcessing(false);
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
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'video/mp4': [] }
  });


  const handleGetSuggestion = async () => {
    if (!uploadedFile || !selectedFormatKey) return;

    setIsSuggesting(true);
    setSuggestion(null);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);
        reader.onloadend = async () => {
            const base64data = reader.result as string;

            const formatSpec = formatSpecs.find(f => f.name === selectedFormatKey);
            if (!formatSpec) return;

            const input: SuggestCreativeCroppingInput = {
                assetDataUri: base64data,
                formatSpecs: `${formatSpec.platform}: ${formatSpec.name} ${formatSpec.spec}`
            };

            const response = await suggestCreativeCropping(input);
            setSuggestion(response.suggestions);
        }
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


  const onSubmit = (data: NewVariationFormValues) => {
    if (!validationResult?.isValid) {
      toast({ variant: 'destructive', title: 'Asset no válido', description: 'El archivo no cumple con las especificaciones del formato seleccionado.'});
      return;
    }
    
    // Create a new variation object
    const newVariation: Variation = {
      id: `var-${Date.now()}`,
      creativeId: creative.id,
      formatKey: data.formatKey,
      assetType: data.asset.type.startsWith('image') ? 'image' : 'video',
      assetUrl: URL.createObjectURL(data.asset),
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    
    toast({
        title: 'Variación Creada',
        description: `Se ha añadido la variación para el formato ${data.formatKey}.`,
    });
    
    onFormSubmit(newVariation);
  };
  
  useEffect(() => {
    // Reset file and validation when format changes
    form.resetField('asset');
    setValidationResult(null);
    setSuggestion(null);
  }, [selectedFormatKey, form]);


  const relevantFormats = formatSpecs.filter(spec => 
    spec.platform.toLowerCase().includes(creative.platform.toLowerCase()) || spec.platform.includes('Meta')
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="formatKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        
        {isProcessing && (
             <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Validando asset...</span>
             </div>
        )}

        {validationResult && !isProcessing && (
            <Alert variant={validationResult.isValid ? 'default' : 'destructive'}>
                {validationResult.isValid ? <FileCheck2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{validationResult.isValid ? 'Validación Exitosa' : 'Validación Fallida'}</AlertTitle>
                <AlertDescription>
                    {validationResult.message}
                </AlertDescription>
                 {!validationResult.isValid && (
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
            <Button type="button" variant="ghost" onClick={() => onFormSubmit(null as any)}>Cancelar</Button>
            <Button type="submit" disabled={isProcessing || !validationResult?.isValid}>
              Crear Variación
            </Button>
        </div>
      </form>
    </Form>
  );
}
