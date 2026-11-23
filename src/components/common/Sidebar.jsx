import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  Atom,
  Percent,
  TrendingUp,
  BadgeDollarSign,
  Tag,
  PercentSquare,
  Square,
  Box,
  HardDrive,
  ArrowLeftRight,
  Scale,
  BarChart2,
  Network,
  Divide,
  Binary,
  Calendar,
  Clock,
  HeartPulse,
  Sigma,
  BookOpen,
  Star,
  Sparkles,
  X,
  Search
} from 'lucide-react';

const ICON_MAP = {
  Calculator,
  Atom,
  Percent,
  TrendingUp,
  BadgeDollarSign,
  Tag,
  PercentSquare,
  Square,
  Box,
  HardDrive,
  ArrowLeftRight,
  Scale,
  BarChart2,
  Network,
  Divide,
  Binary,
  Calendar,
  Clock,
  HeartPulse,
  Sigma,
  BookOpen
};

export default function Sidebar({ isOpen, onClose }) {
  const {
    activeTool,
    setActiveTool,
    toolsConfig,
    favorites,
    toggleFavorite,
    recentlyUsed
  } = useApp();

  const [filterQuery, setFilterQuery] = useState('');

  // Group tools by Category
  const categories = [
    'General',
    'Finance',
    'Mathematics',
    'Geometry',
    'Converters',
    'Computing',
    'Daily Life',
    'Health',
    'Advanced Math',
    'Reference'
  ];

  const filteredTools = toolsConfig.filter(t =>
    t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleToolSelect = (id) => {
    setActiveTool(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed lg:sticky top-0 lg:top-16 z-40 lg:z-10 h-screen lg:h-[calc(100vh-4rem)] w-72 glass-panel border-r border-slate-200 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Top Header on Mobile */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-100">UniCalc Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Search in Sidebar */}
        <div className="p-3 border-b border-slate-200 dark:border-white/10">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter 22 tools..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Tools Navigation Scroll Area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {/* Recently Used (if no search query) */}
          {!filterQuery && recentlyUsed.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" /> Recent Tools
              </span>
              <div className="space-y-0.5">
                {recentlyUsed.slice(0, 3).map(toolId => {
                  const tool = toolsConfig.find(t => t.id === toolId);
                  if (!tool) return null;
                  const Icon = ICON_MAP[tool.icon] || Calculator;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={`recent-${tool.id}`}
                      onClick={() => handleToolSelect(tool.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-btn-brand'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grouped by Categories */}
          {categories.map(category => {
            const toolsInCat = filteredTools.filter(t => t.category === category);
            if (toolsInCat.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                  {category}
                </span>

                <div className="space-y-0.5">
                  {toolsInCat.map(tool => {
                    const Icon = ICON_MAP[tool.icon] || Calculator;
                    const isActive = activeTool === tool.id;
                    const isFav = favorites.includes(tool.id);

                    return (
                      <div
                        key={tool.id}
                        className={`group flex items-center justify-between rounded-xl transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white shadow-btn-brand font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <button
                          onClick={() => handleToolSelect(tool.id)}
                          className="flex items-center gap-2.5 px-2.5 py-2 flex-1 text-left text-xs min-w-0"
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-500 dark:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-300'}`} />
                          <span className="truncate">{tool.name}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className={`p-1.5 mr-1 rounded-lg transition-colors ${
                            isFav
                              ? 'text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300'
                              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info badge */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 flex items-center justify-between">
          <span>UniCalc v1.0 PRO</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            22 Engines Ready
          </span>
        </div>
      </aside>
    </>
  );
}
