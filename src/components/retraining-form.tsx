'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { retrainTranslationModel } from '@/ai/flows/retrain-translation-model';

const formSchema = z.object({
  originalText: z.string().min(1, 'Original text cannot be empty.'),
  translatedText: z.string().min(1, 'Corrected translation cannot be empty.'),
});

type RetrainingFormValues = z.infer<typeof formSchema>;

export function RetrainingForm() {
  const { toast } = useToast();
  const form = useForm<RetrainingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalText: '',
      translatedText: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: RetrainingFormValues) {
    try {
      const result = await retrainTranslationModel(values);
      if (result.success) {
        toast({
          title: 'Correction Submitted',
          description:
            'Thank you for your feedback! The model will be improved.',
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description:
          (error as Error).message || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <Card className="shadow-2xl shadow-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Submit a Correction
            </CardTitle>
            <CardDescription>
              Provide the original text and your improved English translation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="originalText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Text (Nepali or Sinhalese)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the original text here..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="translatedText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct English Translation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the correct English translation here..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-lg py-6"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Correction'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
