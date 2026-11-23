import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { TrendingUp, Scale, Check } from 'lucide-react';

export default function CompoundInterestCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('8');
  const [time, setTime] = useState('5'); // in years
  const [frequency, setFrequency] = useState('12'); // 1 = annual, 2 = semi-annual, 4 = quarterly, 12 = monthly, 365 = daily

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const freqLabels = {
    '1': 'Annually (n = 1)',
    '2': 'Half-Yearly (n = 2)',
    '4': 'Quarterly (n = 4)',
    '12': 'Monthly (n = 12)',
    '365': 'Daily (n = 365)'
  };

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);
    const n = parseFloat(frequency);

    if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R < 0 || T <= 0) {
      showToast('Please enter valid positive numbers for Principal, Rate, and Time', 'error');
      return;
    }

    const rDecimal = R / 100;
    const nt = n * T;
    const base = 1 + (rDecimal / n);
    const finalAmount = P * Math.pow(base, nt);
    const compoundInterest = finalAmount - P;

    // Simple interest equivalent for comparison
    const simpleInterest = (P * R * T) / 100;
    const simpleAmount = P + simpleInterest;
    const diffInterest = compoundInterest - simpleInterest;

    const calcSteps = [
      {
        title: 'Input Parameters',
        math: `P = $${P}, Rate (R) = ${R}% (r = ${rDecimal}), Time (t) = ${T} years, Frequency (n) = ${n} times/year`
      },
      {
        title: 'Compound Interest Formula',
        desc: 'A = P × (1 + r/n)^(n×t)',
        math: `A = ${P} × (1 + ${rDecimal}/${n})^(${n} × ${T}) = ${P} × (${formatPrecision(base, 6)})^(${nt})`
      },
      {
        title: 'Evaluate Final Maturity Amount',
        math: `A = $${formatPrecision(finalAmount, precision)}`
      },
      {
        title: 'Compute Compound Interest (CI)',
        desc: 'CI = A - P',
        math: `CI = $${formatPrecision(finalAmount, precision)} - $${P} = $${formatPrecision(compoundInterest, precision)}`
      },
      {
        title: 'SI vs CI Comparative Analysis',
        desc: 'Simple Interest would have yielded only:',
        math: `SI = ($${P} × ${R} × ${T}) / 100 = $${formatPrecision(simpleInterest, precision)}. Extra earned by Compounding = +$${formatPrecision(diffInterest, precision)}`
      }
    ];

    setSteps(calcSteps);

    const resObj = {
      principal: formatPrecision(P, precision),
      rate: formatPrecision(R, precision),
      time: formatPrecision(T, precision),
      frequencyLabel: freqLabels[frequency],
      finalAmount: formatPrecision(finalAmount, precision),
      compoundInterest: formatPrecision(compoundInterest, precision),
      simpleInterest: formatPrecision(simpleInterest, precision),
      diff: formatPrecision(diffInterest, precision),
      ratioCI: ((compoundInterest / finalAmount) * 100).toFixed(1),
      ratioP: ((P / finalAmount) * 100).toFixed(1)
    };

    setResult(resObj);

    addHistory({
      tool: 'compound_interest',
      toolName: 'Compound Interest',
      expression: `P=$${P}, R=${R}%, T=${T}y (${freqLabels[frequency]})`,
      result: `CI = $${resObj.compoundInterest}, Final = $${resObj.finalAmount}`
    });
  };

  const handleReset = () => {
    setPrincipal('10000');
    setRate('8');
    setTime('5');
    setFrequency('12');
    setResult(null);
    setSteps([]);
  };

  return (
    <CalculatorContainer
      title="Compound Interest (CI) Calculator"
      subtitle="Annual, semi-annual, quarterly, monthly, and daily compounding with SI vs CI comparative analysis"
      toolId="compound_interest"
      onReset={handleReset}
      summaryData={result ? {
        'Initial Principal': `$${result.principal}`,
        'Annual Rate': `${result.rate}%`,
        'Duration': `${result.time} Years`,
        'Compounding Frequency': result.frequencyLabel,
        'Compound Interest': `$${result.compoundInterest}`,
        'Final Maturity Amount': `$${result.finalAmount}`,
        'Bonus over Simple Interest': `+$${result.diff}`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Compound Interest Formula"
        formula="A = P × (1 + r/n)^(nt)  |  CI = A - P"
        description="Exponential interest where interest accrued in earlier periods itself generates further interest in subsequent periods."
        variables={[
          { name: 'P', desc: 'Principal initial sum' },
          { name: 'r', desc: 'Annual nominal interest rate in decimal form (R / 100)' },
          { name: 'n', desc: 'Number of compounding periods per year (1=annual, 2=semi, 4=quarterly, 12=monthly, 365=daily)' },
          { name: 't', desc: 'Time in years' },
          { name: 'A', desc: 'Final accumulated amount including interest' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Principal Amount (P)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  step="any"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="10000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Annual Rate (R) %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="8"
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  step="any"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="5"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { val: '1', label: 'Annually (1x)' },
                  { val: '2', label: 'Half-Yearly (2x)' },
                  { val: '4', label: 'Quarterly (4x)' },
                  { val: '12', label: 'Monthly (12x)' },
                  { val: '365', label: 'Daily (365x)' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setFrequency(item.val)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      frequency === item.val
                        ? 'bg-sky-500 text-white shadow-btn-brand'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand mt-2"
            >
              Calculate Compound Growth
            </button>
          </form>
        </div>

        {/* Output & Comparison (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10 flex items-center justify-between">
              <span>Compound Maturity Summary</span>
              <span className="text-xs font-normal text-sky-400">{freqLabels[frequency]}</span>
            </h3>

            {result ? (
              <div className="space-y-4 mt-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Final Maturity Balance
                  </span>
                  <div className="text-3xl font-black font-mono text-sky-400 mt-1">
                    ${result.finalAmount}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Principal (P)</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">${result.principal}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Total Interest (CI)</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">${result.compoundInterest}</p>
                  </div>
                </div>

                {/* SI vs CI Side-by-Side Comparison Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                    <Scale className="w-4 h-4 text-sky-400" />
                    SI vs CI Comparison
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400">Simple Interest:</span>
                      <p className="font-mono font-semibold text-slate-200">${result.simpleInterest}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Compound Interest:</span>
                      <p className="font-mono font-semibold text-emerald-400">${result.compoundInterest}</p>
                    </div>
                  </div>
                  <div className="pt-1 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Compounding Advantage:</span>
                    <span className="font-mono font-bold text-emerald-400">+{result.diff}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Configure parameters and calculate to see compounding yield.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `$${result.finalAmount}` : null} />
    </CalculatorContainer>
  );
}
