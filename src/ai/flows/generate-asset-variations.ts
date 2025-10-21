'use server';

/**
 * @fileOverview An AI agent that generates different variations of a base creative asset optimized for different platforms.
 *
 * - generateAssetVariations - A function that handles the generation of asset variations.
 * - GenerateAssetVariationsInput - The input type for the generateAssetVariations function.
 * - GenerateAssetVariationsOutput - The return type for the generateAssetVariations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAssetVariationsInputSchema = z.object({
  baseAssetDataUri: z
    .string()
    .describe(
      "A base creative asset (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  platform: z
    .string()
    .describe('The target platform for the asset variation (e.g., Instagram, Google Ads, TikTok).'),
  formatSpecifications: z.string().describe('The specific format requirements for the platform (e.g., dimensions, aspect ratio, file size).'),
  instructions: z.string().optional().describe('Additional instructions for the AI to generate creative variations.'),
});
export type GenerateAssetVariationsInput = z.infer<typeof GenerateAssetVariationsInputSchema>;

const GenerateAssetVariationsOutputSchema = z.object({
  assetVariationDataUri: z
    .string()
    .describe("The generated asset variation as a data URI that includes a MIME type and uses Base64 encoding."),
  validationResult: z.string().describe('The result of the validation against the format specifications.'),
});

export type GenerateAssetVariationsOutput = z.infer<typeof GenerateAssetVariationsOutputSchema>;

export async function generateAssetVariations(input: GenerateAssetVariationsInput): Promise<GenerateAssetVariationsOutput> {
  return generateAssetVariationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAssetVariationsPrompt',
  input: {schema: GenerateAssetVariationsInputSchema},
  output: {schema: GenerateAssetVariationsOutputSchema},
  prompt: `You are an AI-powered creative assistant that generates variations of a base asset for different platforms.

You will receive a base asset, the target platform, format specifications, and additional instructions. Your goal is to generate an asset variation that is optimized for the specified platform and meets the format specifications.

Base Asset: {{media url=baseAssetDataUri}}
Platform: {{{platform}}}
Format Specifications: {{{formatSpecifications}}}
Instructions: {{{instructions}}}

Ensure that the generated asset variation adheres to the format specifications. Return the asset variation as a data URI and include a validation result.
`,
});

const generateAssetVariationsFlow = ai.defineFlow(
  {
    name: 'generateAssetVariationsFlow',
    inputSchema: GenerateAssetVariationsInputSchema,
    outputSchema: GenerateAssetVariationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
