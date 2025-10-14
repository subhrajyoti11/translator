import { TranslationForm } from '@/components/translation-form';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Bhashaantar AI
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
          Translate Nepali & Sinhalese literature, text, and documents into
          English with AI-powered precision.
        </p>
      </div>
      <div className="mt-12">
        <TranslationForm />
      </div>
    </div>
  );
}
