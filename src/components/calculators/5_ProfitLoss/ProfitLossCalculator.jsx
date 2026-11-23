import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';

export default function ProfitLossCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'single' (basic CP/SP/Find) vs 'multi' (multi-item overall ledger)
  const [activeTab, setActiveTab] = useState('single');

  // Single mode sub-type:
  // 'given_cp_sp' -> input CP & SP -> calculate Profit/Loss & %
  // 'find_sp' -> input CP & Profit/Loss % -> find SP
  // 'find_cp' -> input SP & Profit/Loss % -> find CP
  const [singleMode, setSingleMode] = useState('given_cp_sp');

  const [cp, setCp] = useState('500');
  const [sp, setSp] = useState('650');
  const [percentType, setPercentType] = useState('profit'); // 'profit' or 'loss'
  const [pctValue, setPctValue] = useState('20');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  // Multi-item ledger state
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', cp: '100', sp: '130' },
    { id: 2, name: 'Item 2', cp: '250', sp: '220' },
    { id: 3, name: 'Item 3', cp: '400', sp: '520' }
  ]);
  const [multiResult, setMultiResult] = useState(null);

  const handleSingleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    let calcSteps = [];

    if (singleMode === 'given_cp_sp') {
      const numCp = parseFloat(cp);
      const numSp = parseFloat(sp);

      if (isNaN(numCp) || isNaN(numSp) || numCp <= 0) {
        showToast('Please enter valid positive numbers for CP and SP', 'error');
        return;
      }

      const diff = numSp - numCp;
      const isProfit = diff >= 0;
      const profitLossAmt = Math.abs(diff);
      const pct = (profitLossAmt / numCp) * 100;

      calcSteps = [
        {
          title: 'Input Prices',
          math: `Cost Price (CP) = $${numCp}, Selling Price (SP) = $${numSp}`
        },
        {
          title: isProfit ? 'Profit Calculation (SP > CP)' : 'Loss Calculation (CP > SP)',
          desc: isProfit ? 'Profit = SP - CP' : 'Loss = CP - SP',
          math: `${isProfit ? 'Profit' : 'Loss'} = |$${numSp} - $${numCp}| = $${formatPrecision(profitLossAmt, precision)}`
        },
        {
          title: 'Percentage Relative to Cost Price',
          desc: isProfit ? 'Profit % = (Profit / CP) × 100' : 'Loss % = (Loss / CP) × 100',
          math: `% = ($${formatPrecision(profitLossAmt, precision)} / $${numCp}) × 100 = ${formatPrecision(pct, precision)}%`
        }
      ];

      setSteps(calcSteps);
      setResult({
        type: isProfit ? 'profit' : 'loss',
        amount: formatPrecision(profitLossAmt, precision),
        pct: formatPrecision(pct, precision),
        cp: formatPrecision(numCp, precision),
        sp: formatPrecision(numSp, precision)
      });

      addHistory({
        tool: 'profit_loss',
        toolName: 'Profit & Loss',
        expression: `CP=$${numCp}, SP=$${numSp}`,
        result: `${isProfit ? 'Profit' : 'Loss'} = $${formatPrecision(profitLossAmt, precision)} (${formatPrecision(pct, precision)}%)`
      });

    } else if (singleMode === 'find_sp') {
      const numCp = parseFloat(cp);
      const p = parseFloat(pctValue);

      if (isNaN(numCp) || isNaN(p) || numCp <= 0 || p < 0) {
        showToast('Please enter valid Cost Price and %', 'error');
        return;
      }

      let numSp = 0;
      if (percentType === 'profit') {
        numSp = numCp * (1 + p / 100);
        calcSteps = [
          {
            title: 'Find SP from CP & Profit %',
            desc: 'SP = CP × (1 + Profit% / 100)',
            math: `SP = $${numCp} × (1 + ${p}/100) = $${numCp} × ${1 + p / 100} = $${formatPrecision(numSp, precision)}`
          }
        ];
      } else {
        numSp = numCp * (1 - p / 100);
        calcSteps = [
          {
            title: 'Find SP from CP & Loss %',
            desc: 'SP = CP × (1 - Loss% / 100)',
            math: `SP = $${numCp} × (1 - ${p}/100) = $${numCp} × ${1 - p / 100} = $${formatPrecision(numSp, precision)}`
          }
        ];
      }

      const amt = Math.abs(numSp - numCp);
      setSteps(calcSteps);
      setResult({
        type: percentType,
        amount: formatPrecision(amt, precision),
        pct: formatPrecision(p, precision),
        cp: formatPrecision(numCp, precision),
        sp: formatPrecision(numSp, precision)
      });

    } else if (singleMode === 'find_cp') {
      const numSp = parseFloat(sp);
      const p = parseFloat(pctValue);

      if (isNaN(numSp) || isNaN(p) || numSp <= 0 || p < 0) {
        showToast('Please enter valid Selling Price and %', 'error');
        return;
      }

      let numCp = 0;
      if (percentType === 'profit') {
        numCp = numSp / (1 + p / 100);
        calcSteps = [
          {
            title: 'Find CP from SP & Profit %',
            desc: 'CP = SP / (1 + Profit% / 100)',
            math: `CP = $${numSp} / (1 + ${p}/100) = $${formatPrecision(numCp, precision)}`
          }
        ];
      } else {
        if (p >= 100) {
          showToast('Loss % cannot be 100% or greater', 'error');
          return;
        }
        numCp = numSp / (1 - p / 100);
        calcSteps = [
          {
            title: 'Find CP from SP & Loss %',
            desc: 'CP = SP / (1 - Loss% / 100)',
            math: `CP = $${numSp} / (1 - ${p}/100) = $${formatPrecision(numCp, precision)}`
          }
        ];
      }

      const amt = Math.abs(numSp - numCp);
      setSteps(calcSteps);
      setResult({
        type: percentType,
        amount: formatPrecision(amt, precision),
        pct: formatPrecision(p, precision),
        cp: formatPrecision(numCp, precision),
        sp: formatPrecision(numSp, precision)
      });
    }
  };

  // Multi-item overall profit/loss calculation
  const handleMultiCalculate = () => {
    playClickSound(soundEnabled, 'action');

    let totalCp = 0;
    let totalSp = 0;

    for (let item of items) {
      const c = parseFloat(item.cp) || 0;
      const s = parseFloat(item.sp) || 0;
      totalCp += c;
      totalSp += s;
    }

    if (totalCp <= 0) {
      showToast('Total Cost Price must be greater than zero', 'error');
      return;
    }

    const netDiff = totalSp - totalCp;
    const isProfit = netDiff >= 0;
    const netAmt = Math.abs(netDiff);
    const netPct = (netAmt / totalCp) * 100;

    const calcSteps = [
      {
        title: 'Multi-Item Aggregate Totals',
        math: `Total CP = $${formatPrecision(totalCp, precision)}, Total SP = $${formatPrecision(totalSp, precision)} across ${items.length} items`
      },
      {
        title: isProfit ? 'Overall Net Profit' : 'Overall Net Loss',
        desc: isProfit ? 'Net Profit = Total SP - Total CP' : 'Net Loss = Total CP - Total SP',
        math: `Net = $${formatPrecision(netAmt, precision)}`
      },
      {
        title: 'Overall Percentage Margin',
        math: `Margin % = ($${formatPrecision(netAmt, precision)} / $${formatPrecision(totalCp, precision)}) × 100 = ${formatPrecision(netPct, precision)}%`
      }
    ];

    setSteps(calcSteps);
    setMultiResult({
      totalCp: formatPrecision(totalCp, precision),
      totalSp: formatPrecision(totalSp, precision),
      netAmt: formatPrecision(netAmt, precision),
      netPct: formatPrecision(netPct, precision),
      isProfit
    });

    addHistory({
      tool: 'profit_loss',
      toolName: 'Profit & Loss (Multi)',
      expression: `${items.length} items (Total CP=$${totalCp})`,
      result: `${isProfit ? 'Profit' : 'Loss'} $${formatPrecision(netAmt, precision)} (${formatPrecision(netPct, precision)}%)`
    });
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: Date.now(), name: `Item ${prev.length + 1}`, cp: '100', sp: '120' }
    ]);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id, field, val) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  return (
    <CalculatorContainer
      title="Profit & Loss Calculator"
      subtitle="Single item margins, reverse CP/SP derivation & multi-product portfolio ledger"
      toolId="profit_loss"
      onReset={() => {
        setCp('500');
        setSp('650');
        setPctValue('20');
        setResult(null);
        setMultiResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        'Cost Price': `$${result.cp}`,
        'Selling Price': `$${result.sp}`,
        'Outcome': result.type === 'profit' ? 'Profit' : 'Loss',
        'Amount': `$${result.amount}`,
        'Percentage': `${result.pct}%`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Profit and Loss Formulas"
        formula="Profit = SP - CP  |  Loss = CP - SP  |  Profit % = (Profit/CP) × 100  |  SP = CP × (1 ± Rate/100)"
        description="Profit or Loss percentage is always calculated with respect to Cost Price (CP)."
      />

      {/* Mode switcher tab: Single vs Multi */}
      <div className="flex gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 w-fit mb-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'single' ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
          }`}
        >
          Single Transaction & Reverse Solver
        </button>
        <button
          onClick={() => setActiveTab('multi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'multi' ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
          }`}
        >
          Multi-Item Overall Ledger
        </button>
      </div>

      {activeTab === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
              {[
                { id: 'given_cp_sp', label: 'Given CP & SP' },
                { id: 'find_sp', label: 'Find SP' },
                { id: 'find_cp', label: 'Find CP' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSingleMode(opt.id)}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                    singleMode === opt.id ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSingleCalculate} className="space-y-4">
              {singleMode !== 'find_cp' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cost Price (CP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="any"
                      value={cp}
                      onChange={(e) => setCp(e.target.value)}
                      placeholder="500"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {singleMode !== 'find_sp' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Selling Price (SP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="any"
                      value={sp}
                      onChange={(e) => setSp(e.target.value)}
                      placeholder="650"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {singleMode !== 'given_cp_sp' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Margin Type
                    </label>
                    <select
                      value={percentType}
                      onChange={(e) => setPercentType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
                    >
                      <option value="profit" className="bg-slate-900">Profit (%)</option>
                      <option value="loss" className="bg-slate-900">Loss (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Percentage %
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={pctValue}
                      onChange={(e) => setPctValue(e.target.value)}
                      placeholder="20"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand mt-2"
              >
                Calculate Margin
              </button>
            </form>
          </div>

          {/* Result Card (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">
                Profit & Loss Result
              </h3>

              {result ? (
                <div className="space-y-4 mt-4">
                  <div className={`p-4 rounded-2xl border text-center ${
                    result.type === 'profit'
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  }`}>
                    <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-bold tracking-wider mb-1">
                      {result.type === 'profit' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Net Profit</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                          <span className="text-rose-300">Net Loss</span>
                        </>
                      )}
                    </div>
                    <div className={`text-3xl font-black font-mono ${
                      result.type === 'profit' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      ${result.amount}
                    </div>
                    <span className="text-sm font-mono font-semibold text-slate-300">
                      ({result.pct}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Cost Price (CP)</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">${result.cp}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Selling Price (SP)</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">${result.sp}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter parameters and compute to see detailed outcome.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Item Ledger */
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-slate-100">Overall Multi-Item Inventory Ledger</h3>
            <button
              onClick={addItem}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-btn-brand"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase">
                <tr>
                  <th className="p-3 rounded-l-lg">Item Name</th>
                  <th className="p-3">Cost Price (CP)</th>
                  <th className="p-3">Selling Price (SP)</th>
                  <th className="p-3">Difference</th>
                  <th className="p-3 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => {
                  const c = parseFloat(item.cp) || 0;
                  const s = parseFloat(item.sp) || 0;
                  const diff = s - c;
                  return (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="bg-transparent text-slate-100 focus:outline-none font-medium w-28 sm:w-auto"
                        />
                      </td>
                      <td className="p-3">
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1.5 text-slate-500">$</span>
                          <input
                            type="number"
                            value={item.cp}
                            onChange={(e) => updateItem(item.id, 'cp', e.target.value)}
                            className="w-full pl-5 pr-2 py-1 rounded bg-black/30 border border-white/10 font-mono text-slate-200"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1.5 text-slate-500">$</span>
                          <input
                            type="number"
                            value={item.sp}
                            onChange={(e) => updateItem(item.id, 'sp', e.target.value)}
                            className="w-full pl-5 pr-2 py-1 rounded bg-black/30 border border-white/10 font-mono text-slate-200"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-mono font-semibold">
                        <span className={diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleMultiCalculate}
              className="w-full sm:w-auto btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Aggregate Profit & Loss
            </button>

            {multiResult && (
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>Total CP: <span className="font-bold text-slate-100">${multiResult.totalCp}</span></div>
                <div>Total SP: <span className="font-bold text-slate-100">${multiResult.totalSp}</span></div>
                <div className={`font-bold ${multiResult.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Net: {multiResult.isProfit ? '+' : '-'}${multiResult.netAmt} ({multiResult.netPct}%)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <StepByStepSolution steps={steps} finalResult={result ? `$${result.amount}` : null} />
    </CalculatorContainer>
  );
}
