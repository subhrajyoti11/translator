import { TranslationForm } from '@/components/translation-form';
import { Sparkles, Globe, BookOpen, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent"></div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Hero Content */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border-2 border-primary/30 mb-6 animate-scale-in hover-lift-light dark:hover-lift-dark shadow-lg badge-light dark:badge-dark glow-dark">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Translation</span>
            </div>
            
            <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl mb-6 text-gradient-light dark:text-gradient-dark animate-slide-up">
              LexiFlow AI
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Translate Nepali & Sinhalese literature, text, and documents into
              English with AI-powered precision and cultural understanding.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark animate-slide-up relative overflow-hidden" style={{animationDelay: '0.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110 glow-dark">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">Multi-Language Support</h3>
                <p className="text-muted-foreground leading-relaxed">Seamlessly translate between Nepali, Sinhalese, and English with cultural context preservation.</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark animate-slide-up relative overflow-hidden" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110 glow-dark">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">Literature Focused</h3>
                <p className="text-muted-foreground leading-relaxed">Specialized for translating literary works, poetry, and cultural texts with nuanced understanding.</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl glass-effect-light dark:glass-effect-dark-enhanced hover-lift-light dark:hover-lift-dark animate-slide-up relative overflow-hidden" style={{animationDelay: '0.3s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:scale-110 glow-dark">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gradient-light dark:text-gradient-dark">AI-Powered</h3>
                <p className="text-muted-foreground leading-relaxed">Advanced machine learning models trained specifically on South Asian languages and literature.</p>
              </div>
            </div>
          </div>

          {/* Translation Form */}
          <div className="relative animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <TranslationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
