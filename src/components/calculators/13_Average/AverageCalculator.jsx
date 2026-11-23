import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { BarChart2, Plus, Trash2 } from 'lucide-react';

export default function AverageCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'list', 'weighted', 'missing', 'combined'
  const [mode, setMode] = useState('list');

  // 1. Multiple numbers list
  const [rawNumbers, setRawNumbers] = useState('85, 90, 78, 92, 88, 95, 72');
  const [listResult, setListResult] = useState(null);

  // 2. Weighted average items
  const [weightedItems, setWeightedItems] = useState([
    { id: 1, val: '80', weight: '30' },
    { id: 2, val: '90', weight: '40' },
    { id: 3, val: '70', weight: '30' }
  ]);
  const [weightedResult, setWeightedResult] = useState(null);

  // 3. Missing Number Calculator
  const [currScores, setCurrScores] = useState('80, 85, 90');
  const [targetAvg, setTargetAvg] = useState('88');
  const [totalCountNeeded, setTotalCountNeeded] = useState('4');
  const [missingResult, setMissingResult] = useState(null);

  // 4. Combined Average of two groups
  const [grp1Count, setGrp1Count] = useState('30');
  const [grp1Mean, setGrp1Mean] = useState('75');
  const [grp2Count, setGrp2Count] = useState('20');
  const [grp2Mean, setGrp2Mean] = useState('85');
  const [combResult, setCombResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Calculate Simple Dataset Average
  const handleListCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const nums = rawNumbers.split(/[,;\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (nums.length === 0) {
      showToast('Please enter at least one number', 'error');
      return;
    }

    const count = nums.length;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / count;
    const min = Math.min(...nums);
    const max = Math.max(...nums);

    // Median
    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    const calcSteps = [
      {
        title: 'Count & Summation',
        math: `Count (N) = ${count}, Sum (Σx) = ${sum}`
      },
      {
        title: 'Arithmetic Mean Formula',
        desc: 'Mean (μ) = (Σx) / N',
        math: `Mean = ${sum} / ${count} = ${formatPrecision(mean, precision)}`
      },
      {
        title: 'Spread Metrics',
        math: `Min = ${min}, Max = ${max}, Median = ${formatPrecision(median, precision)}`
      }
    ];

    setSteps(calcSteps);
    setListResult({
      count, sum: formatPrecision(sum, precision),
      mean: formatPrecision(mean, precision),
      median: formatPrecision(median, precision),
      min, max
    });

    addHistory({
      tool: 'average',
      toolName: 'Average Calculator',
      expression: `${count} numbers: [${rawNumbers.slice(0, 20)}...]`,
      result: `Mean = ${formatPrecision(mean, precision)}`
    });
  };

  // Calculate Weighted Average
  const handleWeightedCalc = () => {
    playClickSound(soundEnabled, 'action');

    let totalWeight = 0;
    let sumWeightTimesVal = 0;

    for (let item of weightedItems) {
      const v = parseFloat(item.val) || 0;
      const w = parseFloat(item.weight) || 0;
      totalWeight += w;
      sumWeightTimesVal += (v * w);
    }

    if (totalWeight <= 0) {
      showToast('Total weight must be greater than zero', 'error');
      return;
    }

    const wAvg = sumWeightTimesVal / totalWeight;

    const calcSteps = [
      {
        title: 'Weighted Summation',
        math: `Σ(w × x) = ${formatPrecision(sumWeightTimesVal, precision)}, Total Weights (Σw) = ${totalWeight}`
      },
      {
        title: 'Weighted Average Formula',
        desc: 'Weighted Mean = Σ(w·x) / Σw',
        math: `W_Avg = ${formatPrecision(sumWeightTimesVal, precision)} / ${totalWeight} = ${formatPrecision(wAvg, precision)}`
      }
    ];

    setSteps(calcSteps);
    setWeightedResult({
      totalWeight,
      sumWX: formatPrecision(sumWeightTimesVal, precision),
      wAvg: formatPrecision(wAvg, precision)
    });
  };

  // Missing Score / Number Calculation
  const handleMissingCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const nums = currScores.split(/[,;\s]+/).map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const target = parseFloat(targetAvg);
    const nTotal = parseInt(totalCountNeeded, 10);

    if (isNaN(target) || isNaN(nTotal) || nTotal <= nums.length) {
      showToast(`Total items (${nTotal}) must be strictly greater than current items (${nums.length})`, 'error');
      return;
    }

    const currentSum = nums.reduce((acc, curr) => acc + curr, 0);
    const requiredTotalSum = target * nTotal;
    const missingValue = requiredTotalSum - currentSum;

    const calcSteps = [
      {
        title: 'Total Sum Required',
        desc: 'Required Total Sum = Target Average × Total Count',
        math: `Required Sum = ${target} × ${nTotal} = ${requiredTotalSum}`
      },
      {
        title: 'Current Sum of Existing Scores',
        math: `Current Sum = ${nums.join(' + ')} = ${currentSum}`
      },
      {
        title: 'Calculate Required Missing Number',
        desc: 'Missing Number = Required Sum - Current Sum',
        math: `Missing Score Needed = ${requiredTotalSum} - ${currentSum} = ${formatPrecision(missingValue, precision)}`
      }
    ];

    setSteps(calcSteps);
    setMissingResult(formatPrecision(missingValue, precision));
  };

  // Combined Average of Two Groups
  const handleCombinedCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const n1 = parseFloat(grp1Count);
    const m1 = parseFloat(grp1Mean);
    const n2 = parseFloat(grp2Count);
    const m2 = parseFloat(grp2Mean);

    if (isNaN(n1) || isNaN(m1) || isNaN(n2) || isNaN(m2) || n1 <= 0 || n2 <= 0) {
      showToast('Enter valid counts and averages for both groups', 'error');
      return;
    }

    const totalN = n1 + n2;
    const combMean = (n1 * m1 + n2 * m2) / totalN;

    const calcSteps = [
      {
        title: 'Combined Average Formula',
        desc: 'Mean_comb = (n₁·x̄₁ + n₂·x̄₂) / (n₁ + n₂)',
        math: `(${n1} × ${m1} + ${n2} × ${m2}) / (${n1} + ${n2}) = (${n1 * m1} + ${n2 * m2}) / ${totalN}`
      },
      {
        title: 'Resulting Overall Average',
        math: `= ${formatPrecision(combMean, precision)}`
      }
    ];

    setSteps(calcSteps);
    setCombResult(formatPrecision(combMean, precision));
  };

  return (
    <CalculatorContainer
      title="Average Calculator"
      subtitle="Arithmetic mean, dataset stats, weighted averages, missing target scores & combined groups"
      toolId="average"
      onReset={() => {
        setListResult(null);
        setWeightedResult(null);
        setMissingResult(null);
        setCombResult(null);
        setSteps([]);
      }}
      summaryData={listResult ? {
        'Count of Values': listResult.count,
        'Arithmetic Mean': listResult.mean,
        'Median': listResult.median,
        'Range (Min / Max)': `${listResult.min} to ${listResult.max}`,
        'Summation': listResult.sum
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Average Formulations"
        formula="Simple: μ = (Σx) / N  |  Weighted: x̄_w = (Σw·x) / Σw  |  Combined: x̄_c = (n₁x̄₁ + n₂x̄₂) / (n₁ + n₂)"
        description="Central tendency metrics balancing arithmetic weights and group cardinalities."
      />

      {/* Mode Buttons */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'list', label: 'Simple List Average' },
          { id: 'weighted', label: 'Weighted Average' },
          { id: 'missing', label: 'Missing Number Solver' },
          { id: 'combined', label: 'Combined Group Average' }
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

      {/* 1. List Mode */}
      {mode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleListCalc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enter Numbers (comma, space, or newline separated)
                </label>
                <textarea
                  rows="4"
                  value={rawNumbers}
                  onChange={(e) => setRawNumbers(e.target.value)}
                  placeholder="85, 90, 78, 92..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Compute Average & Median
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Summary Metrics</h3>
              {listResult ? (
                <div className="space-y-3 mt-4">
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                    <span className="text-xs uppercase tracking-wider text-sky-300 font-semibold">Arithmetic Mean (Average)</span>
                    <div className="text-4xl font-black font-mono text-sky-400 mt-1">{listResult.mean}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Total Count (N)</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{listResult.count}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Sum (Σx)</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{listResult.sum}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Median</span>
                      <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{listResult.median}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Min / Max</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{listResult.min} - {listResult.max}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter values to calculate summary metrics.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Weighted Mode */}
      {mode === 'weighted' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase text-slate-300">Values & Corresponding Weights</span>
            <button
              onClick={() => setWeightedItems([...weightedItems, { id: Date.now(), val: '80', weight: '20' }])}
              className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300"
            >
              <Plus className="w-3.5 h-3.5" /> Add Row
            </button>
          </div>

          <div className="space-y-2">
            {weightedItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono w-6">#{idx + 1}</span>
                <input
                  type="number"
                  placeholder="Value (x)"
                  value={item.val}
                  onChange={(e) => {
                    const updated = [...weightedItems];
                    updated[idx].val = e.target.value;
                    setWeightedItems(updated);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-100"
                />
                <input
                  type="number"
                  placeholder="Weight (w)"
                  value={item.weight}
                  onChange={(e) => {
                    const updated = [...weightedItems];
                    updated[idx].weight = e.target.value;
                    setWeightedItems(updated);
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-100"
                />
                {weightedItems.length > 1 && (
                  <button
                    onClick={() => setWeightedItems(weightedItems.filter(i => i.id !== item.id))}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleWeightedCalc}
            className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
          >
            Compute Weighted Average
          </button>

          {weightedResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Weighted Average:</span>
                <div className="text-3xl font-black font-mono text-sky-400 mt-0.5">{weightedResult.wAvg}</div>
              </div>
              <span className="text-xs font-mono text-slate-400">Total Weight = {weightedResult.totalWeight}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Missing Score */}
      {mode === 'missing' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleMissingCalc} className="space-y-4">
            <p className="text-xs text-slate-400">
              Calculate what score you need on your next exam/assignment to reach a target average!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Existing Scores</label>
                <input
                  type="text"
                  value={currScores}
                  onChange={(e) => setCurrScores(e.target.value)}
                  placeholder="80, 85, 90"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Desired Average</label>
                <input
                  type="number"
                  value={targetAvg}
                  onChange={(e) => setTargetAvg(e.target.value)}
                  placeholder="88"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Scores (incl. next)</label>
                <input
                  type="number"
                  value={totalCountNeeded}
                  onChange={(e) => setTotalCountNeeded(e.target.value)}
                  placeholder="4"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Solve Required Next Score
            </button>
          </form>

          {missingResult !== null && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs text-slate-400">Score Needed on Next Exam:</span>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-0.5">{missingResult}</div>
            </div>
          )}
        </div>
      )}

      {/* 4. Combined Average */}
      {mode === 'combined' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleCombinedCalc} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase text-sky-300">Group 1</span>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Count (n₁)" value={grp1Count} onChange={(e) => setGrp1Count(e.target.value)} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100" />
                  <input type="number" placeholder="Average (x̄₁)" value={grp1Mean} onChange={(e) => setGrp1Mean(e.target.value)} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase text-purple-300">Group 2</span>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Count (n₂)" value={grp2Count} onChange={(e) => setGrp2Count(e.target.value)} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100" />
                  <input type="number" placeholder="Average (x̄₂)" value={grp2Mean} onChange={(e) => setGrp2Mean(e.target.value)} className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-slate-100" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Combined Average
            </button>
          </form>

          {combResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span className="text-xs text-slate-400">Combined Weighted Average of Both Groups:</span>
              <div className="text-3xl font-black font-mono text-sky-400 mt-0.5">{combResult}</div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} />
    </CalculatorContainer>
  );
}
