import { useQuestions } from "@/hooks/use-questions";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, Brain, Trophy, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const { data: questions, isLoading, error } = useQuestions();
  const [_, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading exam resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Failed to load content</h1>
        <p className="text-slate-600 mb-6">Could not connect to the exam server.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-xl shadow-indigo-100 mb-8 ring-1 ring-slate-100">
              <Brain className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 mb-6 tracking-tight">
              Ready to verify your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                cloud expertise?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              50 challenging questions curated from the latest exam dumps. 
              Timed environment. Instant feedback. Detailed rationales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard 
              icon={<Trophy className="w-6 h-6 text-amber-500" />}
              title="Real Exam Mode"
              description="60 minutes to complete 50 questions. No pausing."
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-indigo-500" />}
              title="Smart Analytics"
              description="Track your performance by topic and difficulty."
            />
            <FeatureCard 
              icon={<Loader2 className="w-6 h-6 text-emerald-500" />}
              title="Latest Content"
              description="Freshly updated with 2024 question bank."
            />
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="h-14 px-10 text-lg rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 transition-all duration-300 group"
              onClick={() => setLocation("/quiz")}
            >
              Start Exam Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
