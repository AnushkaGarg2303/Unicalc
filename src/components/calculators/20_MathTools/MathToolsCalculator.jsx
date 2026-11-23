import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { isPrime, primeFactorsWithExponents, bigFactorial, formatPrecision, permutation, combination } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Sigma, Check, X } from 'lucide-react';

export default function MathToolsCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Sub-tool: 'number_checker', 'factorial', 'ap_gp', 'probability', 'statistics'
  const [subTool, setSubTool] = useState('number_checker');

  // 1. Number properties state
  const [numCheckInput, setNumCheckInput] = useState('49');
  const [numCheckResult, setNumCheckResult] = useState(null);

  // 2. Factorial state
  const [factInput, setFactInput] = useState('25');
  const [factResult, setFactResult] = useState(null);

  // 3. AP & GP state
  const [seqType, setSeqType] = useState('ap'); // 'ap' or 'gp'
  const [firstTermA, setFirstTermA] = useState('2');
  const [diffOrRatio, setDiffOrRatio] = useState('3'); // d for AP, r for GP
  const [numTermsN, setNumTermsN] = useState('10');
  const [seqResult, setSeqResult] = useState(null);

  // 4. Probability
  const [probFavorable, setProbFavorable] = useState('3');
  const [probTotal, setProbTotal] = useState('6');
  const [probResult, setProbResult] = useState(null);

  // 5. Statistics
  const [statsInput, setStatsInput] = useState('12, 15, 18, 20, 22, 25, 28, 30');
  const [statsResult, setStatsResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Number Properties Checker (Prime, Composite, Even/Odd, Perfect Square, Perfect Cube, Divisibility)
  const handleNumCheck = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const n = parseInt(numCheckInput, 10);
    if (isNaN(n)) {
      showToast('Enter a valid integer', 'error');
      return;
    }

    const isEven = n % 2 === 0;
    const primeStatus = isPrime(n);
    const isComposite = n > 1 && !primeStatus;

    // Perfect Square
    const sqrtVal = Math.sqrt(Math.abs(n));
    const isSquare = n >= 0 && Number.isInteger(sqrtVal);

    // Perfect Cube
    const cbrtVal = Math.cbrt(n);
    const isCube = Number.isInteger(Math.round(cbrtVal)) && Math.pow(Math.round(cbrtVal), 3) === n;

    // Divisibility rules for 2 to 13
    const divRules = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(div => ({
      divisor: div,
      isDivisible: n % div === 0,
      remainder: n % div
    }));

    // Prime factors
    const pFactors = primeFactorsWithExponents(n);

    const calcSteps = [
      {
        title: 'Parity Check (Even / Odd)',
        math: `${n} % 2 = ${n % 2}  ⇒  ${isEven ? 'EVEN Number' : 'ODD Number'}`
      },
      {
        title: 'Primality Classification',
        math: primeStatus
          ? `${n} is a PRIME NUMBER (only divisible by 1 and itself)`
          : isComposite
          ? `${n} is a COMPOSITE NUMBER (Prime factorization: ${pFactors.map(f => f.str).join(' × ')})`
          : `${n} is neither prime nor composite`
      },
      {
        title: 'Square & Cube Properties',
        math: `Square Root: √${n} = ${formatPrecision(sqrtVal, precision)} (${isSquare ? 'PERFECT SQUARE' : 'Not a square'})\nCube Root: ∛${n} = ${formatPrecision(cbrtVal, precision)} (${isCube ? 'PERFECT CUBE' : 'Not a cube'})`
      }
    ];

    setSteps(calcSteps);
    setNumCheckResult({
      n, isEven, primeStatus, isComposite, isSquare, isCube,
      sqrtVal: formatPrecision(sqrtVal, precision),
      cbrtVal: formatPrecision(cbrtVal, precision),
      pFactors, divRules
    });
  };

  // Factorial Calculator
  const handleFactCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const n = parseInt(factInput, 10);
    if (isNaN(n) || n < 0) {
      showToast('Factorial requires a non-negative integer', 'error');
      return;
    }
    if (n > 250) {
      showToast('Maximum allowed value is 250 to prevent overflow', 'error');
      return;
    }

    const exactVal = bigFactorial(n);

    setSteps([
      {
        title: 'Factorial Definition',
        desc: `n! = n × (n - 1) × ... × 2 × 1`,
        math: `${n}! = ${n} × ${n - 1} × ... × 1`
      },
      {
        title: 'Exact Output',
        math: `= ${exactVal}`
      }
    ]);

    setFactResult({ n, exactVal });
  };

  // AP / GP Calculation
  const handleSeqCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(firstTermA);
    const step = parseFloat(diffOrRatio);
    const n = parseInt(numTermsN, 10);

    if (isNaN(a) || isNaN(step) || isNaN(n) || n <= 0) {
      showToast('Enter valid parameters (n must be positive integer)', 'error');
      return;
    }

    let nthTerm = 0;
    let sumN = 0;
    let termsList = [];
    let mathSteps = [];

    if (seqType === 'ap') {
      // AP: a_n = a + (n - 1)d, S_n = (n/2)[2a + (n-1)d]
      nthTerm = a + (n - 1) * step;
      sumN = (n / 2) * (2 * a + (n - 1) * step);
      termsList = Array.from({ length: Math.min(n, 8) }, (_, i) => a + i * step);

      mathSteps = [
        {
          title: 'nth Term of AP',
          desc: 'aₙ = a + (n - 1)d',
          math: `a_${n} = ${a} + (${n} - 1) × ${step} = ${a} + ${(n - 1) * step} = ${formatPrecision(nthTerm, precision)}`
        },
        {
          title: 'Sum of First n Terms (Sₙ)',
          desc: 'Sₙ = (n / 2) × [2a + (n - 1)d]',
          math: `S_${n} = (${n} / 2) × [2(${a}) + (${n - 1})(${step})] = ${formatPrecision(sumN, precision)}`
        }
      ];
    } else {
      // GP: a_n = a * r^(n-1), S_n = a(r^n - 1)/(r - 1)
      nthTerm = a * Math.pow(step, n - 1);
      sumN = step === 1 ? a * n : (a * (Math.pow(step, n) - 1)) / (step - 1);
      termsList = Array.from({ length: Math.min(n, 8) }, (_, i) => a * Math.pow(step, i));

      mathSteps = [
        {
          title: 'nth Term of GP',
          desc: 'aₙ = a × rⁿ⁻¹',
          math: `a_${n} = ${a} × (${step})^(${n} - 1) = ${formatPrecision(nthTerm, precision)}`
        },
        {
          title: 'Sum of First n Terms (Sₙ)',
          desc: 'Sₙ = a(rⁿ - 1) / (r - 1)',
          math: `S_${n} = ${formatPrecision(sumN, precision)}`
        }
      ];
    }

    setSteps(mathSteps);
    setSeqResult({
      nthTerm: formatPrecision(nthTerm, precision),
      sumN: formatPrecision(sumN, precision),
      termsList: termsList.map(t => formatPrecision(t, precision)),
      n, seqType
    });
  };

  // Probability
  const handleProbCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const fav = parseFloat(probFavorable);
    const tot = parseFloat(probTotal);

    if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) {
      showToast('Favorable events must be between 0 and total sample size', 'error');
      return;
    }

    const p = fav / tot;
    const pNot = 1 - p;
    const oddsFor = `${fav} : ${tot - fav}`;
    const oddsAgainst = `${tot - fav} : ${fav}`;

    setSteps([
      {
        title: 'Classical Probability P(E)',
        desc: 'P(E) = n(E) / n(S)',
        math: `P(E) = ${fav} / ${tot} = ${formatPrecision(p, 4)} (${formatPrecision(p * 100, 2)}%)`
      },
      {
        title: 'Complementary Event P(not E)',
        desc: 'P(E\') = 1 - P(E)',
        math: `P(not E) = 1 - ${formatPrecision(p, 4)} = ${formatPrecision(pNot, 4)} (${formatPrecision(pNot * 100, 2)}%)`
      },
      {
        title: 'Odds Ratio',
        math: `Odds in Favor = ${oddsFor}  |  Odds Against = ${oddsAgainst}`
      }
    ]);

    setProbResult({
      p: formatPrecision(p, 4),
      pPct: formatPrecision(p * 100, 2),
      pNot: formatPrecision(pNot, 4),
      oddsFor, oddsAgainst
    });
  };

  // Statistics
  const handleStatsCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const nums = statsInput.split(/[,;\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) {
      showToast('Enter at least 2 numbers for statistical analysis', 'error');
      return;
    }

    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Variance & Standard Deviation
    const sqDiffSum = nums.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0);
    const popVariance = sqDiffSum / n;
    const sampleVariance = sqDiffSum / (n - 1);
    const popStdDev = Math.sqrt(popVariance);
    const sampleStdDev = Math.sqrt(sampleVariance);

    // Median & Quartiles
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Mode
    const freq = {};
    let maxFreq = 0;
    nums.forEach(val => {
      freq[val] = (freq[val] || 0) + 1;
      if (freq[val] > maxFreq) maxFreq = freq[val];
    });
    const modes = Object.keys(freq).filter(k => freq[k] === maxFreq && maxFreq > 1);
    const modeStr = modes.length > 0 ? modes.join(', ') : 'No unique mode';

    const calcSteps = [
      {
        title: 'Sample Cardinality & Mean',
        math: `N = ${n}, Sum = ${sum}, Mean (μ) = ${formatPrecision(mean, precision)}`
      },
      {
        title: 'Dispersion Metrics (Variance & Std Dev)',
        math: `Population Variance (σ²) = ${formatPrecision(popVariance, precision)}\nPopulation Std Dev (σ) = ${formatPrecision(popStdDev, precision)}\nSample Std Dev (s) = ${formatPrecision(sampleStdDev, precision)}`
      },
      {
        title: 'Order Statistics',
        math: `Min = ${min}, Max = ${max}, Range = ${range}, Median = ${median}, Mode = ${modeStr}`
      }
    ];

    setSteps(calcSteps);
    setStatsResult({
      mean: formatPrecision(mean, precision),
      median: formatPrecision(median, precision),
      modeStr,
      popVariance: formatPrecision(popVariance, precision),
      popStdDev: formatPrecision(popStdDev, precision),
      sampleStdDev: formatPrecision(sampleStdDev, precision),
      range, min, max
    });
  };

  return (
    <CalculatorContainer
      title="Advanced Mathematics & Statistics Tools"
      subtitle="Prime factorization, AP/GP sequences, exact factorials, probability & statistical variance"
      toolId="math_tools"
      onReset={() => {
        setNumCheckResult(null);
        setFactResult(null);
        setSeqResult(null);
        setProbResult(null);
        setStatsResult(null);
        setSteps([]);
      }}
      summaryData={numCheckResult ? {
        'Number': numCheckResult.n,
        'Parity': numCheckResult.isEven ? 'Even' : 'Odd',
        'Primality': numCheckResult.primeStatus ? 'Prime' : numCheckResult.isComposite ? 'Composite' : 'Unit',
        'Perfect Square': numCheckResult.isSquare ? 'Yes' : 'No'
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Discrete Mathematics & Probability Laws"
        formula="AP: aₙ = a + (n-1)d  |  GP: aₙ = a·rⁿ⁻¹  |  P(E) = n(E)/n(S)  |  σ² = Σ(x - μ)²/N"
        description="Comprehensive toolkit for sequence progression, statistical variance, and discrete algebra."
      />

      {/* Sub-tool tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'number_checker', label: 'Number Properties & Divisibility' },
          { id: 'factorial', label: 'BigInt Factorial (n!)' },
          { id: 'ap_gp', label: 'AP & GP Progressions' },
          { id: 'probability', label: 'Probability & Odds' },
          { id: 'statistics', label: 'Statistics (Mean/Var/StdDev)' }
        ].map(st => (
          <button
            key={st.id}
            onClick={() => setSubTool(st.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              subTool === st.id ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* 1. Number Checker */}
      {subTool === 'number_checker' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleNumCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Positive Integer</label>
              <input
                type="number"
                value={numCheckInput}
                onChange={(e) => setNumCheckInput(e.target.value)}
                placeholder="49"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Analyze Number Properties
            </button>
          </form>

          {numCheckResult && (
            <div className="space-y-4 pt-3 border-t border-white/10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Parity</span>
                  <p className="font-bold text-slate-100 text-sm mt-0.5">{numCheckResult.isEven ? 'EVEN' : 'ODD'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Primality</span>
                  <p className="font-bold text-sky-400 text-sm mt-0.5">
                    {numCheckResult.primeStatus ? 'PRIME' : numCheckResult.isComposite ? 'COMPOSITE' : 'UNIT (1)'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Square?</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5">{numCheckResult.isSquare ? `YES (√${numCheckResult.sqrtVal})` : 'NO'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Cube?</span>
                  <p className="font-bold text-purple-400 text-sm mt-0.5">{numCheckResult.isCube ? `YES (∛${numCheckResult.cbrtVal})` : 'NO'}</p>
                </div>
              </div>

              {/* Divisibility 2 to 13 table */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">Divisibility Checker (2 to 13)</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs font-mono">
                  {numCheckResult.divRules.map(d => (
                    <div
                      key={d.divisor}
                      className={`p-2 rounded-xl border flex items-center justify-between ${
                        d.isDivisible ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'
                      }`}
                    >
                      <span>÷ {d.divisor}</span>
                      {d.isDivisible ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Factorial */}
      {subTool === 'factorial' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-lg mx-auto">
          <form onSubmit={handleFactCalc} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Non-Negative Integer (n)</label>
              <input
                type="number"
                min="0"
                max="250"
                value={factInput}
                onChange={(e) => setFactInput(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Exact BigInt Factorial
            </button>
          </form>

          {factResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span className="text-xs text-slate-400">{factResult.n}! =</span>
              <div className="text-base sm:text-lg font-bold font-mono text-sky-300 mt-1 break-all select-all">
                {factResult.exactVal}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. AP / GP */}
      {subTool === 'ap_gp' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-white/10 text-xs">
            <button
              onClick={() => setSeqType('ap')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                seqType === 'ap' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Arithmetic Progression (AP)
            </button>
            <button
              onClick={() => setSeqType('gp')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-all ${
                seqType === 'gp' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Geometric Progression (GP)
            </button>
          </div>

          <form onSubmit={handleSeqCalc} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Term (a)</label>
                <input type="number" step="any" value={firstTermA} onChange={(e) => setFirstTermA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{seqType === 'ap' ? 'Common Difference (d)' : 'Common Ratio (r)'}</label>
                <input type="number" step="any" value={diffOrRatio} onChange={(e) => setDiffOrRatio(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Terms (n)</label>
                <input type="number" min="1" value={numTermsN} onChange={(e) => setNumTermsN(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute {seqType.toUpperCase()}
            </button>
          </form>

          {seqResult && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">nth Term (a_{seqResult.n}):</span>
                <p className="text-2xl font-bold text-sky-400 mt-1">{seqResult.nthTerm}</p>
              </div>
              <div>
                <span className="text-slate-400">Sum of First {seqResult.n} Terms (S_{seqResult.n}):</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{seqResult.sumN}</p>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-white/10">
                <span className="text-slate-400">Initial terms:</span>
                <p className="text-slate-200 mt-0.5">{seqResult.termsList.join(', ')} ...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Probability */}
      {subTool === 'probability' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-lg mx-auto">
          <form onSubmit={handleProbCalc} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Favorable Outcomes n(E)</label>
                <input type="number" step="any" value={probFavorable} onChange={(e) => setProbFavorable(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Sample Space n(S)</label>
                <input type="number" step="any" value={probTotal} onChange={(e) => setProbTotal(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-sm text-slate-100" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Probability & Odds
            </button>
          </form>

          {probResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Probability P(E):</span>
                <span className="text-2xl font-bold text-sky-400">{probResult.p} ({probResult.pPct}%)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="text-slate-400">Complementary P(not E):</span>
                <span className="font-bold text-slate-200">{probResult.pNot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Odds in Favor:</span>
                <span className="font-bold text-emerald-400">{probResult.oddsFor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Odds Against:</span>
                <span className="font-bold text-rose-400">{probResult.oddsAgainst}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Statistics */}
      {subTool === 'statistics' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleStatsCalc} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter Data Points (comma separated)
              </label>
              <textarea
                rows="3"
                value={statsInput}
                onChange={(e) => setStatsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Calculate Statistical Parameters
            </button>
          </form>

          {statsResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Mean (μ)</span>
                <p className="font-bold text-sky-400 text-sm mt-0.5">{statsResult.mean}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Median</span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">{statsResult.median}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Mode</span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">{statsResult.modeStr}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Population Std Dev (σ)</span>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">{statsResult.popStdDev}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Sample Std Dev (s)</span>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">{statsResult.sampleStdDev}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-400">Population Variance</span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">{statsResult.popVariance}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 sm:col-span-2">
                <span className="text-slate-400">Range [Min – Max]</span>
                <p className="font-bold text-slate-100 text-sm mt-0.5">{statsResult.min} – {statsResult.max} (Span: {statsResult.range})</p>
              </div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} />
    </CalculatorContainer>
  );
}
