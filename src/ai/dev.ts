import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-creative-cropping.ts';
import '@/ai/flows/generate-asset-variations.ts';
import '@/ai/flows/validate-asset-specifications.ts';
