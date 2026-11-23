import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { DollarSign, Percent, Calendar, Calculator } from 'lucide-react';

export default function SimpleInterestCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'calc_si', 'calc_p', 'calc_r', 'calc_t'
  const [target, setTarget] = useState('calc_si');

  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('6.5');
  const [time, setTime] = useState('3'); // in years
  const [timeUnit, setTimeUnit] = useState('years'); // 'years', 'months', 'days'
  const [si, setSi] = useState('1950');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    // Convert time to years
    const rawT = parseFloat(time);
    let tInYears = rawT;
    if (timeUnit === 'months') tInYears = rawT / 12;
    if (timeUnit === 'days') tInYears = rawT / 365;

    let p = parseFloat(principal);
    let r = parseFloat(rate);
    let computedSI = 0;
    let computedP = p;
    let computedR = r;
    let computedT = tInYears;
    let totalAmt = 0;
    let calcSteps = [];

    if (target === 'calc_si') {
      if (isNaN(p) || isNaN(r) || isNaN(rawT)) {
        showToast('Please enter Principal, Rate, and Time', 'error');
        return;
      }
      computedSI = (p * r * tInYears) / 100;
      totalAmt = p + computedSI;

      calcSteps = [
        {
          title: 'Input Parameters',
          math: `Principal (P) = $${p}, Rate (R) = ${r}% p.a., Time (T) = ${rawT} ${timeUnit} (${formatPrecision(tInYears, precision)} years)`
        },
        {
          title: 'Apply Simple Interest Formula',
          desc: 'SI = (P × R × T) / 100',
          math: `SI = (${p} × ${r} × ${formatPrecision(tInYears, precision)}) / 100 = $${formatPrecision(computedSI, precision)}`
        },
        {
          title: 'Calculate Total Final Amount',
          desc: 'Total Amount (A) = Principal (P) + Interest (SI)',
          math: `A = $${p} + $${formatPrecision(computedSI, precision)} = $${formatPrecision(totalAmt, precision)}`
        }
      ];

      setResult({
        si: formatPrecision(computedSI, precision),
        principal: formatPrecision(p, precision),
        rate: formatPrecision(r, precision),
        time: formatPrecision(rawT, precision),
        timeYears: formatPrecision(tInYears, precision),
        totalAmount: formatPrecision(totalAmt, precision),
        ratioInterest: totalAmt > 0 ? ((computedSI / totalAmt) * 100).toFixed(1) : 0,
        ratioPrincipal: totalAmt > 0 ? ((p / totalAmt) * 100).toFixed(1) : 100
      });

      addHistory({
        tool: 'simple_interest',
        toolName: 'Simple Interest',
        expression: `P=$${p}, R=${r}%, T=${rawT} ${timeUnit}`,
        result: `SI = $${formatPrecision(computedSI, precision)}, Total = $${formatPrecision(totalAmt, precision)}`
      });

    } else if (target === 'calc_p') {
      const givenSI = parseFloat(si);
      if (isNaN(givenSI) || isNaN(r) || isNaN(rawT)) {
        showToast('Please enter Interest, Rate, and Time', 'error');
        return;
      }
      computedP = (givenSI * 100) / (r * tInYears);
      totalAmt = computedP + givenSI;

      calcSteps = [
        {
          title: 'Formula for Principal',
          desc: 'P = (SI × 100) / (R × T)',
          math: `P = (${givenSI} × 100) / (${r} × ${formatPrecision(tInYears, precision)}) = $${formatPrecision(computedP, precision)}`
        },
        {
          title: 'Final Amount',
          math: `Total Amount = P + SI = $${formatPrecision(computedP, precision)} + $${givenSI} = $${formatPrecision(totalAmt, precision)}`
        }
      ];

      setResult({
        si: formatPrecision(givenSI, precision),
        principal: formatPrecision(computedP, precision),
        rate: formatPrecision(r, precision),
        time: formatPrecision(rawT, precision),
        timeYears: formatPrecision(tInYears, precision),
        totalAmount: formatPrecision(totalAmt, precision),
        ratioInterest: totalAmt > 0 ? ((givenSI / totalAmt) * 100).toFixed(1) : 0,
        ratioPrincipal: totalAmt > 0 ? ((computedP / totalAmt) * 100).toFixed(1) : 100
      });

    } else if (target === 'calc_r') {
      const givenSI = parseFloat(si);
      if (isNaN(givenSI) || isNaN(p) || isNaN(rawT)) {
        showToast('Please enter Principal, Interest, and Time', 'error');
        return;
      }
      computedR = (givenSI * 100) / (p * tInYears);
      totalAmt = p + givenSI;

      calcSteps = [
        {
          title: 'Formula for Rate of Interest',
          desc: 'R = (SI × 100) / (P × T)',
          math: `R = (${givenSI} × 100) / (${p} × ${formatPrecision(tInYears, precision)}) = ${formatPrecision(computedR, precision)}% p.a.`
        }
      ];

      setResult({
        si: formatPrecision(givenSI, precision),
        principal: formatPrecision(p, precision),
        rate: formatPrecision(computedR, precision),
        time: formatPrecision(rawT, precision),
        timeYears: formatPrecision(tInYears, precision),
        totalAmount: formatPrecision(totalAmt, precision),
        ratioInterest: totalAmt > 0 ? ((givenSI / totalAmt) * 100).toFixed(1) : 0,
        ratioPrincipal: totalAmt > 0 ? ((p / totalAmt) * 100).toFixed(1) : 100
      });

    } else if (target === 'calc_t') {
      const givenSI = parseFloat(si);
      if (isNaN(givenSI) || isNaN(p) || isNaN(r)) {
        showToast('Please enter Principal, Interest, and Rate', 'error');
        return;
      }
      computedT = (givenSI * 100) / (p * r);
      totalAmt = p + givenSI;

      calcSteps = [
        {
          title: 'Formula for Time Duration',
          desc: 'T = (SI × 100) / (P × R)',
          math: `T = (${givenSI} × 100) / (${p} × ${r}) = ${formatPrecision(computedT, precision)} years`
        },
        {
          title: 'Time in Months & Days',
          math: `${formatPrecision(computedT, precision)} years = ${formatPrecision(computedT * 12, precision)} months = ${formatPrecision(computedT * 365, precision)} days`
        }
      ];

      setResult({
        si: formatPrecision(givenSI, precision),
        principal: formatPrecision(p, precision),
        rate: formatPrecision(r, precision),
        time: formatPrecision(computedT, precision),
        timeYears: formatPrecision(computedT, precision),
        totalAmount: formatPrecision(totalAmt, precision),
        ratioInterest: totalAmt > 0 ? ((givenSI / totalAmt) * 100).toFixed(1) : 0,
        ratioPrincipal: totalAmt > 0 ? ((p / totalAmt) * 100).toFixed(1) : 100
      });
    }

    setSteps(calcSteps);
  };

  const handleReset = () => {
    setPrincipal('10000');
    setRate('6.5');
    setTime('3');
    setTimeUnit('years');
    setSi('1950');
    setResult(null);
    setSteps([]);
  };

  return (
    <CalculatorContainer
      title="Simple Interest (SI) Calculator"
      subtitle="Calculate interest, principal, annual rate, duration and total accrued amount"
      toolId="simple_interest"
      onReset={handleReset}
      summaryData={result ? {
        'Principal Amount': `$${result.principal}`,
        'Interest Rate': `${result.rate}%`,
        'Time Duration': `${result.time} ${timeUnit}`,
        'Simple Interest': `$${result.si}`,
        'Total Amount': `$${result.totalAmount}`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Simple Interest (SI)"
        formula="SI = (P × R × T) / 100  |  Amount = P + SI"
        description="Linear interest accumulated purely on the initial principal without compounding."
        variables={[
          { name: 'P', desc: 'Principal amount invested or borrowed' },
          { name: 'R', desc: 'Annual interest rate in %' },
          { name: 'T', desc: 'Time duration in years' },
          { name: 'SI', desc: 'Total Simple Interest earned or paid' },
          { name: 'A', desc: 'Total maturity amount (Principal + SI)' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-5">
          {/* Target Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              What do you want to calculate?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'calc_si', label: 'Interest (SI)' },
                { id: 'calc_p', label: 'Principal (P)' },
                { id: 'calc_r', label: 'Rate (R)' },
                { id: 'calc_t', label: 'Time (T)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setTarget(opt.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    target === opt.id
                      ? 'bg-sky-500 text-white shadow-btn-brand'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            {target !== 'calc_p' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
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
            )}

            {target !== 'calc_si' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Simple Interest (SI)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="any"
                    value={si}
                    onChange={(e) => setSi(e.target.value)}
                    placeholder="1950"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {target !== 'calc_r' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Annual Interest Rate (R) %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="6.5"
                    className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-sm">%</span>
                </div>
              </div>
            )}

            {target !== 'calc_t' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Time Duration (T)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="3"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Unit
                  </label>
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="years" className="bg-slate-900">Years</option>
                    <option value="months" className="bg-slate-900">Months</option>
                    <option value="days" className="bg-slate-900">Days</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand mt-2"
            >
              Calculate {target.replace('calc_', '').toUpperCase()}
            </button>
          </form>
        </div>

        {/* Right Output / Visual Ratio (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10 flex items-center justify-between">
              <span>Calculation Summary</span>
              <span className="text-xs font-normal text-sky-400">Simple Interest</span>
            </h3>

            {result ? (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Total Maturity Amount
                  </span>
                  <div className="text-3xl font-black font-mono text-sky-400 mt-1">
                    ${result.totalAmount}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Principal (P)</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">${result.principal}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Total Interest (SI)</span>
                    <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">${result.si}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Rate (p.a.)</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{result.rate}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Time</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{result.time} {timeUnit}</p>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                    <span className="text-sky-300">Principal: {result.ratioPrincipal}%</span>
                    <span className="text-emerald-300">Interest: {result.ratioInterest}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${result.ratioPrincipal}%` }}
                      className="bg-sky-500 h-full transition-all duration-500"
                    />
                    <div
                      style={{ width: `${result.ratioInterest}%` }}
                      className="bg-emerald-400 h-full transition-all duration-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Calculator className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Enter values and click Calculate to view results & breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `$${result.totalAmount}` : null} />
    </CalculatorContainer>
  );
}
