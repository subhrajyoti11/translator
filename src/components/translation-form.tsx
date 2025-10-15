'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookText,
  Languages,
  Loader2,
  FileImage,
  FileText,
  Upload,
  ArrowRight,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Trash2,
  CheckCircle2,
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

  // Voice: Speech-to-Text and Text-to-Speech
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice Assistant box state
  const [assistantTranscript, setAssistantTranscript] = useState('');
  const [assistantIsRecording, setAssistantIsRecording] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const assistantRecognitionRef = useRef<any>(null);
  const assistantUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Map selected source language to appropriate STT locale
  const getSttLocale = (lang: Language) => {
    switch (lang) {
      case 'Nepali':
        return 'ne-NP';
      case 'Sinhalese':
        return 'si-LK';
      default:
        return 'en-US';
    }
  };

  // Initialize speech synthesis stop on unmount
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis?.cancel();
      } catch {}
    };
  }, []);

  // Start browser speech recognition (Web Speech API)
  const startRecording = () => {
    if (typeof window === 'undefined') return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition: any = new SR();
    recognition.lang = getSttLocale(sourceLanguage);
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setSourceText((prev) => (prev ? prev + ' ' + transcript : transcript));
        } else {
          interim += transcript;
        }
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsRecording(false);
  };

  // Speak given text using Speech Synthesis API
  const speakText = (text: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      // Prefer English output for translated text
      utter.lang = 'en-US';
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setIsSpeaking(true);
    } catch {
      // no-op
    }
  };

  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setIsSpeaking(false);
  };

  // Voice Assistant handlers
  const startAssistantRecording = () => {
    if (typeof window === 'undefined') return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition: any = new SR();
    // Use English by default for assistant
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let finalText = assistantTranscript;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const { transcript } = event.results[i][0];
        if (event.results[i].isFinal) {
          finalText = finalText ? finalText + ' ' + transcript : transcript;
        }
      }
      setAssistantTranscript(finalText);
    };
    recognition.onerror = () => {
      setAssistantIsRecording(false);
    };
    recognition.onend = () => {
      setAssistantIsRecording(false);
    };
    assistantRecognitionRef.current = recognition;
    recognition.start();
    setAssistantIsRecording(true);
  };

  const stopAssistantRecording = () => {
    assistantRecognitionRef.current?.stop();
    assistantRecognitionRef.current = null;
    setAssistantIsRecording(false);
  };

  const speakAssistant = (text: string) => {
    if (typeof window === 'undefined' || !text.trim()) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(`You said: ${text}`);
      utter.lang = 'en-US';
      utter.onend = () => setAssistantIsSpeaking(false);
      utter.onerror = () => setAssistantIsSpeaking(false);
      assistantUtteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
      setAssistantIsSpeaking(true);
    } catch {}
  };

  const stopAssistantSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    setAssistantIsSpeaking(false);
  };

  // Translate Assistant transcript to English using same flow as main form
  const translateAssistant = async () => {
    const text = assistantTranscript.trim();
    if (!text) {
      setError('Please say something to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await translateText({ text, sourceLanguage });
      setTranslatedText(result.translatedText);
    } catch (e) {
      setError('Failed to translate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {/* Input Column */}
        <Card className="h-full flex flex-col shadow-lg shadow-primary/10 border border-primary/30 glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark">
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
          <CardContent className="pt-0 flex-1">
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
              <TabsContent value="text" className="mt-4">
                <Textarea
                  name="text"
                  placeholder="Enter or paste your text here..."
                  className="min-h-[180px] text-base resize-y bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
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
                <div className="min-h-[200px] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
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
              <TabsContent value="pdf" className="mt-4">
                <div className="min-h-[200px] border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
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
        <Card className="h-full flex flex-col glass-effect-light dark:glass-effect-dark-enhanced border border-primary/30 shadow-lg shadow-primary/10 hover-lift-light dark:hover-lift-dark">
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
          <CardContent className="pt-0 flex-1">
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
              <>
                <div className="flex items-center justify-end gap-2 mb-3">
                  {!isSpeaking ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => speakText(translatedText)} className="border-primary/50 text-primary">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                  ) : (
                    <Button type="button" variant="destructive" size="sm" onClick={stopSpeaking} className="border-destructive/50">
                      <VolumeX className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  )}
                </div>
              <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                <p className="text-base whitespace-pre-wrap font-body leading-relaxed">
                  {translatedText}
                </p>
                </div>
              </>
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

        {/* Voice Assistant Column */}
        <Card className="h-full flex flex-col glass-effect-light dark:glass-effect-dark-enhanced border border-primary/30 shadow-lg shadow-primary/10 hover-lift-light dark:hover-lift-dark">
          <CardHeader className="pb-6">
            <div>
              <CardTitle className="font-headline text-2xl mb-2 text-gradient-light dark:text-gradient-dark flex items-center gap-2">
                <Mic className="h-6 w-6 text-primary" /> Voice Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tap the mic to speak in your language
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-6 flex-1 flex flex-col">
            {/* Big Mic Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={assistantIsRecording ? stopAssistantRecording : startAssistantRecording}
                className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg border-2 border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/30"
              >
                <div className={`absolute inset-0 rounded-full ${assistantIsRecording ? 'animate-ping bg-primary/20' : ''}`}></div>
                {assistantIsRecording ? (
                  <Square className="h-8 w-8 text-primary-foreground relative" />
                ) : (
                  <Mic className="h-8 w-8 text-primary-foreground relative" />
                )}
              </button>
            </div>

            <p className="text-center text-muted-foreground text-sm">Tap to speak in your language</p>

            {/* Features List */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> 8+ Indian Languages
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Offline Speech Recognition
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Natural Language Processing
              </div>
            </div>

            {/* Controls Row */}
            <div className="mt-auto flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setAssistantTranscript('')}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button type="button" size="sm" onClick={translateAssistant} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Translate to English <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Transcript Box */}
            <div className="bg-background/50 rounded-lg p-3 border border-border/50 min-h-[100px]">
              <p className="text-sm whitespace-pre-wrap text-foreground">
                {assistantTranscript || 'Your voice transcript will appear here.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
