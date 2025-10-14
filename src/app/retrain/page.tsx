import { RetrainingForm } from '@/components/retraining-form';

export default function RetrainPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-center md:text-4xl">
          Improve Our Translation Model
        </h1>
        <p className="mt-2 text-center text-lg text-muted-foreground">
          Submit corrections to help us enhance the translation accuracy. Your
          feedback is valuable for continuous learning.
        </p>
        <div className="mt-8">
          <RetrainingForm />
        </div>
      </div>
    </div>
  );
}
