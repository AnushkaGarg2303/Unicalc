import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, RotateCcw, Printer } from 'lucide-react';
import PrintModal from './PrintModal';

export default function CalculatorContainer({
  title,
  subtitle,
  toolId,
  children,
  onReset,
  summaryData = {},
  steps = []
}) {
  const { favorites, toggleFavorite } = useApp();
  const [showPrint, setShowPrint] = useState(false);
  const isFav = favorites.includes(toolId);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Tool Header Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-white/15 relative overflow-hidden transition-colors duration-200">
        {/* Glow backdrop accent */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {title}
              </h1>
              <button
                onClick={() => toggleFavorite(toolId)}
                className={`p-1.5 rounded-xl transition-all ${
                  isFav
                    ? 'text-amber-500 dark:text-amber-400 bg-amber-400/15 hover:bg-amber-400/25 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/10'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-all active:scale-95"
                title="Reset all inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            <button
              onClick={() => setShowPrint(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/60 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-all active:scale-95"
              title="Print or share calculation report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export / Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calculator Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Print/Export Modal */}
      <PrintModal
        open={showPrint}
        onClose={() => setShowPrint(false)}
        title={title}
        data={summaryData}
        steps={steps}
      />
    </div>
  );
}
