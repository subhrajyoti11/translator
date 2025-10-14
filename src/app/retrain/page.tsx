import { RetrainingForm } from '@/components/retraining-form';

export default function RetrainPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Improve Our Translation Model
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Submit corrections to help us enhance translation accuracy. Your
            feedback is valuable for continuous learning.
          </p>
        </div>
        <div className="mt-10">
          <RetrainingForm />
        </div>
      </div>
    </div>
  );
}
