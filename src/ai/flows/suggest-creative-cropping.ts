'use server';

/**
 * @fileOverview AI-powered suggestion for optimal cropping and resizing of creative assets.
 *
 * - suggestCreativeCropping - A function that suggests optimal cropping and resizing options for creative assets.
 * - SuggestCreativeCroppingInput - The input type for the suggestCreativeCropping function.
 * - SuggestCreativeCroppingOutput - The return type for the suggestCreativeCropping function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCreativeCroppingInputSchema = z.object({
  assetDataUri: z
    .string()
    .describe(
      "The creative asset (image/video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  formatSpecs: z
    .string()
    .describe(
      'The format specifications to adhere to, described as a string. E.g., Meta/IG: Feed 1:1 (1440x1440), Stories/Reels 9:16 (1080x1920).'
    ),
});
export type SuggestCreativeCroppingInput = z.infer<typeof SuggestCreativeCroppingInputSchema>;

const SuggestCreativeCroppingOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'AI-powered suggestions for optimal cropping and resizing to fit the format specifications.'
    ),
});
export type SuggestCreativeCroppingOutput = z.infer<typeof SuggestCreativeCroppingOutputSchema>;

export async function suggestCreativeCropping(
  input: SuggestCreativeCroppingInput
): Promise<SuggestCreativeCroppingOutput> {
  return suggestCreativeCroppingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCreativeCroppingPrompt',
  input: {schema: SuggestCreativeCroppingInputSchema},
  output: {schema: SuggestCreativeCroppingOutputSchema},
  prompt: `You are an expert creative asset optimizer. Given an asset and a set of format specifications, you will provide suggestions for optimal cropping and resizing.

Asset: {{media url=assetDataUri}}
Format Specifications: {{{formatSpecs}}}

Provide clear and concise suggestions for cropping and resizing the asset to best fit the format specifications.`, // Added media support
});

const suggestCreativeCroppingFlow = ai.defineFlow(
  {
    name: 'suggestCreativeCroppingFlow',
    inputSchema: SuggestCreativeCroppingInputSchema,
    outputSchema: SuggestCreativeCroppingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
