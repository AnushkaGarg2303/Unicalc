import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision, gcd, gcdMultiple } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Scale } from 'lucide-react';

export default function RatioProportionCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'simplify', 'compare', 'missing', 'divide', 'direct_inverse', 'continued'
  const [mode, setMode] = useState('simplify');

  // Simplify inputs (comma or colon separated)
  const [ratioInput, setRatioInput] = useState('24:36:48');
  const [simplifyResult, setSimplifyResult] = useState(null);

  // Compare inputs: A:B vs C:D
  const [compA, setCompA] = useState('3');
  const [compB, setCompB] = useState('4');
  const [compC, setCompC] = useState('5');
  const [compD, setCompD] = useState('7');
  const [compareResult, setCompareResult] = useState(null);

  // Missing value: A:B = C:X
  const [missA, setMissA] = useState('4');
  const [missB, setMissB] = useState('6');
  const [missC, setMissC] = useState('10');
  const [missingResult, setMissingResult] = useState(null);

  // Divide amount in ratio
  const [totalAmount, setTotalAmount] = useState('1200');
  const [divideRatio, setDivideRatio] = useState('2:3:5');
  const [divideResult, setDivideResult] = useState(null);

  // Continued proportion: A : B = B : C
  const [contA, setContA] = useState('4');
  const [contC, setContC] = useState('16');
  const [contResult, setContResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Simplify Ratio
  const handleSimplify = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const parts = ratioInput.split(/[:,\s]+/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p) && p > 0);
    if (parts.length < 2) {
      showToast('Enter at least 2 numbers separated by colons or commas', 'error');
      return;
    }

    const g = gcdMultiple(parts);
    const simplified = parts.map(p => p / g);
    const resultStr = simplified.join(' : ');

    const calcSteps = [
      {
        title: 'Input Ratio Terms',
        math: parts.join(' : ')
      },
      {
        title: 'Greatest Common Divisor (GCD / HCF)',
        desc: `GCD of (${parts.join(', ')}) = ${g}`,
        math: `Divide each term by ${g}`
      },
      {
        title: 'Fully Simplified Ratio',
        math: `= ${resultStr}`
      }
    ];

    setSteps(calcSteps);
    setSimplifyResult({
      original: parts.join(' : '),
      simplified: resultStr,
      gcd: g
    });

    addHistory({
      tool: 'ratio_proportion',
      toolName: 'Ratio Simplification',
      expression: parts.join(' : '),
      result: resultStr
    });
  };

  // Compare Ratios: A:B vs C:D
  const handleCompare = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(compA);
    const b = parseFloat(compB);
    const c = parseFloat(compC);
    const d = parseFloat(compD);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || b === 0 || d === 0) {
      showToast('Please enter valid non-zero denominators', 'error');
      return;
    }

    const val1 = a / b;
    const val2 = c / d;
    const cross1 = a * d;
    const cross2 = b * c;

    let verdict = '';
    if (cross1 > cross2) verdict = `${a}:${b} is GREATER than ${c}:${d}`;
    else if (cross1 < cross2) verdict = `${a}:${b} is LESS than ${c}:${d}`;
    else verdict = `${a}:${b} is EQUAL to ${c}:${d}`;

    const calcSteps = [
      {
        title: 'Cross-Multiplication Method',
        desc: 'Compare a × d vs b × c',
        math: `${a} × ${d} = ${cross1}  vs  ${b} × ${c} = ${cross2}`
      },
      {
        title: 'Decimal Values',
        math: `${a}/${b} = ${formatPrecision(val1, precision)}  |  ${c}/${d} = ${formatPrecision(val2, precision)}`
      },
      {
        title: 'Verdict',
        math: verdict
      }
    ];

    setSteps(calcSteps);
    setCompareResult({
      val1: formatPrecision(val1, precision),
      val2: formatPrecision(val2, precision),
      verdict
    });
  };

  // Missing Value: A:B = C:X => X = (B × C) / A
  const handleMissing = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(missA);
    const b = parseFloat(missB);
    const c = parseFloat(missC);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
      showToast('Term A cannot be zero or empty', 'error');
      return;
    }

    const x = (b * c) / a;

    const calcSteps = [
      {
        title: 'Proportion Equality',
        desc: 'A / B = C / X  ⇒  Product of extremes = Product of means',
        math: `A × X = B × C  ⇒  ${a} × X = ${b} × ${c} = ${b * c}`
      },
      {
        title: 'Solve for X',
        math: `X = (${b} × ${c}) / ${a} = ${formatPrecision(x, precision)}`
      }
    ];

    setSteps(calcSteps);
    setMissingResult(formatPrecision(x, precision));

    addHistory({
      tool: 'ratio_proportion',
      toolName: 'Missing Proportion',
      expression: `${a}:${b} = ${c}:X`,
      result: `X = ${formatPrecision(x, precision)}`
    });
  };

  // Divide Amount in Ratio
  const handleDivide = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const tot = parseFloat(totalAmount);
    const parts = divideRatio.split(/[:,\s]+/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p) && p > 0);

    if (isNaN(tot) || parts.length < 2 || tot <= 0) {
      showToast('Enter positive total amount and ratio terms', 'error');
      return;
    }

    const sumRatio = parts.reduce((acc, curr) => acc + curr, 0);
    const shares = parts.map(p => (p / sumRatio) * tot);

    const calcSteps = [
      {
        title: 'Total Ratio Parts',
        math: `Sum of ratio parts = ${parts.join(' + ')} = ${sumRatio}`
      },
      {
        title: 'Value of 1 Part',
        math: `1 Part = $${tot} / ${sumRatio} = $${formatPrecision(tot / sumRatio, precision)}`
      },
      ...parts.map((p, idx) => ({
        title: `Share for part ${p}`,
        math: `(${p} / ${sumRatio}) × $${tot} = $${formatPrecision(shares[idx], precision)}`
      }))
    ];

    setSteps(calcSteps);
    setDivideResult({
      shares: shares.map(s => formatPrecision(s, precision)),
      parts, sumRatio
    });
  };

  // Continued Proportion: A : B = B : C => B = √(A × C) (Mean Proportional)
  const handleContinued = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(contA);
    const c = parseFloat(contC);

    if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0) {
      showToast('Enter valid positive numbers for A and C', 'error');
      return;
    }

    const b = Math.sqrt(a * c);

    const calcSteps = [
      {
        title: 'Mean Proportional Definition',
        desc: 'A : B = B : C  ⇒  B² = A × C',
        math: `B² = ${a} × ${c} = ${a * c}`
      },
      {
        title: 'Mean Proportional (B)',
        math: `B = √(${a * c}) = ${formatPrecision(b, precision)}`
      }
    ];

    setSteps(calcSteps);
    setContResult(formatPrecision(b, precision));
  };

  return (
    <CalculatorContainer
      title="Ratio & Proportion Calculator"
      subtitle="Ratio simplification, comparisons, divide amounts, missing values & mean proportional"
      toolId="ratio_proportion"
      onReset={() => {
        setSimplifyResult(null);
        setCompareResult(null);
        setMissingResult(null);
        setDivideResult(null);
        setContResult(null);
        setSteps([]);
      }}
      summaryData={simplifyResult ? {
        'Input Ratio': simplifyResult.original,
        'Simplified Form': simplifyResult.simplified,
        'Common GCD': simplifyResult.gcd
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Proportion Laws"
        formula="A : B = C : D  ⇒  A·D = B·C  |  Divide in Ratio: Share = (Part / Total Parts) × Amount  |  Mean: B = √(A·C)"
        description="Equal ratios form proportions. Product of extremes equals product of means."
      />

      {/* Mode Buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'simplify', label: 'Simplify Ratio' },
          { id: 'compare', label: 'Compare Ratios' },
          { id: 'missing', label: 'Missing Value (A:B=C:X)' },
          { id: 'divide', label: 'Divide Amount in Ratio' },
          { id: 'continued', label: 'Mean Proportional' }
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === m.id ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 1. Simplify */}
      {mode === 'simplify' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleSimplify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Ratio (separated by colons or commas, e.g. 24:36:48)
              </label>
              <input
                type="text"
                value={ratioInput}
                onChange={(e) => setRatioInput(e.target.value)}
                placeholder="24:36:48"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Simplify Ratio
            </button>
          </form>

          {simplifyResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Simplified Form:</span>
                <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">
                  {simplifyResult.simplified}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">GCD = {simplifyResult.gcd}</span>
            </div>
          )}
        </div>
      )}

      {/* 2. Compare */}
      {mode === 'compare' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleCompare} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase text-sky-300">Ratio 1 (A : B)</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={compA} onChange={(e) => setCompA(e.target.value)} placeholder="A" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
                  <span className="text-slate-400 font-bold">:</span>
                  <input type="number" value={compB} onChange={(e) => setCompB(e.target.value)} placeholder="B" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase text-purple-300">Ratio 2 (C : D)</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={compC} onChange={(e) => setCompC(e.target.value)} placeholder="C" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
                  <span className="text-slate-400 font-bold">:</span>
                  <input type="number" value={compD} onChange={(e) => setCompD(e.target.value)} placeholder="D" className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compare Both Ratios
            </button>
          </form>

          {compareResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span className="text-sm font-bold text-sky-300">{compareResult.verdict}</span>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Ratio 1 value = {compareResult.val1} vs Ratio 2 value = {compareResult.val2}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Missing Value */}
      {mode === 'missing' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleMissing} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              Solve Proportion: A : B = C : X
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              <input type="number" value={missA} onChange={(e) => setMissA(e.target.value)} placeholder="A" className="w-20 px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              <span className="text-slate-400 font-bold">:</span>
              <input type="number" value={missB} onChange={(e) => setMissB(e.target.value)} placeholder="B" className="w-20 px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              <span className="text-slate-400 font-bold">=</span>
              <input type="number" value={missC} onChange={(e) => setMissC(e.target.value)} placeholder="C" className="w-20 px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              <span className="text-slate-400 font-bold">:</span>
              <div className="w-20 px-3 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 font-mono text-sm text-sky-300 font-bold text-center">
                {missingResult || 'X'}
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Solve for X
            </button>
          </form>
        </div>
      )}

      {/* 4. Divide Amount */}
      {mode === 'divide' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleDivide} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="1200"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ratio (e.g. 2:3:5)</label>
                <input
                  type="text"
                  value={divideRatio}
                  onChange={(e) => setDivideRatio(e.target.value)}
                  placeholder="2:3:5"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Divide Amount
            </button>
          </form>

          {divideResult && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 uppercase">Individual Shares:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
                {divideResult.shares.map((sh, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400">Part {divideResult.parts[idx]}:</span>
                    <p className="text-base font-bold font-mono text-sky-400 mt-0.5">${sh}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Mean Proportional */}
      {mode === 'continued' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleContinued} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300">
              Find Mean Proportional B between A and C (A : B = B : C)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Term A</label>
                <input type="number" value={contA} onChange={(e) => setContA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Term C</label>
                <input type="number" value={contC} onChange={(e) => setContC(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Mean Proportional B
            </button>
          </form>

          {contResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span className="text-xs text-slate-400">Mean Proportional B = √(A × C):</span>
              <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">{contResult}</div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} />
    </CalculatorContainer>
  );
}
