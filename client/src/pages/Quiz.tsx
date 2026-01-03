import { useState, useEffect, useRef } from "react";
import { useQuestions, useCreateAttempt } from "@/hooks/use-questions";
import { Layout } from "@/components/Layout";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { CreateAttemptRequest } from "@shared/routes";

const EXAM_TIME_SECONDS = 60 * 60; // 60 minutes

export default function Quiz() {
  const { data: questions, isLoading } = useQuestions();
  const { mutateAsync: submitAttempt, isPending: isSubmitting } = useCreateAttempt();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const timerRef = useRef<NodeJS.Timeout>();

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [questions]);

  if (isLoading || !questions) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progress = Object.keys(answers).length;
  const progressPercent = Math.round((progress / questions.length) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleFinish = async () => {
    clearInterval(timerRef.current);
    
    // Calculate stats
    let correctCount = 0;
    let wrongCount = 0;
    
    questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      if (userAnswer === q.correctAnswer) correctCount++;
      else wrongCount++;
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = EXAM_TIME_SECONDS - timeLeft;

    const attemptData: CreateAttemptRequest = {
      score,
      totalQuestions: questions.length,
      correctCount,
      wrongCount,
      timeSpentSeconds: timeSpent,
    };

    try {
      await submitAttempt(attemptData);
      
      // Store result in localStorage to display on results page without refetching
      localStorage.setItem("lastExamResult", JSON.stringify({
        ...attemptData,
        answers,
        questions
      }));
      
      setLocation("/results");
    } catch (error) {
      toast({
        title: "Error submitting exam",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  // Warning when timer is low
  const isTimeLow = timeLeft < 300; // 5 mins

  return (
    <Layout
      headerContent={
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500 w-12">
              {progress}/{questions.length}
            </span>
          </div>
          
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold transition-colors",
            isTimeLow ? "bg-red-50 text-red-600 animate-pulse" : "bg-slate-100 text-slate-700"
          )}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>

          <Button 
            onClick={handleFinish}
            disabled={isSubmitting}
            variant={Object.keys(answers).length === questions.length ? "default" : "outline"}
            className={cn(
              "hidden md:flex",
              Object.keys(answers).length === questions.length && "bg-green-600 hover:bg-green-700 text-white border-transparent shadow-md shadow-green-600/20"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Finish Exam
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
        {/* Sidebar Question Grid */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 h-full flex flex-col">
            <h3 className="font-display font-bold text-slate-800 mb-4 px-1">Questions</h3>
            <ScrollArea className="flex-1 pr-3 -mr-3">
              <div className="grid grid-cols-4 gap-2 pb-4">
                {questions.map((_, idx) => {
                  const isCurrent = idx === currentIdx;
                  const isAnswered = answers[idx] !== undefined;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={cn(
                        "aspect-square rounded-lg text-sm font-semibold transition-all duration-200 border",
                        isCurrent 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 ring-2 ring-offset-2 ring-indigo-600"
                          : isAnswered
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300"
                            : "bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-100"
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="col-span-1 lg:col-span-9 xl:col-span-10 flex flex-col h-full">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 flex flex-col overflow-y-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <QuestionCard
                  question={currentQuestion}
                  index={currentIdx}
                  selectedOption={answers[currentIdx] ?? null}
                  onSelectOption={handleSelectAnswer}
                />
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="gap-2 pl-3"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <div className="text-sm font-medium text-slate-400 hidden sm:block">
                Question {currentIdx + 1} of {questions.length}
              </div>

              {currentIdx === questions.length - 1 ? (
                <Button 
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 pr-4 shadow-lg shadow-green-600/20"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Exam"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                  className="gap-2 pr-3 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Footer for quick nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <span className="font-mono text-sm font-bold text-slate-600">
          {currentIdx + 1} / {questions.length}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
          disabled={currentIdx === questions.length - 1}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </Layout>
  );
}
