import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, Copy, Download, History, ArrowUpRight } from 'lucide-react';

export default function HistoryDrawer() {
  const { historyOpen, setHistoryOpen, history, clearHistory, deleteHistoryItem, setActiveTool, showToast } = useApp();

  if (!historyOpen) return null;

  const copyToClipboard = (text, label = 'Result') => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`);
  };

  const exportHistory = () => {
    if (!history.length) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `unicalc_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('History exported as JSON');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-slate-200 dark:border-white/20 p-6 flex flex-col shadow-2xl transition-colors duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Calculation History</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-mono font-bold">
                {history.length}
              </span>
            </div>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          {history.length > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-white/10 text-xs">
              <button
                onClick={exportHistory}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </button>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          )}

          {/* Records List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-white/10 py-3 space-y-3 pr-1">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                <History className="w-12 h-12 mb-3 opacity-30 stroke-1" />
                <p className="text-base font-medium">No calculations yet</p>
                <p className="text-xs text-slate-500 mt-1">Calculations performed across any tool will appear here automatically.</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="pt-3 group first:pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-medium">
                      {item.toolName || item.tool}
                    </span>
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-300 break-words">
                    {item.expression || item.title}
                  </div>

                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Result:</span>
                    <span className="font-mono text-base font-bold text-sky-600 dark:text-sky-400 break-words">
                      {item.result}
                    </span>
                  </div>

                  {/* Micro Actions */}
                  <div className="mt-2 flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(item.result, 'Result')}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 rounded transition-colors"
                      title="Copy result"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {item.tool && (
                      <button
                        onClick={() => {
                          setActiveTool(item.tool);
                          setHistoryOpen(false);
                        }}
                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded transition-colors"
                        title="Open this calculator"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
