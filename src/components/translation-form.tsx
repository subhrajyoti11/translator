'use client';

import { useState } from 'react';
import {
  BookText,
  Languages,
  Loader2,
  FileImage,
  FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { translateText } from '@/ai/flows/translate-text';
import { Skeleton } from './ui/skeleton';

type Language = 'Nepali' | 'Sinhalese';

export function TranslationForm() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>('Nepali');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sourceText.trim()) {
      setError('Please enter text to translate.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText({
        text: sourceText,
        sourceLanguage: sourceLanguage,
      });
      setTranslatedText(result.translatedText);
    } catch (err) {
      setError('An error occurred during translation. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Input Column */}
            <div className="p-6 border-b md:border-b-0 md:border-r">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-headline text-xl font-semibold">
                  Original Text
                </h2>
                <Select
                  value={sourceLanguage}
                  onValueChange={(value: Language) => setSourceLanguage(value)}
                  name="sourceLanguage"
                >
                  <SelectTrigger className="w-auto md:w-[180px]">
                    <Languages className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nepali">Nepali</SelectItem>
                    <SelectItem value="Sinhalese">Sinhalese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">
                    <BookText className="mr-2 h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="image" disabled>
                    <FileImage className="mr-2 h-4 w-4" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="pdf" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className="mt-4">
                  <Textarea
                    name="text"
                    placeholder="Enter or paste your text here..."
                    className="min-h-[250px] text-base resize-y"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                disabled={isLoading || !sourceText.trim()}
                className="w-full mt-4"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
            </div>

            {/* Output Column */}
            <div className="p-6 bg-muted/20">
              <h2 className="font-headline text-xl font-semibold mb-4">
                Translated Text
              </h2>
              <Card className="min-h-[362px] bg-background">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : translatedText ? (
                    <p className="text-base whitespace-pre-wrap">
                      {translatedText}
                    </p>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full pt-20 text-center text-muted-foreground">
                      <Languages className="h-10 w-10 mb-2" />
                      <p>Your English translation will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
