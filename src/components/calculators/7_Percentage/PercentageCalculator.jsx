import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Percent, GraduationCap, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function PercentageCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'basic', 'change', 'reverse', 'marks', 'exam'
  const [mode, setMode] = useState('basic');

  // Basic: X% of Y
  const [valX, setValX] = useState('15');
  const [valY, setValY] = useState('800');
  const [basicResult, setBasicResult] = useState(null);

  // Change: from A to B
  const [fromVal, setFromVal] = useState('50');
  const [toVal, setToVal] = useState('75');
  const [changeResult, setChangeResult] = useState(null);

  // Reverse: If Number is P%, what is 100%?
  const [partVal, setPartVal] = useState('60');
  const [partPct, setPartPct] = useState('20');
  const [reverseResult, setReverseResult] = useState(null);

  // Marks Percentage
  const [obtainedMarks, setObtainedMarks] = useState('420');
  const [maxMarks, setMaxMarks] = useState('500');
  const [marksResult, setMarksResult] = useState(null);

  // Subject-wise Exam Result
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Mathematics', obtained: '92', max: '100' },
    { id: 2, name: 'Physics', obtained: '85', max: '100' },
    { id: 3, name: 'Chemistry', obtained: '78', max: '100' },
    { id: 4, name: 'English', obtained: '88', max: '100' }
  ]);
  const [examResult, setExamResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Calculate Basic X% of Y
  const handleBasicCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');
    const x = parseFloat(valX);
    const y = parseFloat(valY);

    if (isNaN(x) || isNaN(y)) {
      showToast('Please enter valid numbers', 'error');
      return;
    }

    const res = (x / 100) * y;
    const whatPercent = y !== 0 ? (x / y) * 100 : 0;

    const calcSteps = [
      {
        title: 'Compute X% of Y',
        desc: 'Formula: Result = (X / 100) × Y',
        math: `${x}% of ${y} = (${x} / 100) × ${y} = ${formatPrecision(res, precision)}`
      },
      {
        title: 'Complementary Query: What percent is X of Y?',
        desc: 'Formula: (X / Y) × 100',
        math: `(${x} / ${y}) × 100 = ${formatPrecision(whatPercent, precision)}%`
      }
    ];

    setSteps(calcSteps);
    setBasicResult({
      res: formatPrecision(res, precision),
      whatPercent: formatPrecision(whatPercent, precision),
      x, y
    });

    addHistory({
      tool: 'percentage',
      toolName: 'Percentage Calculator',
      expression: `${x}% of ${y}`,
      result: `${formatPrecision(res, precision)}`
    });
  };

  // Calculate Percentage Change / Difference
  const handleChangeCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');
    const a = parseFloat(fromVal);
    const b = parseFloat(toVal);

    if (isNaN(a) || isNaN(b) || a === 0) {
      showToast('Initial baseline (From) must not be zero or empty', 'error');
      return;
    }

    const diff = b - a;
    const isIncrease = diff >= 0;
    const pctChange = (diff / Math.abs(a)) * 100;
    const avg = (Math.abs(a) + Math.abs(b)) / 2;
    const pctDifference = (Math.abs(diff) / avg) * 100;

    const calcSteps = [
      {
        title: 'Percentage Change Formula',
        desc: '% Change = ((Final - Initial) / |Initial|) × 100',
        math: `(( ${b} - ${a} ) / |${a}|) × 100 = (${diff} / ${Math.abs(a)}) × 100 = ${formatPrecision(pctChange, precision)}%`
      },
      {
        title: 'Percentage Difference Formula',
        desc: '% Difference = (|A - B| / ((A + B) / 2)) × 100',
        math: `(|${a} - ${b}| / ((${a} + ${b}) / 2)) × 100 = ${formatPrecision(pctDifference, precision)}%`
      }
    ];

    setSteps(calcSteps);
    setChangeResult({
      isIncrease,
      pctChange: formatPrecision(Math.abs(pctChange), precision),
      rawChange: formatPrecision(pctChange, precision),
      pctDifference: formatPrecision(pctDifference, precision),
      absoluteDiff: formatPrecision(Math.abs(diff), precision)
    });

    addHistory({
      tool: 'percentage',
      toolName: 'Percentage Change',
      expression: `From ${a} to ${b}`,
      result: `${isIncrease ? '+' : '-'}${formatPrecision(Math.abs(pctChange), precision)}%`
    });
  };

  // Reverse Percentage
  const handleReverseCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');
    const pVal = parseFloat(partVal);
    const pPct = parseFloat(partPct);

    if (isNaN(pVal) || isNaN(pPct) || pPct === 0) {
      showToast('Percentage must be non-zero', 'error');
      return;
    }

    const total100 = (pVal / pPct) * 100;

    const calcSteps = [
      {
        title: 'Reverse Percentage Formulation',
        desc: `If ${pPct}% = ${pVal}, then 1% = ${pVal} / ${pPct}`,
        math: `1% = ${pVal} / ${pPct} = ${formatPrecision(pVal / pPct, precision)}`
      },
      {
        title: 'Calculate 100% Total',
        math: `Total (100%) = (${pVal} / ${pPct}) × 100 = ${formatPrecision(total100, precision)}`
      }
    ];

    setSteps(calcSteps);
    setReverseResult({
      total: formatPrecision(total100, precision),
      pVal, pPct
    });

    addHistory({
      tool: 'percentage',
      toolName: 'Reverse Percentage',
      expression: `${pVal} is ${pPct}%`,
      result: `100% Total = ${formatPrecision(total100, precision)}`
    });
  };

  // Marks Percentage
  const handleMarksCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');
    const obt = parseFloat(obtainedMarks);
    const max = parseFloat(maxMarks);

    if (isNaN(obt) || isNaN(max) || max <= 0) {
      showToast('Max Marks must be greater than zero', 'error');
      return;
    }

    const pct = (obt / max) * 100;
    let grade = 'F';
    let division = 'Fail';

    if (pct >= 90) { grade = 'A+'; division = 'First with Distinction'; }
    else if (pct >= 80) { grade = 'A'; division = 'First Division'; }
    else if (pct >= 70) { grade = 'B+'; division = 'First Division'; }
    else if (pct >= 60) { grade = 'B'; division = 'First Division'; }
    else if (pct >= 50) { grade = 'C'; division = 'Second Division'; }
    else if (pct >= 40) { grade = 'D'; division = 'Third Division'; }

    const calcSteps = [
      {
        title: 'Marks Percentage Formula',
        desc: 'Percentage = (Obtained Marks / Total Maximum Marks) × 100',
        math: `(${obt} / ${max}) × 100 = ${formatPrecision(pct, precision)}%`
      },
      {
        title: 'Grade & Performance Evaluation',
        math: `Grade: ${grade} (${division})`
      }
    ];

    setSteps(calcSteps);
    setMarksResult({
      pct: formatPrecision(pct, precision),
      grade,
      division,
      obt, max
    });

    addHistory({
      tool: 'percentage',
      toolName: 'Marks Percentage',
      expression: `${obt} / ${max}`,
      result: `${formatPrecision(pct, precision)}% (${grade})`
    });
  };

  // Subject-wise Exam Result
  const handleExamCalc = () => {
    playClickSound(soundEnabled, 'action');
    let totalObt = 0;
    let totalMax = 0;

    for (let sub of subjects) {
      const o = parseFloat(sub.obtained) || 0;
      const m = parseFloat(sub.max) || 0;
      totalObt += o;
      totalMax += m;
    }

    if (totalMax <= 0) {
      showToast('Total maximum marks must be greater than zero', 'error');
      return;
    }

    const pct = (totalObt / totalMax) * 100;
    const avgPerSubject = totalObt / subjects.length;

    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 40) grade = 'D';

    const calcSteps = [
      {
        title: 'Cumulative Examination Score',
        math: `Total Marks: ${totalObt} / ${totalMax} across ${subjects.length} subjects`
      },
      {
        title: 'Aggregate Percentage',
        math: `(${totalObt} / ${totalMax}) × 100 = ${formatPrecision(pct, precision)}%`
      },
      {
        title: 'Average Marks per Subject',
        math: `Average = ${formatPrecision(avgPerSubject, precision)} / 100 (Grade: ${grade})`
      }
    ];

    setSteps(calcSteps);
    setExamResult({
      totalObt, totalMax,
      pct: formatPrecision(pct, precision),
      avg: formatPrecision(avgPerSubject, precision),
      grade
    });
  };

  return (
    <CalculatorContainer
      title="Percentage Calculator"
      subtitle="X% of Y, percentage increase/decrease, difference, reverse percentage & exam grades"
      toolId="percentage"
      onReset={() => {
        setBasicResult(null);
        setChangeResult(null);
        setReverseResult(null);
        setMarksResult(null);
        setExamResult(null);
        setSteps([]);
      }}
      summaryData={basicResult ? {
        'Percentage Query': `${basicResult.x}% of ${basicResult.y}`,
        'Calculated Value': basicResult.res,
        'Relative Ratio': `${basicResult.whatPercent}%`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Percentage Formulas"
        formula="P% of X = (P/100) × X  |  % Change = ((B - A)/A) × 100  |  Marks % = (Obtained / Max) × 100"
        description="Standardized proportion metrics scaled per 100 units."
      />

      {/* Mode Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'basic', label: 'X% of Y' },
          { id: 'change', label: '% Increase / Decrease' },
          { id: 'reverse', label: 'Reverse Percentage' },
          { id: 'marks', label: 'Marks Percentage' },
          { id: 'exam', label: 'Exam Result Sheet' }
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

      {/* Mode 1: Basic X% of Y */}
      {mode === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleBasicCalc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Percentage (X)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={valX}
                      onChange={(e) => setValX(e.target.value)}
                      placeholder="15"
                      className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-sm">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Of Number (Y)</label>
                  <input
                    type="number"
                    step="any"
                    value={valY}
                    onChange={(e) => setValY(e.target.value)}
                    placeholder="800"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Compute Percentage
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Result</h3>
              {basicResult ? (
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      {basicResult.x}% of {basicResult.y} is:
                    </span>
                    <div className="text-4xl font-black font-mono text-sky-400 mt-1">
                      {basicResult.res}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                    <span className="text-slate-400">Reciprocal Relation:</span>
                    <p className="font-mono mt-0.5">
                      {basicResult.x} is <span className="font-bold text-sky-300">{basicResult.whatPercent}%</span> of {basicResult.y}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter X and Y to calculate.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Percentage Increase / Decrease */}
      {mode === 'change' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleChangeCalc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">From Initial Value (A)</label>
                  <input
                    type="number"
                    step="any"
                    value={fromVal}
                    onChange={(e) => setFromVal(e.target.value)}
                    placeholder="50"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">To Final Value (B)</label>
                  <input
                    type="number"
                    step="any"
                    value={toVal}
                    onChange={(e) => setToVal(e.target.value)}
                    placeholder="75"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Calculate % Change & Difference
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Change Dynamics</h3>
              {changeResult ? (
                <div className="space-y-4 mt-4">
                  <div className={`p-4 rounded-2xl border text-center ${
                    changeResult.isIncrease ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                  }`}>
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      {changeResult.isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
                    </span>
                    <div className={`text-4xl font-black font-mono mt-1 ${
                      changeResult.isIncrease ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {changeResult.isIncrease ? '+' : '-'}{changeResult.pctChange}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Absolute Diff</span>
                      <p className="font-mono font-bold text-slate-100 mt-0.5">{changeResult.absoluteDiff}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">% Difference</span>
                      <p className="font-mono font-bold text-sky-400 mt-0.5">{changeResult.pctDifference}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter before and after values to compare.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Reverse Percentage */}
      {mode === 'reverse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <p className="text-xs text-slate-400">
              e.g. "If $60 is 20% of an amount, what is the full 100% total?"
            </p>
            <form onSubmit={handleReverseCalc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">If Value is</label>
                  <input
                    type="number"
                    step="any"
                    value={partVal}
                    onChange={(e) => setPartVal(e.target.value)}
                    placeholder="60"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Which represents (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      value={partPct}
                      onChange={(e) => setPartPct(e.target.value)}
                      placeholder="20"
                      className="w-full pl-4 pr-8 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-sm">%</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Compute Original 100% Amount
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Total 100% Value</h3>
              {reverseResult ? (
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Full Baseline (100%)
                    </span>
                    <div className="text-4xl font-black font-mono text-sky-400 mt-1">
                      {reverseResult.total}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter partial value and percentage.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 4: Marks Percentage */}
      {mode === 'marks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleMarksCalc} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    step="any"
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(e.target.value)}
                    placeholder="420"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Maximum Marks</label>
                  <input
                    type="number"
                    step="any"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Compute Percentage & Grade
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Academic Grade</h3>
              {marksResult ? (
                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Score Percentage</span>
                    <div className="text-4xl font-black font-mono text-sky-400 mt-1">
                      {marksResult.pct}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Assigned Grade</span>
                      <p className="font-mono font-bold text-emerald-400 text-lg mt-0.5">{marksResult.grade}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Division</span>
                      <p className="font-semibold text-slate-200 mt-0.5">{marksResult.division}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Enter obtained and total marks.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 5: Exam Result Sheet */}
      {mode === 'exam' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              Multi-Subject Exam Result Calculation
            </h3>
            <button
              onClick={() => setSubjects([...subjects, { id: Date.now(), name: `Subject ${subjects.length + 1}`, obtained: '80', max: '100' }])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-btn-brand"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subjects.map((sub, idx) => (
              <div key={sub.id} className="p-3 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => {
                    const updated = [...subjects];
                    updated[idx].name = e.target.value;
                    setSubjects(updated);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none flex-1 min-w-0"
                />
                <input
                  type="number"
                  placeholder="Obt"
                  value={sub.obtained}
                  onChange={(e) => {
                    const updated = [...subjects];
                    updated[idx].obtained = e.target.value;
                    setSubjects(updated);
                  }}
                  className="w-16 px-2 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono text-slate-100"
                />
                <span className="text-slate-500 text-xs">/</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={sub.max}
                  onChange={(e) => {
                    const updated = [...subjects];
                    updated[idx].max = e.target.value;
                    setSubjects(updated);
                  }}
                  className="w-16 px-2 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono text-slate-100"
                />
                {subjects.length > 1 && (
                  <button
                    onClick={() => setSubjects(subjects.filter(s => s.id !== sub.id))}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleExamCalc}
              className="w-full sm:w-auto btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Final Exam Standing
            </button>

            {examResult && (
              <div className="flex items-center gap-4 text-xs font-mono">
                <div>Total: <span className="font-bold text-slate-100">{examResult.totalObt} / {examResult.totalMax}</span></div>
                <div>Percentage: <span className="font-bold text-sky-400">{examResult.pct}%</span></div>
                <div>Grade: <span className="font-bold text-emerald-400">{examResult.grade}</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      <StepByStepSolution steps={steps} finalResult={basicResult ? basicResult.res : changeResult ? `${changeResult.rawChange}%` : null} />
    </CalculatorContainer>
  );
}
