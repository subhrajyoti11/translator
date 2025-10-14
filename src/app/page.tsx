import { TranslationForm } from '@/components/translation-form';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-center md:text-4xl">
          Translate Nepali & Sinhalese to English
        </h1>
        <p className="mt-2 text-center text-lg text-muted-foreground">
          Extract and translate text from various sources with AI-powered
          precision.
        </p>
        <div className="mt-8">
          <TranslationForm />
        </div>
      </div>
    </div>
  );
}
