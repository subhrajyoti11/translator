'use server';

/**
 * @fileOverview Retrains the translation model with new datasets to improve translation accuracy.
 *
 * - retrainTranslationModel - A function to retrain the translation model.
 * - RetrainTranslationModelInput - The input type for the retrainTranslationModel function.
 * - RetrainTranslationModelOutput - The return type for the retrainTranslationModel function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrainTranslationModelInputSchema = z.object({
  originalText: z.string().describe('The original text in Nepali or Sinhalese.'),
  translatedText: z.string().describe('The corresponding translated text in English.'),
});
export type RetrainTranslationModelInput = z.infer<typeof RetrainTranslationModelInputSchema>;

const RetrainTranslationModelOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the model retraining was successful.'),
  message: z.string().describe('A message indicating the retraining status.'),
});
export type RetrainTranslationModelOutput = z.infer<typeof RetrainTranslationModelOutputSchema>;

export async function retrainTranslationModel(
  input: RetrainTranslationModelInput
): Promise<RetrainTranslationModelOutput> {
  return retrainTranslationModelFlow(input);
}

const retrainTranslationModelTool = ai.defineTool(
  {
    name: 'retrainTranslationModelTool',
    description: 'Retrains the translation model with provided original and translated text pairs to improve accuracy.',
    inputSchema: RetrainTranslationModelInputSchema,
    outputSchema: z.object({
      success: z.boolean().describe('Indicates if the retraining data was successfully processed.'),
      message: z.string().describe('A message describing the result of the retraining attempt.'),
    }),
  },
  async (input) => {
    // Simulate retraining the model with the new data.
    // In a real implementation, this would involve updating the model weights.
    console.log(`Retraining model with: ${JSON.stringify(input)}`);

    // For now, just return a success message.
    return {
      success: true,
      message: 'Model retraining simulated successfully.',
    };
  }
);

const retrainTranslationModelPrompt = ai.definePrompt({
  name: 'retrainTranslationModelPrompt',
  prompt: `You are an AI model retraining assistant. Use the provided tool to retrain the translation model with the given text pair.\nOriginal Text: {{{originalText}}}\nTranslated Text: {{{translatedText}}}`, // Added handlebars for originalText and translatedText
  tools: [retrainTranslationModelTool],
});

const retrainTranslationModelFlow = ai.defineFlow(
  {
    name: 'retrainTranslationModelFlow',
    inputSchema: RetrainTranslationModelInputSchema,
    outputSchema: RetrainTranslationModelOutputSchema,
  },
  async (input) => {
    try {
      const result = await retrainTranslationModelPrompt(input);
      const toolResponse = result.toolRequest?.tool.output;

      if (toolResponse) {
        return {
            success: toolResponse.success,
            message: toolResponse.message,
        };
      }
      
      const textResponse = result.text;
      if (textResponse) {
        return {
          success: false,
          message: `Model did not perform retraining. It responded with: ${textResponse}`,
        };
      }
      throw new Error('Retraining tool was not called by the model and no text response was provided.');

    } catch (error: any) {
      console.error('Error retraining translation model:', error);
      return {
        success: false,
        message: `Model retraining failed: ${error.message}`,
      };
    }
  }
);
