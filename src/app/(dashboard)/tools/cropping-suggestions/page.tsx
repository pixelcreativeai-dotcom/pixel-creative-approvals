
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { suggestCreativeCropping, type SuggestCreativeCroppingInput, type SuggestCreativeCroppingOutput } from '@/ai/flows/suggest-creative-cropping';

export default function CroppingSuggestionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formatSpecs, setFormatSpecs] = useState('Meta/IG: Feed 1:1 (1440x1440), Stories/Reels 9:16 (1080x1920)');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const { toast } = useToast();

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const droppedFile = acceptedFiles[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setSuggestion(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'video/mp4': [],
    },
    maxFiles: 1,
  });

  const handleGetSuggestion = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Falta archivo',
        description: 'Por favor, sube un archivo para obtener sugerencias.',
      });
      return;
    }
    
    setIsLoading(true);
    setSuggestion(null);

    try {
      const assetDataUri = await toBase64(file);
      const input: SuggestCreativeCroppingInput = {
        assetDataUri,
        formatSpecs,
      };

      const response: SuggestCreativeCroppingOutput = await suggestCreativeCropping(input);
      setSuggestion(response.suggestions);

    } catch (error) {
        console.error("Suggestion error:", error);
        toast({
            variant: "destructive",
            title: "Error de Sugerencia",
            description: "No se pudo obtener la sugerencia de la IA. Inténtalo de nuevo.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setSuggestion(null);
  };

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-semibold">Sugerencias de Recorte (IA)</h1>
            <p className="text-muted-foreground">
            Sube un asset y describe los formatos que necesitas para recibir sugerencias de la IA.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Tu Asset</CardTitle>
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
                        {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic para seleccionar'}
                    </p>
                    </div>
                )}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Formatos Requeridos</CardTitle>
                        <CardDescription>
                            Describe los formatos para los que necesitas adaptar el asset.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="format-specs">Especificaciones de Formato</Label>
                            <Textarea
                                id="format-specs"
                                value={formatSpecs}
                                onChange={(e) => setFormatSpecs(e.target.value)}
                                placeholder="Ej: Meta/IG: Feed 1:1 (1440x1440), Stories/Reels 9:16 (1080x1920)..."
                                className="h-24"
                                disabled={!file}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Button onClick={handleGetSuggestion} disabled={!file || isLoading} className="w-full">
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Obtener Sugerencias</>
                )}
                </Button>

                {suggestion && (
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>Sugerencias de la IA</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">
                            {suggestion}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    </div>
  );
}

