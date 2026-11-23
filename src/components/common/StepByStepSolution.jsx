import React, { useState } from 'react';
import { ListOrdered, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StepByStepSolution({ steps = [], finalResult = null }) {
  const [open, setOpen] = useState(true);
  const { showToast } = useApp();

  if (!steps || steps.length === 0) return null;

  const copySolution = () => {
    const text = steps.map((s, idx) => `Step ${idx + 1}: ${s.title ? s.title + ' - ' : ''}${s.math || s.desc}`).join('\n') +
      (finalResult ? `\n\nFinal Result = ${finalResult}` : '');
    navigator.clipboard.writeText(text);
    showToast('Complete solution copied to clipboard!');
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/5 backdrop-blur-sm overflow-hidden transition-all mt-4">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-emerald-500/15 dark:hover:bg-emerald-500/10 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ListOrdered className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Step-by-Step Solution ({steps.length} Steps)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copySolution();
            }}
            className="p-1 rounded text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-white hover:bg-emerald-500/20 transition-colors"
            title="Copy all steps"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-emerald-500/20 space-y-3">
          <ol className="relative border-l border-emerald-500/30 ml-3 space-y-3 pt-2">
            {steps.map((step, idx) => (
              <li key={idx} className="ml-4">
                <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border border-emerald-500 bg-emerald-100 dark:bg-emerald-950"></div>
                {step.title && (
                  <h4 className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                    Step {idx + 1}: {step.title}
                  </h4>
                )}
                {step.desc && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                )}
                {step.math && (
                  <div className="mt-1.5 p-2 rounded-lg bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 font-mono text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium overflow-x-auto">
                    {step.math}
                  </div>
                )}
              </li>
            ))}
          </ol>

          {finalResult && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Final Conclusion</span>
              <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{finalResult}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
