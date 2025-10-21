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

type ValidationResult = {
  isValid: boolean;
  message: string;
};

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

const getFileDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        reject(new Error('No se pudieron leer las dimensiones de la imagen.'));
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
        URL.revokeObjectURL(url);
      };
      video.onerror = () => {
        reject(new Error('No se pudieron leer las dimensiones del video.'));
        URL.revokeObjectURL(url);
      };
      video.src = url;
    } else {
      reject(new Error('Tipo de archivo no soportado para obtener dimensiones.'));
    }
  });
};

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});


export function NewVariationForm({ creative, onFormSubmit }: NewVariationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const { toast } = useToast();
  
  const form = useForm<NewVariationFormValues>({
    resolver: zodResolver(newVariationSchema),
  });

  const selectedFormatKey = form.watch('formatKey');
  const uploadedFile = form.watch('asset');

  const validateFile = async (file: File, formatKey: string): Promise<ValidationResult> => {
    const spec = formatSpecs.find(s => s.name === formatKey);
    if (!spec) {
      return { isValid: false, message: 'Especificación de formato no encontrada.' };
    }

    // 1. Validar tamaño máximo
    if (spec.maxSizeKB && file.size > spec.maxSizeKB * 1024) {
      return { isValid: false, message: `El archivo es demasiado grande. Máximo: ${spec.maxSizeKB} KB, actual: ${(file.size / 1024).toFixed(2)} KB.` };
    }

    try {
      // 2. Validar dimensiones y aspect ratio
      const { width, height } = await getFileDimensions(file);
      const idealWidth = parseInt(spec.ideal.split('x')[0], 10);
      const idealHeight = parseInt(spec.ideal.split('x')[1], 10);
      
      const fileRatio = (width / height).toFixed(2);
      const specRatioParts = spec.ratio.split(':');
      const specRatio = (parseInt(specRatioParts[0], 10) / parseInt(specRatioParts[1], 10)).toFixed(2);

      if (width !== idealWidth || height !== idealHeight) {
          return { isValid: false, message: `Dimensiones incorrectas. Esperado: ${spec.ideal}, actual: ${width}x${height}.`};
      }
      
      if (fileRatio !== specRatio) {
          return { isValid: false, message: `Aspect ratio incorrecto. Esperado: ${spec.ratio} (~${specRatio}), actual: ~${fileRatio}.`};
      }

      return { isValid: true, message: 'El asset cumple con las especificaciones.' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al validar el archivo.';
      return { isValid: false, message };
    }
  };

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
    const result = await validateFile(file, formatKey);
    setValidationResult(result);
    setIsLoading(false);

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
    if (!validationResult || !validationResult.isValid) {
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
                        onClick={(e) => { if (!selectedFormatKey) e.preventDefault(); }}
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
                <span>Validando asset...</span>
             </div>
        )}

        {validationResult && (
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
                                <AlertDescription>
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
            <Button type="submit" disabled={isLoading || !validationResult?.isValid}>
              Crear Variación
            </Button>
        </div>
      </form>
    </Form>
  );
}

    