import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Tag, Scale, Plus, Trash2 } from 'lucide-react';

export default function DiscountCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Tab: 'single', 'successive', 'compare'
  const [tab, setTab] = useState('single');

  // Single discount state
  const [markedPrice, setMarkedPrice] = useState('1200');
  const [discountPercent, setDiscountPercent] = useState('25');
  const [singleResult, setSingleResult] = useState(null);

  // Successive discount state
  const [successiveMP, setSuccessiveMP] = useState('1000');
  const [discounts, setDiscounts] = useState(['20', '10', '5']);
  const [successiveResult, setSuccessiveResult] = useState(null);

  // Compare deals state
  const [compareMP, setCompareMP] = useState('2000');
  const [deal1, setDeal1] = useState('40'); // Flat 40%
  const [deal2A, setDeal2A] = useState('30'); // 30% + 15%
  const [deal2B, setDeal2B] = useState('15');
  const [compareResult, setCompareResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Calculate Single Discount
  const handleSingleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const mp = parseFloat(markedPrice);
    const d = parseFloat(discountPercent);

    if (isNaN(mp) || isNaN(d) || mp < 0 || d < 0) {
      showToast('Please enter valid positive numbers', 'error');
      return;
    }

    const discountAmt = (mp * d) / 100;
    const finalSp = mp - discountAmt;

    const calcSteps = [
      {
        title: 'Original Marked Price (MP)',
        math: `MP = $${mp}, Discount = ${d}%`
      },
      {
        title: 'Calculate Discount Amount',
        desc: 'Discount Amount = (MP × Discount%) / 100',
        math: `Savings = ($${mp} × ${d}) / 100 = $${formatPrecision(discountAmt, precision)}`
      },
      {
        title: 'Final Selling Price after Discount',
        desc: 'SP = MP - Discount Amount',
        math: `SP = $${mp} - $${formatPrecision(discountAmt, precision)} = $${formatPrecision(finalSp, precision)}`
      }
    ];

    setSteps(calcSteps);
    setSingleResult({
      mp: formatPrecision(mp, precision),
      d: formatPrecision(d, precision),
      savings: formatPrecision(discountAmt, precision),
      sp: formatPrecision(finalSp, precision)
    });

    addHistory({
      tool: 'discount',
      toolName: 'Discount Calculator',
      expression: `MP=$${mp}, Discount=${d}%`,
      result: `SP = $${formatPrecision(finalSp, precision)} (Saved $${formatPrecision(discountAmt, precision)})`
    });
  };

  // Calculate Successive Discounts
  const handleSuccessiveCalculate = () => {
    playClickSound(soundEnabled, 'action');
    const mp = parseFloat(successiveMP);
    if (isNaN(mp) || mp <= 0) {
      showToast('Please enter a valid Marked Price', 'error');
      return;
    }

    let currentPrice = mp;
    let stepLog = [];

    let multiplier = 1;
    discounts.forEach((discStr, idx) => {
      const d = parseFloat(discStr) || 0;
      const dec = d / 100;
      multiplier *= (1 - dec);

      const before = currentPrice;
      const discAmt = before * dec;
      currentPrice -= discAmt;

      stepLog.push({
        title: `Discount ${idx + 1}: ${d}% off`,
        desc: `Applied on $${formatPrecision(before, precision)}`,
        math: `Savings = $${formatPrecision(discAmt, precision)}  ⇒  Price becomes $${formatPrecision(currentPrice, precision)}`
      });
    });

    const totalDiscountRate = (1 - multiplier) * 100;
    const totalSavings = mp - currentPrice;

    stepLog.push({
      title: 'Equivalent Single Flat Discount',
      desc: 'Single equivalent discount = [1 - (1 - d₁)(1 - d₂)...] × 100',
      math: `Equivalent Single Discount = ${formatPrecision(totalDiscountRate, precision)}% (Total Savings = $${formatPrecision(totalSavings, precision)})`
    });

    setSteps(stepLog);
    setSuccessiveResult({
      mp: formatPrecision(mp, precision),
      finalSp: formatPrecision(currentPrice, precision),
      totalSavings: formatPrecision(totalSavings, precision),
      equivalentRate: formatPrecision(totalDiscountRate, precision)
    });

    addHistory({
      tool: 'discount',
      toolName: 'Successive Discount',
      expression: `MP=$${mp}, [${discounts.join('%, ')}%]`,
      result: `Final = $${formatPrecision(currentPrice, precision)} (Eq. ${formatPrecision(totalDiscountRate, precision)}%)`
    });
  };

  // Compare Two Deals
  const handleCompareDeals = () => {
    playClickSound(soundEnabled, 'action');
    const mp = parseFloat(compareMP);
    const d1 = parseFloat(deal1);
    const d2a = parseFloat(deal2A);
    const d2b = parseFloat(deal2B);

    if (isNaN(mp) || isNaN(d1) || isNaN(d2a) || isNaN(d2b)) {
      showToast('Please fill all comparison fields', 'error');
      return;
    }

    // Deal 1: Flat d1%
    const sp1 = mp * (1 - d1 / 100);
    const save1 = mp - sp1;

    // Deal 2: Successive d2a% + d2b%
    const eqRate2 = (1 - (1 - d2a / 100) * (1 - d2b / 100)) * 100;
    const sp2 = mp * (1 - eqRate2 / 100);
    const save2 = mp - sp2;

    const diff = Math.abs(sp1 - sp2);
    const winner = sp1 < sp2 ? 'Deal 1' : sp2 < sp1 ? 'Deal 2' : 'Both deals are equal';

    const compareSteps = [
      {
        title: 'Deal 1 Evaluation (Flat Discount)',
        math: `Flat ${d1}% on $${mp}  ⇒  Final Price = $${formatPrecision(sp1, precision)} (You Save $${formatPrecision(save1, precision)})`
      },
      {
        title: 'Deal 2 Evaluation (Successive)',
        desc: `Successive ${d2a}% + ${d2b}%  ⇒  Single Equivalent Rate = ${d2a} + ${d2b} - (${d2a}×${d2b})/100 = ${formatPrecision(eqRate2, precision)}%`,
        math: `Final Price = $${formatPrecision(sp2, precision)} (You Save $${formatPrecision(save2, precision)})`
      },
      {
        title: 'Comparison Verdict',
        desc: `${winner} offers lower price!`,
        math: `Price difference = $${formatPrecision(diff, precision)}`
      }
    ];

    setSteps(compareSteps);
    setCompareResult({
      sp1: formatPrecision(sp1, precision),
      sp2: formatPrecision(sp2, precision),
      save1: formatPrecision(save1, precision),
      save2: formatPrecision(save2, precision),
      eqRate2: formatPrecision(eqRate2, precision),
      winner,
      diff: formatPrecision(diff, precision)
    });
  };

  return (
    <CalculatorContainer
      title="Discount Calculator"
      subtitle="Single discount, marked price solver, successive chain discounts & deal comparison"
      toolId="discount"
      onReset={() => {
        setMarkedPrice('1200');
        setDiscountPercent('25');
        setSingleResult(null);
        setSuccessiveResult(null);
        setCompareResult(null);
        setSteps([]);
      }}
      summaryData={singleResult ? {
        'Marked Price (MP)': `$${singleResult.mp}`,
        'Discount Rate': `${singleResult.d}%`,
        'Total Savings': `$${singleResult.savings}`,
        'Final Selling Price': `$${singleResult.sp}`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Discount Formulas"
        formula="Discount = (MP × D%) / 100  |  SP = MP × (1 - D/100)  |  D_eq = 1 - (1 - d₁)(1 - d₂)"
        description="Successive discounts are applied multiplicatively onto the reduced balance, not added linearly."
      />

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 w-fit mb-4">
        {[
          { id: 'single', label: 'Single Discount' },
          { id: 'successive', label: 'Successive / Multiple' },
          { id: 'compare', label: 'Compare 2 Deals' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t.id ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleSingleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Marked / Original Price (MP)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="any"
                    value={markedPrice}
                    onChange={(e) => setMarkedPrice(e.target.value)}
                    placeholder="1200"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Discount Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="25"
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-sm">%</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand mt-2"
              >
                Compute Discounted Price
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">
                Discount Breakdown
              </h3>
              {singleResult ? (
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Final Selling Price (SP)
                    </span>
                    <div className="text-3xl font-black font-mono text-sky-400 mt-1">
                      ${singleResult.sp}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-emerald-300">You Save</span>
                      <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">${singleResult.savings}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Discount Off</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{singleResult.d}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter price & percentage to see savings.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'successive' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Marked Price (MP)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  value={successiveMP}
                  onChange={(e) => setSuccessiveMP(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Sequential Discount Percentages (%)
                </label>
                <button
                  onClick={() => setDiscounts([...discounts, '10'])}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Tier
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {discounts.map((dVal, idx) => (
                  <div key={idx} className="flex items-center bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                    <span className="text-xs text-slate-400 mr-1">#{idx + 1}:</span>
                    <input
                      type="number"
                      value={dVal}
                      onChange={(e) => {
                        const updated = [...discounts];
                        updated[idx] = e.target.value;
                        setDiscounts(updated);
                      }}
                      className="w-14 bg-transparent text-slate-100 text-xs font-mono focus:outline-none"
                    />
                    <span className="text-xs text-slate-400">%</span>
                    {discounts.length > 1 && (
                      <button
                        onClick={() => setDiscounts(discounts.filter((_, i) => i !== idx))}
                        className="ml-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSuccessiveCalculate}
            className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
          >
            Compute Successive Discounts
          </button>

          {successiveResult && (
            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Original MP:</span>
                <p className="font-mono font-bold text-slate-100 text-sm">${successiveResult.mp}</p>
              </div>
              <div>
                <span className="text-slate-400">Equivalent Flat Rate:</span>
                <p className="font-mono font-bold text-sky-400 text-sm">{successiveResult.equivalentRate}%</p>
              </div>
              <div>
                <span className="text-slate-400">Total Savings:</span>
                <p className="font-mono font-bold text-emerald-400 text-sm">${successiveResult.totalSavings}</p>
              </div>
              <div>
                <span className="text-slate-400">Final Price (SP):</span>
                <p className="font-mono font-bold text-slate-100 text-sm">${successiveResult.finalSp}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'compare' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Item Marked Price (MP) for Comparison
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-2 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                value={compareMP}
                onChange={(e) => setCompareMP(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase text-sky-300">Deal 1: Flat Single Discount</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={deal1}
                  onChange={(e) => setDeal1(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-sm font-mono text-slate-100"
                />
                <span className="text-xs text-slate-400">% Flat Discount</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="text-xs font-bold uppercase text-purple-300">Deal 2: Double / Successive Discount</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={deal2A}
                  onChange={(e) => setDeal2A(e.target.value)}
                  className="w-20 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-sm font-mono text-slate-100"
                />
                <span className="text-xs text-slate-400">% + </span>
                <input
                  type="number"
                  value={deal2B}
                  onChange={(e) => setDeal2B(e.target.value)}
                  className="w-20 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-sm font-mono text-slate-100"
                />
                <span className="text-xs text-slate-400">% Successive</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompareDeals}
            className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
          >
            Compare Both Deals
          </button>

          {compareResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-sky-300">Best Option: {compareResult.winner}</span>
                <span className="text-xs font-mono text-emerald-400">Save ${compareResult.diff} more!</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-white/10">
                <div>
                  <span className="text-slate-400">Deal 1 Final Price:</span>
                  <p className="font-bold text-slate-100">${compareResult.sp1}</p>
                </div>
                <div>
                  <span className="text-slate-400">Deal 2 Final Price (Eq. {compareResult.eqRate2}%):</span>
                  <p className="font-bold text-slate-100">${compareResult.sp2}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} finalResult={singleResult ? `$${singleResult.sp}` : null} />
    </CalculatorContainer>
  );
}
