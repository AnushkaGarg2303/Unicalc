import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, setToast } = useApp();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass-panel shadow-glass-lg border border-slate-300 dark:border-white/20 animate-bounce duration-300">
      {isError ? (
        <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
      ) : isInfo ? (
        <Info className="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
      )}
      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</span>
      <button
        onClick={() => setToast(null)}
        className="ml-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
