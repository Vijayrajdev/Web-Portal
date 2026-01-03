import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Question } from "@shared/routes";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  showResult?: boolean;
}

export function QuestionCard({ 
  question, 
  index, 
  selectedOption, 
  onSelectOption,
  showResult = false 
}: QuestionCardProps) {
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-indigo-100 text-indigo-700 font-mono text-sm font-bold px-3 py-1 rounded-full border border-indigo-200">
          Q.{index + 1}
        </span>
        {question.source && (
          <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
            Source: {question.source}
          </span>
        )}
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, optIndex) => {
          const isSelected = selectedOption === optIndex;
          const isCorrect = showResult && optIndex === question.correctAnswer;
          const isWrong = showResult && isSelected && optIndex !== question.correctAnswer;
          
          let cardStyle = "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50";
          
          if (showResult) {
            if (isCorrect) cardStyle = "border-green-500 bg-green-50 ring-1 ring-green-500";
            else if (isWrong) cardStyle = "border-red-500 bg-red-50 ring-1 ring-red-500";
            else cardStyle = "border-slate-200 bg-white opacity-60";
          } else {
            if (isSelected) cardStyle = "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20";
          }

          return (
            <motion.button
              key={optIndex}
              whileHover={!showResult ? { scale: 1.01 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
              onClick={() => !showResult && onSelectOption(optIndex)}
              className={cn(
                "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group",
                cardStyle
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                  isSelected || isCorrect ? "border-current" : "border-slate-300 group-hover:border-indigo-400"
                )}>
                  {(isSelected || isCorrect) && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                </div>
                <span className={cn(
                  "text-base font-medium",
                  isSelected ? "text-slate-900" : "text-slate-600"
                )}>
                  {option}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {showResult && question.rationale && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-sm leading-relaxed"
        >
          <strong className="block mb-1 font-semibold text-blue-700">Rationale:</strong>
          {question.rationale}
        </motion.div>
      )}
    </div>
  );
}
