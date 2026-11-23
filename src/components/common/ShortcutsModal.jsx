import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Keyboard } from 'lucide-react';

export default function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useApp();

  if (!shortcutsOpen) return null;

  const shortcuts = [
    { key: 'Cmd / Ctrl + K', action: 'Open Global Search Palette' },
    { key: 'Cmd / Ctrl + H', action: 'Toggle History Drawer' },
    { key: '0 - 9', action: 'Enter Numbers (Basic & Scientific)' },
    { key: '+  -  *  /', action: 'Basic Arithmetic Operators' },
    { key: 'Enter / =', action: 'Calculate Result' },
    { key: 'Backspace', action: 'Delete Last Digit' },
    { key: 'Escape', action: 'Clear Display / Close Modals' },
    { key: '( and )', action: 'Parentheses (BODMAS)' },
    { key: '^', action: 'Power / Exponent' },
    { key: '%', action: 'Percentage / Modulo' },
    { key: 'Tab', action: 'Navigate between input fields' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl glass-panel border border-slate-200 dark:border-white/20 p-6 shadow-2xl transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-white/10 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between pt-2">
              <span className="text-sm text-slate-700 dark:text-slate-300">{sc.action}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md bg-slate-200/80 dark:bg-white/10 text-sky-700 dark:text-sky-300 border border-slate-300 dark:border-white/15 shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
          <button
            onClick={() => setShortcutsOpen(false)}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-btn-brand"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
