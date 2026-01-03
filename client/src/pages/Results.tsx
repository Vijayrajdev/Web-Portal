import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/QuestionCard";
import { useLocation } from "wouter";
import { Trophy, Clock, XCircle, CheckCircle, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import type { Question } from "@shared/routes";

interface ResultState {
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  answers: Record<number, number>;
  questions: Question[];
}

export default function Results() {
  const [state, setState] = useState<ResultState | null>(null);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("lastExamResult");
    if (!saved) {
      setLocation("/");
      return;
    }
    const parsed = JSON.parse(saved);
    setState(parsed);

    if (parsed.score >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#818cf8', '#c7d2fe']
      });
    }
  }, [setLocation]);

  if (!state) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const isPassing = state.score >= 70;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto pb-20">
        {/* Score Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-12 mb-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
            <div className="text-center md:text-left">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Exam Result</h2>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">
                {state.score}%
              </h1>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                isPassing 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {isPassing ? "PASSED" : "NEEDS IMPROVEMENT"}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full md:w-auto">
              <StatItem 
                icon={<CheckCircle className="w-5 h-5 text-green-600" />} 
                value={state.correctCount} 
                label="Correct" 
                bg="bg-green-50"
              />
              <StatItem 
                icon={<XCircle className="w-5 h-5 text-red-600" />} 
                value={state.wrongCount} 
                label="Incorrect" 
                bg="bg-red-50"
              />
              <StatItem 
                icon={<Clock className="w-5 h-5 text-blue-600" />} 
                value={formatTime(state.timeSpentSeconds)} 
                label="Time Spent" 
                bg="bg-blue-50"
              />
              <StatItem 
                icon={<Trophy className="w-5 h-5 text-amber-600" />} 
                value={`${state.correctCount}/${state.totalQuestions}`} 
                label="Score" 
                bg="bg-amber-50"
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center md:justify-start">
            <Button 
              size="lg" 
              onClick={() => setLocation("/")}
              className="gap-2 h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
            >
              <RotateCcw className="w-4 h-4" /> Start New Exam
            </Button>
          </div>

          {/* Decorative background element */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />
        </div>

        {/* Detailed Review */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-slate-800 px-2 font-display">Detailed Review</h2>
          
          {state.questions.map((question, idx) => {
            const userAnswer = state.answers[idx];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl border p-6 md:p-8 transition-shadow hover:shadow-md ${
                  isCorrect ? "border-slate-200" : "border-red-100 shadow-sm shadow-red-100"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  {isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                  )}
                  <span className={`font-bold text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                    {isCorrect ? "Correct" : "Incorrect Answer"}
                  </span>
                </div>

                <QuestionCard
                  question={question}
                  index={idx}
                  selectedOption={userAnswer}
                  onSelectOption={() => {}}
                  showResult={true}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

function StatItem({ icon, value, label, bg }: { icon: ReactNode; value: string | number; label: string; bg: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-black/5 ${bg}`}>
      <div className="mb-2 bg-white rounded-full p-2 shadow-sm">{icon}</div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

import { ReactNode } from "react";
