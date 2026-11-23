import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { gcd, lcm, decimalToFraction, formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Divide, ArrowRightLeft } from 'lucide-react';

export default function FractionCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Tab: 'arithmetic', 'simplify', 'mixed', 'decimal_conv', 'compare'
  const [tab, setTab] = useState('arithmetic');

  // Arithmetic: (n1/d1) [op] (n2/d2)
  const [n1, setN1] = useState('3');
  const [d1, setD1] = useState('4');
  const [op, setOp] = useState('+');
  const [n2, setN2] = useState('2');
  const [d2, setD2] = useState('5');
  const [arithResult, setArithResult] = useState(null);

  // Simplify single fraction
  const [simN, setSimN] = useState('36');
  const [simD, setSimD] = useState('48');
  const [simResult, setSimResult] = useState(null);

  // Mixed Fraction Converter
  const [mixedWhole, setMixedWhole] = useState('2');
  const [mixedNum, setMixedNum] = useState('3');
  const [mixedDen, setMixedDen] = useState('4');
  const [mixedResult, setMixedResult] = useState(null);

  // Decimal to Fraction & Fraction to Decimal
  const [decInput, setDecInput] = useState('0.625');
  const [decResult, setDecResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Fraction Arithmetic
  const handleArith = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const num1 = parseInt(n1, 10);
    const den1 = parseInt(d1, 10);
    const num2 = parseInt(n2, 10);
    const den2 = parseInt(d2, 10);

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
      showToast('Denominators cannot be zero', 'error');
      return;
    }

    let finalNum = 0;
    let finalDen = 1;
    let mathSteps = [];

    const commonDen = lcm(den1, den2);

    if (op === '+') {
      const adjNum1 = num1 * (commonDen / den1);
      const adjNum2 = num2 * (commonDen / den2);
      finalNum = adjNum1 + adjNum2;
      finalDen = commonDen;
      mathSteps = [
        { title: 'Find Common Denominator (LCM)', math: `LCM(${den1}, ${den2}) = ${commonDen}` },
        { title: 'Equivalent Fractions', math: `${num1}/${den1} = ${adjNum1}/${commonDen}  and  ${num2}/${den2} = ${adjNum2}/${commonDen}` },
        { title: 'Add Numerators', math: `(${adjNum1} + ${adjNum2}) / ${commonDen} = ${finalNum}/${finalDen}` }
      ];
    } else if (op === '−') {
      const adjNum1 = num1 * (commonDen / den1);
      const adjNum2 = num2 * (commonDen / den2);
      finalNum = adjNum1 - adjNum2;
      finalDen = commonDen;
      mathSteps = [
        { title: 'Find Common Denominator (LCM)', math: `LCM(${den1}, ${den2}) = ${commonDen}` },
        { title: 'Equivalent Fractions', math: `${num1}/${den1} = ${adjNum1}/${commonDen}  and  ${num2}/${den2} = ${adjNum2}/${commonDen}` },
        { title: 'Subtract Numerators', math: `(${adjNum1} - ${adjNum2}) / ${commonDen} = ${finalNum}/${finalDen}` }
      ];
    } else if (op === '×') {
      finalNum = num1 * num2;
      finalDen = den1 * den2;
      mathSteps = [
        { title: 'Multiply Numerators & Denominators', math: `(${num1} × ${num2}) / (${den1} × ${den2}) = ${finalNum}/${finalDen}` }
      ];
    } else if (op === '÷') {
      if (num2 === 0) {
        showToast('Cannot divide by zero fraction', 'error');
        return;
      }
      finalNum = num1 * den2;
      finalDen = den1 * num2;
      mathSteps = [
        { title: 'Multiply by Reciprocal', math: `(${num1}/${den1}) × (${den2}/${num2}) = (${num1} × ${den2}) / (${den1} × ${num2}) = ${finalNum}/${finalDen}` }
      ];
    }

    const g = gcd(finalNum, finalDen);
    const sNum = finalNum / g;
    const sDen = finalDen / g;

    // Mixed representation if improper
    let mixedStr = null;
    if (Math.abs(sNum) >= sDen && sDen !== 1) {
      const whole = Math.trunc(sNum / sDen);
      const rem = Math.abs(sNum % sDen);
      if (rem !== 0) mixedStr = `${whole} ${rem}/${sDen}`;
    }

    mathSteps.push({
      title: 'Reduce to Lowest Terms (GCD)',
      math: `GCD(${finalNum}, ${finalDen}) = ${g}  ⇒  ${sNum}/${sDen}`
    });

    setSteps(mathSteps);
    setArithResult({
      num: sNum,
      den: sDen,
      fractionStr: sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`,
      decimal: formatPrecision(sNum / sDen, precision),
      mixedStr
    });

    addHistory({
      tool: 'fraction',
      toolName: 'Fraction Calculator',
      expression: `${num1}/${den1} ${op} ${num2}/${den2}`,
      result: `${sNum}/${sDen}`
    });
  };

  // Simplify Single Fraction
  const handleSimplify = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const num = parseInt(simN, 10);
    const den = parseInt(simD, 10);

    if (isNaN(num) || isNaN(den) || den === 0) {
      showToast('Denominator cannot be zero', 'error');
      return;
    }

    const g = gcd(num, den);
    const sNum = num / g;
    const sDen = den / g;

    const calcSteps = [
      { title: 'Find GCD of Numerator and Denominator', math: `GCD(${num}, ${den}) = ${g}` },
      { title: 'Divide Both by GCD', math: `(${num} ÷ ${g}) / (${den} ÷ ${g}) = ${sNum}/${sDen}` }
    ];

    setSteps(calcSteps);
    setSimResult({
      simplified: sDen === 1 ? `${sNum}` : `${sNum}/${sDen}`,
      decimal: formatPrecision(sNum / sDen, precision),
      gcd: g
    });
  };

  // Mixed Fraction Convert
  const handleMixedConv = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const w = parseInt(mixedWhole, 10) || 0;
    const n = parseInt(mixedNum, 10) || 0;
    const d = parseInt(mixedDen, 10) || 1;

    if (d === 0) { showToast('Denominator cannot be zero', 'error'); return; }

    const improperNum = w * d + n;

    const calcSteps = [
      { title: 'Convert Mixed to Improper', desc: 'Numerator = (Whole × Denominator) + Numerator', math: `(${w} × ${d}) + ${n} = ${improperNum}  ⇒  ${improperNum}/${d}` }
    ];

    setSteps(calcSteps);
    setMixedResult({
      improper: `${improperNum}/${d}`,
      decimal: formatPrecision(improperNum / d, precision)
    });
  };

  // Decimal to Fraction Convert
  const handleDecimalConv = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const val = parseFloat(decInput);
    if (isNaN(val)) {
      showToast('Enter a valid decimal number', 'error');
      return;
    }

    const frac = decimalToFraction(val);

    const calcSteps = [
      { title: 'Decimal Representation', math: `${val}` },
      { title: 'Continued Fraction Rational Approximation', math: `= ${frac.str} (Exact: ${frac.num}/${frac.den})` }
    ];

    setSteps(calcSteps);
    setDecResult(frac.str);
  };

  return (
    <CalculatorContainer
      title="Fraction Calculator"
      subtitle="Fraction arithmetic, mixed/improper conversions, GCD reduction & decimal to fraction"
      toolId="fraction"
      onReset={() => {
        setArithResult(null);
        setSimResult(null);
        setMixedResult(null);
        setDecResult(null);
        setSteps([]);
      }}
      summaryData={arithResult ? {
        'Operation': `${n1}/${d1} ${op} ${n2}/${d2}`,
        'Resulting Fraction': arithResult.fractionStr,
        'Decimal Value': arithResult.decimal,
        'Mixed Fraction': arithResult.mixedStr || 'N/A'
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Fraction Arithmetic Rules"
        formula="a/b ± c/d = (ad ± bc)/bd  |  (a/b) × (c/d) = ac/bd  |  (a/b) ÷ (c/d) = ad/bc"
        description="Simplification achieved by dividing numerator and denominator by their greatest common divisor."
      />

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'arithmetic', label: 'Fraction Arithmetic (+, −, ×, ÷)' },
          { id: 'simplify', label: 'Simplify Fraction' },
          { id: 'mixed', label: 'Mixed ⇄ Improper' },
          { id: 'decimal_conv', label: 'Decimal ⇄ Fraction' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t.id ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. Arithmetic */}
      {tab === 'arithmetic' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-5">
          <form onSubmit={handleArith} className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4">
              {/* Fraction 1 */}
              <div className="flex flex-col items-center w-20">
                <input
                  type="number"
                  value={n1}
                  onChange={(e) => setN1(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
                />
                <div className="w-full h-0.5 bg-slate-400 my-1 rounded"></div>
                <input
                  type="number"
                  value={d1}
                  onChange={(e) => setD1(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Operator */}
              <select
                value={op}
                onChange={(e) => setOp(e.target.value)}
                className="px-3 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono text-lg font-bold cursor-pointer"
              >
                <option value="+" className="bg-slate-900">+</option>
                <option value="−" className="bg-slate-900">−</option>
                <option value="×" className="bg-slate-900">×</option>
                <option value="÷" className="bg-slate-900">÷</option>
              </select>

              {/* Fraction 2 */}
              <div className="flex flex-col items-center w-20">
                <input
                  type="number"
                  value={n2}
                  onChange={(e) => setN2(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
                />
                <div className="w-full h-0.5 bg-slate-400 my-1 rounded"></div>
                <input
                  type="number"
                  value={d2}
                  onChange={(e) => setD2(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
                />
              </div>

              <span className="font-mono text-2xl font-bold text-slate-400">=</span>

              {/* Result Preview */}
              <div className="p-3 rounded-2xl bg-sky-500/20 border border-sky-400/40 text-center min-w-[5rem]">
                <span className="text-xl font-mono font-black text-sky-300">
                  {arithResult ? arithResult.fractionStr : '?'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-calc-brand px-8 py-3 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Calculate Fraction
              </button>
            </div>
          </form>

          {arithResult && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
              <div>
                <span className="text-slate-400">Reduced Fraction:</span>
                <p className="text-xl font-bold text-sky-400 mt-1">{arithResult.fractionStr}</p>
              </div>
              <div>
                <span className="text-slate-400">Decimal Value:</span>
                <p className="text-xl font-bold text-emerald-400 mt-1">{arithResult.decimal}</p>
              </div>
              <div>
                <span className="text-slate-400">Mixed Fraction:</span>
                <p className="text-xl font-bold text-purple-400 mt-1">{arithResult.mixedStr || 'None'}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Simplify */}
      {tab === 'simplify' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleSimplify} className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center w-24">
                <input
                  type="number"
                  value={simN}
                  onChange={(e) => setSimN(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base"
                />
                <div className="w-full h-0.5 bg-slate-400 my-1 rounded"></div>
                <input
                  type="number"
                  value={simD}
                  onChange={(e) => setSimD(e.target.value)}
                  className="w-full text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Simplify Fraction
            </button>
          </form>

          {simResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <span className="text-xs text-slate-400">Simplified Form:</span>
              <div className="text-3xl font-black font-mono text-sky-400 mt-0.5">{simResult.simplified}</div>
              <p className="text-xs font-mono text-slate-500 mt-1">Decimal: {simResult.decimal} | GCD: {simResult.gcd}</p>
            </div>
          )}
        </div>
      )}

      {/* 3. Mixed */}
      {tab === 'mixed' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-md mx-auto">
          <form onSubmit={handleMixedConv} className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300 text-center">
              Enter Mixed Fraction (e.g. 2 3/4)
            </label>
            <div className="flex items-center justify-center gap-2">
              <input
                type="number"
                placeholder="Whole"
                value={mixedWhole}
                onChange={(e) => setMixedWhole(e.target.value)}
                className="w-16 text-center py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base"
              />
              <div className="flex flex-col items-center w-16">
                <input
                  type="number"
                  placeholder="Num"
                  value={mixedNum}
                  onChange={(e) => setMixedNum(e.target.value)}
                  className="w-full text-center py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
                <div className="w-full h-0.5 bg-slate-400 my-1 rounded"></div>
                <input
                  type="number"
                  placeholder="Den"
                  value={mixedDen}
                  onChange={(e) => setMixedDen(e.target.value)}
                  className="w-full text-center py-1.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Convert to Improper Fraction
            </button>
          </form>

          {mixedResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <span className="text-xs text-slate-400">Improper Fraction:</span>
              <div className="text-3xl font-black font-mono text-sky-400 mt-0.5">{mixedResult.improper}</div>
              <p className="text-xs font-mono text-slate-500 mt-1">Decimal: {mixedResult.decimal}</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Decimal to Fraction */}
      {tab === 'decimal_conv' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-md mx-auto">
          <form onSubmit={handleDecimalConv} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Decimal Number</label>
              <input
                type="number"
                step="any"
                value={decInput}
                onChange={(e) => setDecInput(e.target.value)}
                placeholder="0.625"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Convert Decimal to Exact Fraction
            </button>
          </form>

          {decResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-xs text-slate-400">Equivalent Rational Fraction:</span>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-0.5">{decResult}</div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} finalResult={arithResult ? arithResult.fractionStr : null} />
    </CalculatorContainer>
  );
}
