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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Column */}
        <Card className="shadow-2xl shadow-primary/10 border border-border/50 glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline text-2xl mb-2 text-gradient-light dark:text-gradient-dark">
                  Original Document
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Enter your text or upload a file to translate
                </p>
              </div>
              <Select
                value={sourceLanguage}
                onValueChange={(value: Language) => setSourceLanguage(value)}
                name="sourceLanguage"
              >
                <SelectTrigger className="w-auto md:w-[180px] bg-secondary/50 border border-border/50 hover:border-primary/20 transition-colors">
                  <Languages className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nepali">🇳🇵 Nepali</SelectItem>
                  <SelectItem value="Sinhalese">🇱🇰 Sinhalese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs
              defaultValue="text"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as Tab)}
            >
              <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-border/50">
                <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <BookText className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <FileImage className="mr-2 h-4 w-4" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="pdf" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-6">
                <Textarea
                  name="text"
                  placeholder="Enter or paste your text here..."
                  className="min-h-[250px] text-base resize-y bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                  value={sourceText}
                  onChange={(e) => {
                    setSourceText(e.target.value);
                    setImageFile(null);
                    setPdfFile(null);
                    setImagePreview(null);
                  }}
                />
              </TabsContent>
              <TabsContent value="image" className="mt-6">
                <div className="min-h-[250px] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Image preview"
                      className="max-h-[200px] rounded-lg object-contain shadow-lg"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                        <FileImage className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Upload an image</p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to select
                        </p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4 max-w-sm bg-background/50 border-border/50"
                  />
                </div>
              </TabsContent>
              <TabsContent value="pdf" className="mt-6">
                <div className="min-h-[250px] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
                  {pdfFile ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{pdfFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Ready to translate
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground font-medium">Upload a PDF</p>
                        <p className="text-sm text-muted-foreground">
                          Drag and drop or click to select
                        </p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfChange}
                    className="mt-4 max-w-sm bg-background/50 border-border/50"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full mt-8 text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
        <Card className="min-h-full glass-effect-light dark:glass-effect-dark-enhanced border border-border/50 shadow-2xl shadow-primary/10 hover-lift-light dark:hover-lift-dark">
          <CardHeader className="pb-6">
            <div>
              <CardTitle className="font-headline text-2xl mb-2 text-gradient-light dark:text-gradient-dark">
                English Translation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your translated text will appear here
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-200"></div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertTitle>Translation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : translatedText ? (
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <p className="text-base whitespace-pre-wrap font-body leading-relaxed">
                  {translatedText}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full pt-20 text-center text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                  <Languages className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to translate</h3>
                <p className="text-sm">Enter your text or upload a file to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
