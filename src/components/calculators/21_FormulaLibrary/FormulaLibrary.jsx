import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import { FORMULA_DATABASE } from '../../../utils/formulaData';
import { playClickSound } from '../../../utils/soundUtils';
import { BookOpen, Search, ArrowUpRight, Copy, Check, Filter } from 'lucide-react';

export default function FormulaLibrary() {
  const { soundEnabled, setActiveTool, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'All',
    'Algebra',
    'Geometry',
    'Mensuration',
    'Trigonometry',
    'Arithmetic',
    'Percentage',
    'Profit & Loss',
    'Interest',
    'Statistics',
    'Probability',
    'Number System'
  ];

  const filteredFormulas = FORMULA_DATABASE.filter(f => {
    const matchesCat = selectedCat === 'All' || f.category === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      f.title.toLowerCase().includes(q) ||
      f.formula.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (formula, id) => {
    playClickSound(soundEnabled, 'normal');
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    showToast('Formula copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCalculator = (toolId) => {
    playClickSound(soundEnabled, 'action');
    setActiveTool(toolId);
  };

  return (
    <CalculatorContainer
      title="Universal Formula Library"
      subtitle="Comprehensive mathematical, geometric, statistical & financial formula directory with explanations & instant calculation"
      toolId="formula_library"
    >
      {/* Search and Filters */}
      <div className="glass-panel rounded-3xl p-5 border border-white/20 shadow-2xl space-y-4 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formulas by title, equation, or keyword (e.g., quadratic, heron, pythagoras)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => {
                setSelectedCat(c);
                playClickSound(soundEnabled, 'normal');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCat === c ? 'bg-sky-500 text-white shadow-btn-brand' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Formula Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFormulas.map(item => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl p-5 border border-white/15 hover:border-sky-500/40 shadow-xl transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold uppercase text-[10px]">
                  {item.category}
                </span>
                <button
                  onClick={() => handleCopy(item.formula, item.id)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Copy formula"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-100 mt-2">{item.title}</h3>

              {/* Equation Box */}
              <div className="my-3 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-center text-sm sm:text-base font-semibold text-sky-300 shadow-inner overflow-x-auto">
                {item.formula}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

              {/* Variables */}
              {item.variables && item.variables.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5 space-y-1 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Variables:</span>
                  <ul className="space-y-0.5">
                    {item.variables.map((v, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-400">
                        <span className="font-mono text-sky-400 font-semibold">{v.name}:</span>
                        <span>{v.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Example */}
              {item.example && (
                <div className="mt-3 p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block mb-0.5">Example:</span>
                  <span className="font-mono text-emerald-300">{item.example}</span>
                </div>
              )}
            </div>

            {/* Launch calculator button */}
            {item.targetTool && (
              <button
                onClick={() => handleOpenCalculator(item.targetTool)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-bold transition-all"
              >
                <span>Calculate Using This Formula</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </CalculatorContainer>
  );
}
