import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Moon, Compass, BookOpen, MapPin, Calendar, Globe, Palette, Mail } from 'lucide-react';

const queryClient = new QueryClient();

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ question, answer }: { question: string, answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
      >
        <span className="text-lg font-serif text-foreground/90">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-primary ml-4 shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-muted-foreground font-sans leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Home() {
  const features = [
    { icon: <Moon className="w-6 h-6" />, title: "Prayer Times & Adhan", desc: "Accurate daily times with beautiful Adhan notifications." },
    { icon: <Compass className="w-6 h-6" />, title: "Qibla Compass", desc: "Find your direction anywhere in the world." },
    { icon: <BookOpen className="w-6 h-6" />, title: "Quran Reader", desc: "Read with clear typography and multiple translations." },
    { icon: <MapPin className="w-6 h-6" />, title: "Nearby Masjids", desc: "Locate mosques and prayer spaces around you." },
    { icon: <Calendar className="w-6 h-6" />, title: "Hijri Calendar", desc: "Stay connected to the Islamic lunar calendar." },
    { icon: <Globe className="w-6 h-6" />, title: "Multi-Language", desc: "Available in English, Arabic, and Urdu." },
    { icon: <Palette className="w-6 h-6" />, title: "Beautiful Themes", desc: "Respectful dark and light modes for any time of day." },
  ];

  const faqs = [
    {
      q: "Why isn't the Adhan playing?",
      a: "Please check your device's notification permissions for the app and ensure your phone is not on silent. Also, verify that the Adhan toggle is turned on in the app Settings."
    },
    {
      q: "How do I change the calculation method?",
      a: "You can adjust the calculation authority (e.g., ISNA, Muslim World League, Umm al-Qura) by going to Settings > Calculation Method."
    },
    {
      q: "My Qibla compass is spinning or inaccurate.",
      a: "Magnetic interference can affect the compass. Please calibrate your device by moving your phone in a figure-8 motion away from electronics and metal objects."
    },
    {
      q: "Why does the app need my location?",
      a: "Location access is strictly required to calculate accurate prayer times for your specific city and to determine the correct Qibla direction. We do not store or track your location."
    },
    {
      q: "How do I test if the Adhan works?",
      a: "Navigate to Settings > Notifications and tap the 'Test Adhan' button to ensure audio is working correctly."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative selection:bg-primary/30 selection:text-primary-foreground">
      
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-screen pointer-events-none opacity-40 bg-[url('/hero-pattern.png')] bg-cover bg-center mix-blend-screen" />

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-8 md:px-12 md:py-12 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif font-medium text-xl tracking-wide text-foreground">Deen o Dunya</span>
        </div>
        <a href="mailto:support@deenodunya.app" className="text-sm font-sans tracking-wide text-primary hover:text-primary/80 transition-colors">
          Support
        </a>
      </header>

      <main className="flex-grow z-10 w-full max-w-4xl mx-auto px-6 md:px-12 pb-24 space-y-32">
        
        {/* Hero Section */}
        <section className="pt-16 md:pt-24 text-center">
          <FadeIn>
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              <p className="text-xs font-mono text-primary/80 tracking-wider">com.deenodunya.planner</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1] tracking-tight mb-8">
              Find peace in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                your daily routine.
              </span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed">
              Your private, sacred space for prayer times, Qibla direction, and daily reflection. Rooted in tradition, designed for today.
            </p>
          </FadeIn>
        </section>

        {/* Features Section */}
        <section>
          <FadeIn>
            <h2 className="text-3xl font-serif text-foreground mb-12 text-center">Everything you need</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="p-6 rounded-2xl bg-card border border-card-border hover:border-primary/30 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-500">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-serif text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Support & FAQ Section */}
        <section id="faq">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-foreground mb-4">Support & FAQ</h2>
              <p className="text-muted-foreground font-sans">Common questions about using Deen o Dunya Planner.</p>
            </div>
          </FadeIn>
          <div className="max-w-2xl mx-auto">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <FaqItem question={faq.q} answer={faq.a} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section id="privacy">
          <FadeIn>
            <div className="p-8 md:p-12 rounded-3xl bg-card/50 border border-card-border backdrop-blur-sm prose prose-invert prose-p:text-muted-foreground prose-headings:font-serif prose-headings:font-normal max-w-none">
              <h2 className="text-3xl text-center mb-8 text-foreground">Privacy Policy</h2>
              <div className="space-y-6 text-sm md:text-base font-sans leading-relaxed max-w-2xl mx-auto">
                <p>
                  At Deen o Dunya Planner, we believe your spiritual journey is deeply personal. Our privacy policy is simple: <strong>we do not collect, store, or share any of your personal data.</strong>
                </p>
                <ul className="space-y-4 list-none pl-0">
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Location Data:</strong> Your location is used strictly on-device to calculate accurate prayer times and the Qibla direction for your city. It is never transmitted to our servers.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>No Tracking:</strong> We do not use analytics, we do not track your usage, and we do not require you to create an account.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Local Content:</strong> All Quran text and translations are bundled directly within the app. You don't need an internet connection to read the Quran.</span>
                  </li>
                </ul>
                <p className="pt-6 border-t border-border/50">
                  If you have any questions regarding your privacy or how our app works, please reach out to us at <a href="mailto:support@deenodunya.app" className="text-primary no-underline hover:underline">support@deenodunya.app</a>.
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Contact Section */}
        <section className="text-center pb-12">
          <FadeIn>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-4">Need more help?</h2>
            <p className="text-muted-foreground font-sans mb-8">We're here to support your daily practice.</p>
            <a href="mailto:support@deenodunya.app" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium font-sans hover:bg-primary/90 transition-colors">
              Email Support
            </a>
          </FadeIn>
        </section>

      </main>

      {/* Footer */}
      <footer className="z-10 w-full py-8 border-t border-border/40 text-center">
        <p className="text-muted-foreground font-sans text-sm">
          &copy; {new Date().getFullYear()} Deen o Dunya Planner. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
