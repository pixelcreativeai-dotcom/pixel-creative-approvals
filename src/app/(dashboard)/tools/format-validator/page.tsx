'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { CheckCircle2, AlertCircle, UploadCloud, X, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatSpecs } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { suggestCreativeCropping, type SuggestCreativeCroppingInput } from '@/ai/flows/suggest-creative-cropping';

type ValidationResult = {
  isValid: boolean;
  message: string;
};

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


export default function FormatValidatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    if (fileRejections.length > 0) {
        toast({
            variant: "destructive",
            title: "Archivo no válido",
            description: "Por favor, sube un archivo de imagen (JPG, PNG, WebP) o video (MP4).",
        });
        return;
    }

    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setValidationResults(null);
      setSuggestions({});
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'video/mp4': [],
    },
    maxFiles: 1,
    maxSize: 200 * 1024 * 1024, // 200MB
  });

  const handleFormatChange = (specName: string) => {
    setSelectedFormats(prev =>
      prev.includes(specName)
        ? prev.filter(f => f !== specName)
        : [...prev, specName]
    );
    setValidationResults(null);
    setSuggestions({});
  };
  
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

  const handleValidate = async () => {
    if (!file || selectedFormats.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Faltan datos',
        description: 'Por favor, sube un archivo y selecciona al menos un formato para validar.',
      });
      return;
    }
    
    setIsLoading(true);
    setValidationResults(null);
    setSuggestions({});

    const results: Record<string, ValidationResult> = {};
    for (const formatName of selectedFormats) {
        results[formatName] = await validateFile(file, formatName);
    }
    
    setValidationResults(results);
    setIsLoading(false);
  };

  const handleGetSuggestion = async (formatName: string) => {
    if (!file) return;

    setIsSuggesting(true);
    try {
        const assetDataUri = await toBase64(file);
        const formatSpec = formatSpecs.find(f => f.name === formatName);
        if (!formatSpec) return;

        const input: SuggestCreativeCroppingInput = {
            assetDataUri,
            formatSpecs: `${formatSpec.platform}: ${formatSpec.name} ${formatSpec.spec}`
        };

        const response = await suggestCreativeCropping(input);
        setSuggestions(prev => ({...prev, [formatName]: response.suggestions}));
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

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setValidationResults(null);
    setSelectedFormats([]);
    setSuggestions({});
  };

  const platforms = useMemo(() => [...new Set(formatSpecs.map(s => s.platform))], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Asset a Validar</CardTitle>
        </CardHeader>
        <CardContent>
          {preview ? (
            <div className="relative group">
                {file?.type.startsWith('video/') ? (
                    <video src={preview} controls className="w-full rounded-lg aspect-video object-contain bg-gray-100 dark:bg-gray-900" />
                ) : (
                    <Image
                        src={preview}
                        alt="Preview"
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg aspect-video object-contain bg-gray-100 dark:bg-gray-900"
                        data-ai-hint="creative asset"
                    />
                )}
                <Button variant="destructive" size="icon" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={clearFile}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Quitar archivo</span>
                </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={cn(
                'flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors',
                isDragActive ? 'border-primary bg-accent' : 'border-border'
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-center text-muted-foreground">
                {isDragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra y suelta un archivo, o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max 30MB), MP4 (max 200MB)</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Formatos a Validar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {platforms.map(platform => (
              <div key={platform}>
                <h4 className="font-semibold text-sm mb-2 font-headline">{platform}</h4>
                <div className="space-y-2 pl-2">
                  {formatSpecs.filter(s => s.platform === platform).map(spec => (
                    <div key={spec.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec.name}
                        checked={selectedFormats.includes(spec.name)}
                        onCheckedChange={() => handleFormatChange(spec.name)}
                        disabled={!file}
                      />
                      <Label htmlFor={spec.name} className="flex-1 text-sm font-normal">
                        {spec.name} <span className="text-muted-foreground">({spec.spec})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleValidate} disabled={!file || selectedFormats.length === 0 || isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validando...
            </>
          ) : 'Validar Asset'}
        </Button>

        {validationResults && (
            <Card>
                 <CardHeader>
                    <CardTitle>Resultados de la Validación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {Object.entries(validationResults).map(([format, result]) => (
                    <div key={format}>
                        <Alert variant={result.isValid ? 'default' : 'destructive'}>
                            {result.isValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle className="font-headline">{format}</AlertTitle>
                            <AlertDescription>{result.message || (result.isValid ? 'El asset cumple con las especificaciones.' : 'No se pudo validar.')}</AlertDescription>
                        </Alert>
                        {!result.isValid && (
                            <div className="mt-2 text-right">
                                {suggestions[format] ? (
                                     <Alert className="mt-2 text-left bg-background">
                                        <Sparkles className="h-4 w-4" />
                                        <AlertTitle>Sugerencia IA</AlertTitle>
                                        <AlertDescription>
                                            {suggestions[format]}
                                        </AlertDescription>
                                    </Alert>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleGetSuggestion(format)} disabled={isSuggesting}>
                                        {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                        Obtener Sugerencia IA
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

    