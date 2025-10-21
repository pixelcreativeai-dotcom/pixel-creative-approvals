'use server';
/**
 * @fileOverview AI-powered asset validation flow that checks if images and videos meet format specifications.
 *
 * - validateAsset - Validates an asset against predefined format specifications.
 * - ValidateAssetInput - The input type for the validateAsset function.
 * - ValidateAssetOutput - The return type for the validateAsset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormatSpecSchema = z.object({
  name: z.string().describe('The name of the format specification.'),
  width: z.number().describe('The required width of the asset in pixels.'),
  height: z.number().describe('The required height of the asset in pixels.'),
  ratio: z.string().describe('The required aspect ratio of the asset (e.g., "1:1", "9:16").'),
  maxSizeKB: z.number().describe('The maximum allowed size of the asset in kilobytes.'),
});

const ValidateAssetInputSchema = z.object({
  assetDataUri: z
    .string()
    .describe(
      'The asset (image/video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' + 
      ' Images must be JPG/PNG/WebP and videos must be MP4/H.264.'
    ),
  assetSizeBytes: z.number().describe('The size of the asset in bytes.'),
  formatSpecs: z.array(FormatSpecSchema).describe('An array of format specifications to validate against.'),
});
export type ValidateAssetInput = z.infer<typeof ValidateAssetInputSchema>;

const ValidationResultSchema = z.object({
  isValid: z.boolean().describe('Whether the asset is valid according to the format specification.'),
  message: z.string().describe('A message indicating the validation result. Empty string if valid.'),
});

const ValidateAssetOutputSchema = z.object({
  results: z.record(ValidationResultSchema).describe('A map of format specification names to validation results.'),
});
export type ValidateAssetOutput = z.infer<typeof ValidateAssetOutputSchema>;

export async function validateAsset(input: ValidateAssetInput): Promise<ValidateAssetOutput> {
  return validateAssetFlow(input);
}

const validateAssetPrompt = ai.definePrompt({
  name: 'validateAssetPrompt',
  input: {schema: ValidateAssetInputSchema},
  output: {schema: ValidateAssetOutputSchema},
  prompt: `You are an expert creative asset validator.

You will receive an asset (image or video) and a set of format specifications.
Your task is to validate the asset against each format specification and determine if it meets the requirements.

For each format specification, you must check:
- If the asset's dimensions match the required width and height.
- If the asset's aspect ratio matches the required ratio.
- If the asset's size is within the maximum allowed size.

Return a JSON object with a validation result for each format specification.

Asset Data URI: {{{assetDataUri}}}
Asset Size (bytes): {{{assetSizeBytes}}}
Format Specifications:
{{#each formatSpecs}}
  Name: {{{name}}}
  Width: {{{width}}}px
  Height: {{{height}}}px
  Ratio: {{{ratio}}}
  Max Size: {{{maxSizeKB}}} KB
{{/each}}

Output Format: A JSON object where keys are the names from FormatSpecs and the values are of this type: { isValid: boolean, message: string }.
isValid should be false if any of the checks fail, and true otherwise.
message should be a human-readable message indicating which check(s) failed. If the asset is valid, the message should be an empty string.
`,
});

const validateAssetFlow = ai.defineFlow(
  {
    name: 'validateAssetFlow',
    inputSchema: ValidateAssetInputSchema,
    outputSchema: ValidateAssetOutputSchema,
  },
  async input => {
    const results: Record<string, { isValid: boolean; message: string }> = {};

    for (const spec of input.formatSpecs) {
      let isValid = true;
      let message = '';

      // Placeholder validations - replace with actual asset dimension/ratio extraction and size check
      // For now, let's assume the AI can determine this accurately from the data URI.
      // Example: if (assetWidth !== spec.width) { isValid = false; message += 'Width does not match. '; }

      if (input.assetSizeBytes > spec.maxSizeKB * 1024) {
        isValid = false;
        message += `Asset exceeds maximum size of ${spec.maxSizeKB} KB. `; 
      }

      results[spec.name] = { isValid, message };
    }

    return {results: results};
  }
);
