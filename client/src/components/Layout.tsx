import { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { Link } from "wouter";

interface LayoutProps {
  children: ReactNode;
  headerContent?: ReactNode;
}

export function Layout({ children, headerContent }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg leading-none text-slate-900">ACE Simulator</span>
              <span className="text-xs font-medium text-slate-500 font-mono tracking-wide">HARD MODE</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            {headerContent}
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="py-6 border-t border-slate-200 bg-white text-center text-slate-400 text-sm">
        <p>© 2024 ACE Exam Simulator. For educational purposes only.</p>
      </footer>
    </div>
  );
}
