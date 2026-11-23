import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { gcdMultiple, lcmMultiple, euclideanSteps, primeFactorsWithExponents, getDivisors } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Network } from 'lucide-react';

export default function HcfLcmCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [inputStr, setInputStr] = useState('48, 72, 108');
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const nums = inputStr.split(/[,;\s]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);

    if (nums.length < 2) {
      showToast('Please enter at least 2 positive integers', 'error');
      return;
    }

    const hcfVal = gcdMultiple(nums);
    const lcmVal = lcmMultiple(nums);

    // Prime factorizations
    const factorizations = nums.map(num => ({
      num,
      factors: primeFactorsWithExponents(num)
    }));

    // Common divisors
    const allDivisorsLists = nums.map(num => getDivisors(num));
    // Intersection of divisors
    const commonFactors = allDivisorsLists.reduce((acc, curr) => acc.filter(d => curr.includes(d)));

    // Common multiples first 5
    const commonMultiples = [1, 2, 3, 4, 5].map(m => lcmVal * m);

    // Euclidean steps for the first 2 numbers
    const euclid = euclideanSteps(nums[0], nums[1]);

    const calcSteps = [
      {
        title: 'Input Numbers List',
        math: nums.join(', ')
      },
      ...factorizations.map(f => ({
        title: `Prime Factorization of ${f.num}`,
        math: `${f.num} = ${f.factors.map(item => item.str).join(' × ') || f.num}`
      })),
      {
        title: 'HCF / GCD Calculation',
        desc: 'Product of the smallest power of each common prime factor',
        math: `HCF(${nums.join(', ')}) = ${hcfVal}`
      },
      {
        title: 'LCM Calculation',
        desc: 'Product of the greatest power of each prime factor involved',
        math: `LCM(${nums.join(', ')}) = ${lcmVal}`
      },
      {
        title: `Euclidean Algorithm Steps for (${nums[0]}, ${nums[1]})`,
        desc: 'Repeated division method a = b·q + r until remainder is 0',
        math: euclid.steps.map(s => s.text).join('\n')
      }
    ];

    setSteps(calcSteps);
    setResult({
      hcf: hcfVal,
      lcm: lcmVal,
      factorizations,
      commonFactors,
      commonMultiples,
      nums
    });

    addHistory({
      tool: 'hcf_lcm',
      toolName: 'HCF & LCM',
      expression: nums.join(', '),
      result: `HCF = ${hcfVal}, LCM = ${lcmVal}`
    });
  };

  return (
    <CalculatorContainer
      title="HCF & LCM Calculator"
      subtitle="Highest Common Factor (HCF/GCD), Lowest Common Multiple (LCM), prime factors & Euclidean division"
      toolId="hcf_lcm"
      onReset={() => {
        setInputStr('48, 72, 108');
        setResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        'Numbers': result.nums.join(', '),
        'HCF / GCD': result.hcf,
        'LCM': result.lcm,
        'Common Factors': result.commonFactors.join(', ')
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="HCF and LCM Relationships"
        formula="For two numbers: a × b = HCF(a, b) × LCM(a, b)  |  HCF ≤ min(a, b)  |  LCM ≥ max(a, b)"
        description="Prime factorization and Euclidean algorithm a = b·q + r form the basis of modular arithmetic."
      />

      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-5">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Enter Numbers (2 or more integers, separated by commas or spaces)
            </label>
            <input
              type="text"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value)}
              placeholder="48, 72, 108"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="btn-calc-brand px-6 py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
          >
            Compute HCF, LCM & Prime Factors
          </button>
        </form>

        {result && (
          <div className="space-y-4 pt-3 border-t border-white/10">
            {/* Main Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                <span className="text-xs uppercase font-bold text-sky-300">Highest Common Factor (HCF / GCD)</span>
                <div className="text-4xl font-black font-mono text-sky-400 mt-1">{result.hcf}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <span className="text-xs uppercase font-bold text-emerald-300">Lowest Common Multiple (LCM)</span>
                <div className="text-4xl font-black font-mono text-emerald-400 mt-1">{result.lcm}</div>
              </div>
            </div>

            {/* Prime Factorizations Grid */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Prime Factorizations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {result.factorizations.map(f => (
                  <div key={f.num} className="p-3 rounded-xl bg-white/5 border border-white/5 font-mono">
                    <span className="font-bold text-slate-200">{f.num}</span> = <span className="text-sky-300">{f.factors.map(item => item.str).join(' × ') || f.num}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Divisors & Multiples */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 font-semibold uppercase">Common Factors / Divisors:</span>
                <p className="font-mono font-bold text-slate-100">{result.commonFactors.join(', ')}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-slate-400 font-semibold uppercase">First 5 Common Multiples:</span>
                <p className="font-mono font-bold text-emerald-400">{result.commonMultiples.join(', ')}...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `HCF = ${result.hcf}, LCM = ${result.lcm}` : null} />
    </CalculatorContainer>
  );
}
