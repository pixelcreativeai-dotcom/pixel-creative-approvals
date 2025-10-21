
'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateAssetVariations, type GenerateAssetVariationsInput, type GenerateAssetVariationsOutput } from '@/ai/flows/generate-asset-variations';

export default function AssetGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [platform, setPlatform] = useState('Instagram');
  const [formatSpecs, setFormatSpecs] = useState('Stories/Reels 9:16 (1080x1920)');
  const [instructions, setInstructions] = useState('Adapt this asset to a vertical format. Make the colors more vibrant and add a subtle zoom effect.');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAsset, setGeneratedAsset] = useState<string | null>(null);
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
      setGeneratedAsset(null);
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

  const handleGenerateVariation = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Falta asset base',
        description: 'Por favor, sube un archivo para generar una variación.',
      });
      return;
    }
    
    setIsLoading(true);
    setGeneratedAsset(null);

    try {
      const baseAssetDataUri = await toBase64(file);
      const input: GenerateAssetVariationsInput = {
        baseAssetDataUri,
        platform,
        formatSpecifications: formatSpecs,
        instructions,
      };

      // TODO: Replace with a real call to the flow once the model supports image generation.
      // For now, we simulate a successful response by returning the same image.
      // const response: GenerateAssetVariationsOutput = await generateAssetVariations(input);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      const response: GenerateAssetVariationsOutput = {
        assetVariationDataUri: baseAssetDataUri,
        validationResult: 'Asset generated and validated successfully (simulated).',
      };

      setGeneratedAsset(response.assetVariationDataUri);
      toast({
        title: "Variación Generada",
        description: "La IA ha creado una nueva variación de tu asset."
      })

    } catch (error) {
        console.error("Generation error:", error);
        toast({
            variant: "destructive",
            title: "Error de Generación",
            description: "No se pudo generar la variación con la IA. Inténtalo de nuevo.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setGeneratedAsset(null);
  };

  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-headline text-3xl font-semibold">Generador de Variaciones (IA)</h1>
            <p className="text-muted-foreground">
                Sube un asset base, define el formato y las instrucciones, y deja que la IA genere una nueva variación.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                    <CardTitle>1. Asset Base</CardTitle>
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
                                    width={400}
                                    height={400}
                                    className="w-full h-auto rounded-lg aspect-video object-contain bg-gray-100 dark:bg-gray-900"
                                    data-ai-hint="base asset"
                                />
                            )}
                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={clearFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                        {...getRootProps()}
                        className={cn(
                            'flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors',
                            isDragActive ? 'border-primary bg-accent' : 'border-border'
                        )}
                        >
                        <input {...getInputProps()} />
                        <UploadCloud className="h-10 w-10 text-muted-foreground" />
                        <p className="mt-4 text-center text-muted-foreground text-sm">
                            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic'}
                        </p>
                        </div>
                    )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>2. Define la Variación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="platform">Plataforma</Label>
                            <Input id="platform" value={platform} onChange={e => setPlatform(e.target.value)} placeholder="Ej: Instagram, TikTok..." disabled={!file} />
                        </div>
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="format-specs">Especificaciones de Formato</Label>
                            <Input id="format-specs" value={formatSpecs} onChange={e => setFormatSpecs(e.target.value)} placeholder="Ej: Stories 9:16 (1080x1920)" disabled={!file} />
                        </div>
                         <div className="grid w-full gap-1.5">
                            <Label htmlFor="instructions">Instrucciones para la IA</Label>
                            <Textarea
                                id="instructions"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Ej: Hazlo más vibrante, enfócate en el producto..."
                                className="h-28"
                                disabled={!file}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Button onClick={handleGenerateVariation} disabled={!file || isLoading} className="w-full">
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                    ) : (
                        <><Sparkles className="mr-2 h-4 w-4" /> Generar Variación</>
                    )}
                </Button>
            </div>
            <div className="lg:col-span-2">
                <Card className="sticky top-4">
                     <CardHeader>
                        <CardTitle>3. Resultado Generado</CardTitle>
                        <CardDescription>
                            Aquí aparecerá la nueva variación generada por la IA.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {generatedAsset ? (
                             <Alert>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>¡Variación Lista!</AlertTitle>
                                <AlertDescription className="mb-4">
                                    La IA ha generado la siguiente variación. Puedes descargarla o solicitar otra.
                                </AlertDescription>
                                {file?.type.startsWith('video/') ? (
                                    <video src={generatedAsset} controls className="w-full rounded-lg mt-4" />
                                ) : (
                                    <Image
                                        src={generatedAsset}
                                        alt="Generated Asset"
                                        width={1080}
                                        height={1920}
                                        className="w-full h-auto rounded-lg mt-4 object-contain bg-gray-100 dark:bg-gray-900"
                                        data-ai-hint="generated asset"
                                    />
                                )}
                            </Alert>
                        ) : (
                             <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-center min-h-[400px]">
                                <p className="text-muted-foreground">
                                    { isLoading ? 'La IA está trabajando...' : 'El resultado aparecerá aquí.' }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
