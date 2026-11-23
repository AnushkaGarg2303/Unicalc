import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function FormulaCard({ title, formula, description, variables = [] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyFormula = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/5 backdrop-blur-sm overflow-hidden transition-all mb-4">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-sky-500/15 dark:hover:bg-sky-500/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Formula: {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyFormula}
            className="p-1 rounded text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white hover:bg-sky-500/20 transition-colors"
            title="Copy formula text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-sky-600 dark:text-sky-400" /> : <ChevronDown className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
        </div>
      </div>

      {/* Main Formula Display */}
      <div className="px-4 pb-3">
        <div className="p-3 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 font-mono text-sm md:text-base text-slate-800 dark:text-sky-200 text-center font-medium overflow-x-auto shadow-inner">
          {formula}
        </div>
      </div>

      {/* Expandable Explanation & Variables */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-sky-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
          {description && (
            <p className="leading-relaxed">{description}</p>
          )}
          {variables && variables.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Where:</span>
              <ul className="space-y-1 pl-2">
                {variables.map((v, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-sky-600 dark:text-sky-300 font-semibold">{v.name}:</span>
                    <span className="text-slate-600 dark:text-slate-400">{v.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
