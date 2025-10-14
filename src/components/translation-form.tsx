'use client';

import { useState } from 'react';
import {
  BookText,
  Languages,
  Loader2,
  FileImage,
  FileText,
  Upload,
  ArrowRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Input } from './ui/input';

type Language = 'Nepali' | 'Sinhalese';
type Tab = 'text' | 'image' | 'pdf';

export function TranslationForm() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>('Nepali');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('text');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSourceText(`Image: ${file.name}`); // Placeholder for now
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setSourceText(`PDF: ${file.name}`); // Placeholder for now
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sourceText.trim()) {
      setError('Please enter text or upload a file to translate.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      // TODO: Implement text extraction for image and PDF
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

  const isSubmitDisabled =
    isLoading ||
    (activeTab === 'text' && !sourceText.trim()) ||
    (activeTab === 'image' && !imageFile) ||
    (activeTab === 'pdf' && !pdfFile);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Column */}
        <Card className="shadow-2xl shadow-primary/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-headline text-2xl">
                Original Document
              </CardTitle>
              <Select
                value={sourceLanguage}
                onValueChange={(value: Language) => setSourceLanguage(value)}
                name="sourceLanguage"
              >
                <SelectTrigger className="w-auto md:w-[180px] bg-secondary border-0">
                  <Languages className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nepali">Nepali</SelectItem>
                  <SelectItem value="Sinhalese">Sinhalese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="text"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as Tab)}
            >
              <TabsList className="grid w-full grid-cols-3 bg-secondary">
                <TabsTrigger value="text">
                  <BookText className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image">
                  <FileImage className="mr-2 h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="pdf">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
                <Textarea
                  name="text"
                  placeholder="Enter or paste your text here..."
                  className="min-h-[250px] text-base resize-y bg-background"
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    setImageFile(null);
                    setPdfFile(null);
                    setImagePreview(null);
                  }}
                />
              </TabsContent>
              <TabsContent value="image" className="mt-4">
                <div className="min-h-[250px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center hover:border-primary transition-colors">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Image preview"
                      className="max-h-[200px] rounded-md object-contain"
                    />
                  ) : (
                    <div className="space-y-2">
                      <FileImage className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Upload an image to extract text.
                      </p>
                    </div>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4 max-w-sm"
                  />
                </div>
              </TabsContent>
              <TabsContent value="pdf" className="mt-4">
                <div className="min-h-[250px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 text-center hover:border-primary transition-colors">
                  {pdfFile ? (
                    <div className="space-y-2">
                      <FileText className="h-10 w-10 mx-auto text-primary" />
                      <p className="font-medium">{pdfFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Ready to translate.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Upload a PDF to extract text.
                      </p>
                    </div>
                  )}
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="mt-4 max-w-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full mt-6 text-lg py-6"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  Translate to English <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Column */}
        <Card className="min-h-full bg-secondary/50">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              English Translation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : translatedText ? (
              <p className="text-base whitespace-pre-wrap font-body leading-relaxed">
                {translatedText}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center h-full pt-20 text-center text-muted-foreground">
                <Languages className="h-12 w-12 mb-4" />
                <p className="text-lg">Your English translation will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
