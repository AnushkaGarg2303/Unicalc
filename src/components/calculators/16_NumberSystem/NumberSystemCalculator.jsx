import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { playClickSound } from '../../../utils/soundUtils';
import { Binary, Copy, Check } from 'lucide-react';

export default function NumberSystemCalculator() {
  const { soundEnabled, addHistory, showToast } = useApp();

  const [inputVal, setInputVal] = useState('255');
  const [fromBase, setFromBase] = useState('10');
  const [toBase, setToBase] = useState('2');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const basePresets = [
    { label: 'Binary (Base 2)', base: '2' },
    { label: 'Octal (Base 8)', base: '8' },
    { label: 'Decimal (Base 10)', base: '10' },
    { label: 'Hexadecimal (Base 16)', base: '16' }
  ];

  const handleConvert = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const cleanInput = inputVal.trim();
    const fBase = parseInt(fromBase, 10);
    const tBase = parseInt(toBase, 10);

    if (!cleanInput) {
      showToast('Please enter a number to convert', 'error');
      return;
    }

    if (fBase < 2 || fBase > 36 || tBase < 2 || tBase > 36) {
      showToast('Bases must be between 2 and 36', 'error');
      return;
    }

    // Parse to base-10 integer
    let decimalVal = 0;
    try {
      decimalVal = parseInt(cleanInput, fBase);
      if (isNaN(decimalVal)) {
        showToast(`Invalid digit found for Base ${fBase}`, 'error');
        return;
      }
    } catch {
      showToast(`Invalid input for Base ${fBase}`, 'error');
      return;
    }

    // Convert decimal to target base
    const convertedStr = decimalVal.toString(tBase).toUpperCase();

    // Universal cross-conversions
    const binStr = decimalVal.toString(2);
    const octStr = decimalVal.toString(8);
    const decStr = decimalVal.toString(10);
    const hexStr = decimalVal.toString(16).toUpperCase();

    // Generate Step-by-Step explanation
    const calcSteps = [];

    // Step 1: Input to Decimal (Polynomial expansion)
    if (fBase !== 10) {
      const chars = cleanInput.split('').reverse();
      const terms = chars.map((ch, idx) => {
        const val = parseInt(ch, fBase);
        return `${val} × ${fBase}^${idx}`;
      }).reverse();
      calcSteps.push({
        title: `Convert Base ${fBase} to Decimal (Base 10)`,
        desc: 'Positional polynomial expansion method: Sum of (digit × base^position)',
        math: `(${cleanInput})_${fBase} = ${terms.join(' + ')} = ${decimalVal}_10`
      });
    } else {
      calcSteps.push({
        title: 'Starting Decimal Value',
        math: `Value = ${decimalVal}`
      });
    }

    // Step 2: Decimal to Target Base (Repeated division)
    if (tBase !== 10) {
      const divisionSteps = [];
      let temp = decimalVal;
      while (temp > 0) {
        const q = Math.floor(temp / tBase);
        const rem = temp % tBase;
        const remChar = rem.toString(tBase).toUpperCase();
        divisionSteps.push(`${temp} ÷ ${tBase} = ${q}  (Remainder: ${remChar})`);
        temp = q;
      }
      calcSteps.push({
        title: `Convert Decimal to Base ${tBase}`,
        desc: 'Repeated division method: Divide by target base and read remainders from bottom to top',
        math: divisionSteps.length > 0 ? divisionSteps.join('\n') : `0 ÷ ${tBase} = 0 (Remainder: 0)`
      });
    }

    calcSteps.push({
      title: 'Final Converted Output',
      math: `(${cleanInput})_${fBase} = (${convertedStr})_${tBase}`
    });

    setSteps(calcSteps);
    setResult({
      converted: convertedStr,
      decimalVal,
      binStr,
      octStr,
      decStr,
      hexStr,
      fromBase: fBase,
      toBase: tBase,
      cleanInput
    });

    addHistory({
      tool: 'number_system',
      toolName: 'Number System Converter',
      expression: `(${cleanInput})_${fBase}`,
      result: `(${convertedStr})_${tBase}`
    });
  };

  return (
    <CalculatorContainer
      title="Number System Converter"
      subtitle="Binary, Octal, Decimal, Hexadecimal & custom radix conversion (Base 2–36) with polynomial steps"
      toolId="number_system"
      onReset={() => {
        setInputVal('255');
        setFromBase('10');
        setToBase('2');
        setResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        'Input': `(${result.cleanInput}) Base ${result.fromBase}`,
        'Converted Result': `(${result.converted}) Base ${result.toBase}`,
        'Binary': result.binStr,
        'Decimal': result.decStr,
        'Hexadecimal': result.hexStr
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Positional Radix Polynomial"
        formula="N₁₀ = Σ (dᵢ × Bⁱ)  |  Repeated Division: N = q·B + r"
        description="Every numeral system encodes values via positional weights of base B. Hex uses digits 0-9 and A-F."
      />

      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-6">
        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Input Number Value
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. 255, 1101, 77, 1A"
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base uppercase focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">From Radix / Base</label>
              <select
                value={fromBase}
                onChange={(e) => setFromBase(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              >
                {basePresets.map(p => (
                  <option key={p.base} value={p.base} className="bg-slate-900">{p.label}</option>
                ))}
                {Array.from({ length: 33 }, (_, i) => i + 2)
                  .filter(b => ![2, 8, 10, 16].includes(b))
                  .map(b => (
                    <option key={b} value={b} className="bg-slate-900">Base {b}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To Radix / Base</label>
              <select
                value={toBase}
                onChange={(e) => setToBase(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-sky-500"
              >
                {basePresets.map(p => (
                  <option key={p.base} value={p.base} className="bg-slate-900">{p.label}</option>
                ))}
                {Array.from({ length: 33 }, (_, i) => i + 2)
                  .filter(b => ![2, 8, 10, 16].includes(b))
                  .map(b => (
                    <option key={b} value={b} className="bg-slate-900">Base {b}</option>
                  ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
          >
            Convert Base System
          </button>
        </form>

        {result && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Main Result */}
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <span className="text-xs uppercase font-bold text-sky-300">
                Converted to Base {result.toBase}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-sky-400 mt-1 break-all">
                {result.converted}
              </div>
            </div>

            {/* Standard 4-System Quick Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Binary (Base 2)</span>
                <p className="font-mono font-bold text-slate-100 text-sm mt-0.5 break-all">{result.binStr}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Octal (Base 8)</span>
                <p className="font-mono font-bold text-slate-100 text-sm mt-0.5 break-all">{result.octStr}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Decimal (Base 10)</span>
                <p className="font-mono font-bold text-sky-400 text-sm mt-0.5 break-all">{result.decStr}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Hex (Base 16)</span>
                <p className="font-mono font-bold text-purple-400 text-sm mt-0.5 break-all">{result.hexStr}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `(${result.converted})_${result.toBase}` : null} />
    </CalculatorContainer>
  );
}
