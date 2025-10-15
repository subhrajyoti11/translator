import { RetrainingForm } from '@/components/retraining-form';
import { Brain, Target, Users, TrendingUp } from 'lucide-react';

export default function RetrainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent"></div>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 hover-lift-light dark:hover-lift-dark shadow-lg badge-light dark:badge-dark glow-dark">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Model Improvement</span>
            </div>
            
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6 text-gradient-light dark:text-gradient-dark">
              Improve Our Translation Model
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Submit corrections to help us enhance translation accuracy. Your
              feedback is valuable for continuous learning and model improvement.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">Precision Training</h3>
                <p className="text-muted-foreground leading-relaxed">Your corrections help fine-tune the model for more accurate translations.</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">Community Driven</h3>
                <p className="text-muted-foreground leading-relaxed">Join a community of language enthusiasts working together to improve AI translation.</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">Continuous Learning</h3>
                <p className="text-muted-foreground leading-relaxed">The model learns from every correction, becoming better over time.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <RetrainingForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
