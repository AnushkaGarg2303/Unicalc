import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Clock, Briefcase } from 'lucide-react';

export default function TimeCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  // Mode: 'arithmetic', 'work_hours', 'conversion'
  const [mode, setMode] = useState('arithmetic');

  // Time Arithmetic: Time 1 +/- Time 2
  const [h1, setH1] = useState('4');
  const [m1, setM1] = useState('45');
  const [s1, setS1] = useState('30');
  const [op, setOp] = useState('+');
  const [h2, setH2] = useState('2');
  const [m2, setM2] = useState('35');
  const [s2, setS2] = useState('45');
  const [arithResult, setArithResult] = useState(null);

  // Working Hours Calculator
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMins, setBreakMins] = useState('45');
  const [hourlyWage, setHourlyWage] = useState('25');
  const [workResult, setWorkResult] = useState(null);

  // Quick unit converter
  const [convHours, setConvHours] = useState('3.5');
  const [convResult, setConvResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Time Arithmetic
  const handleArith = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const sec1 = (parseInt(h1, 10) || 0) * 3600 + (parseInt(m1, 10) || 0) * 60 + (parseInt(s1, 10) || 0);
    const sec2 = (parseInt(h2, 10) || 0) * 3600 + (parseInt(m2, 10) || 0) * 60 + (parseInt(s2, 10) || 0);

    let totSec = op === '+' ? sec1 + sec2 : sec1 - sec2;
    const isNegative = totSec < 0;
    totSec = Math.abs(totSec);

    const rh = Math.floor(totSec / 3600);
    const rm = Math.floor((totSec % 3600) / 60);
    const rs = totSec % 60;

    const formatted = `${isNegative ? '-' : ''}${rh}h ${rm}m ${rs}s`;
    const formattedDigital = `${isNegative ? '-' : ''}${String(rh).padStart(2, '0')}:${String(rm).padStart(2, '0')}:${String(rs).padStart(2, '0')}`;

    const calcSteps = [
      {
        title: 'Convert to Base Seconds',
        math: `Time 1 = ${sec1}s, Time 2 = ${sec2}s`
      },
      {
        title: `Perform ${op === '+' ? 'Addition' : 'Subtraction'}`,
        math: `${sec1}s ${op} ${sec2}s = ${isNegative ? '-' : ''}${totSec}s`
      },
      {
        title: 'Normalize back to HH:MM:SS',
        math: `= ${formatted} (${formattedDigital})`
      }
    ];

    setSteps(calcSteps);
    setArithResult({ formatted, formattedDigital, totalSeconds: totSec });

    addHistory({
      tool: 'time_calc',
      toolName: 'Time Calculator',
      expression: `${h1}:${m1}:${s1} ${op} ${h2}:${m2}:${s2}`,
      result: formattedDigital
    });
  };

  // Working Hours Calculator
  const handleWorkCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const bMins = parseFloat(breakMins) || 0;
    const wage = parseFloat(hourlyWage) || 0;

    let startTotalMins = sh * 60 + sm;
    let endTotalMins = eh * 60 + em;

    if (endTotalMins < startTotalMins) {
      endTotalMins += 24 * 60; // overnight shift
    }

    const grossMins = endTotalMins - startTotalMins;
    const netMins = Math.max(0, grossMins - bMins);
    const netHours = netMins / 60;
    const earnings = netHours * wage;

    const h = Math.floor(netMins / 60);
    const m = netMins % 60;

    const calcSteps = [
      {
        title: 'Gross Shift Duration',
        math: `From ${startTime} to ${endTime} = ${grossMins} minutes (${(grossMins / 60).toFixed(2)} hrs)`
      },
      {
        title: 'Deduct Unpaid Breaks',
        math: `${grossMins}m - ${bMins}m break = ${netMins} net minutes (${h}h ${m}m)`
      },
      {
        title: 'Estimated Earnings',
        math: `${netHours.toFixed(2)} hours × $${wage}/hr = $${earnings.toFixed(2)}`
      }
    ];

    setSteps(calcSteps);
    setWorkResult({
      h, m,
      decimalHours: netHours.toFixed(2),
      earnings: earnings.toFixed(2)
    });
  };

  // Unit conversion
  const handleConvertUnits = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const hrs = parseFloat(convHours) || 0;
    const mins = hrs * 60;
    const secs = mins * 60;

    setSteps([
      {
        title: 'Unit Conversion Breakdown',
        math: `${hrs} Hours = ${mins.toLocaleString()} Minutes = ${secs.toLocaleString()} Seconds`
      }
    ]);

    setConvResult({ mins, secs });
  };

  return (
    <CalculatorContainer
      title="Time Calculator"
      subtitle="HH:MM:SS arithmetic, working hours with break deduction & hour/minute conversions"
      toolId="time_calc"
      onReset={() => {
        setArithResult(null);
        setWorkResult(null);
        setConvResult(null);
        setSteps([]);
      }}
      summaryData={arithResult ? {
        'Time Result': arithResult.formattedDigital,
        'Standard Notation': arithResult.formatted,
        'Total Seconds': `${arithResult.totalSeconds}s`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Time Measurement Axioms"
        formula="1 Hour = 60 Minutes = 3,600 Seconds  |  1 Day = 24 Hours = 1,440 Minutes = 86,400 Seconds"
        description="Sexagesimal (base-60) arithmetic for precise chronometric calculations."
      />

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'arithmetic', label: 'Time Arithmetic (Add / Subtract)' },
          { id: 'work_hours', label: 'Working Hours & Wages' },
          { id: 'conversion', label: 'Hours ⇄ Minutes ⇄ Seconds' }
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

      {/* 1. Arithmetic */}
      {mode === 'arithmetic' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-5">
          <form onSubmit={handleArith} className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3">
              {/* Time 1 */}
              <div className="flex items-center gap-1.5 bg-black/40 p-2.5 rounded-2xl border border-white/10">
                <input type="number" min="0" value={h1} onChange={(e) => setH1(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">h</span>
                <input type="number" min="0" max="59" value={m1} onChange={(e) => setM1(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">m</span>
                <input type="number" min="0" max="59" value={s1} onChange={(e) => setS1(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">s</span>
              </div>

              {/* Op */}
              <select
                value={op}
                onChange={(e) => setOp(e.target.value)}
                className="px-3 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono text-lg font-bold"
              >
                <option value="+" className="bg-slate-900">+</option>
                <option value="−" className="bg-slate-900">−</option>
              </select>

              {/* Time 2 */}
              <div className="flex items-center gap-1.5 bg-black/40 p-2.5 rounded-2xl border border-white/10">
                <input type="number" min="0" value={h2} onChange={(e) => setH2(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">h</span>
                <input type="number" min="0" max="59" value={m2} onChange={(e) => setM2(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">m</span>
                <input type="number" min="0" max="59" value={s2} onChange={(e) => setS2(e.target.value)} className="w-14 text-center py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-sm text-slate-100" />
                <span className="text-xs text-slate-400 font-semibold">s</span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-calc-brand px-8 py-3 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Compute Time Duration
              </button>
            </div>
          </form>

          {arithResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <span className="text-xs uppercase text-slate-400 font-semibold">Resulting Duration</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-sky-400 mt-1">
                {arithResult.formatted}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">Digital: {arithResult.formattedDigital}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. Work Hours & Wages */}
      {mode === 'work_hours' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleWorkCalc} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shift Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shift End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Break (Minutes)</label>
                <input
                  type="number"
                  value={breakMins}
                  onChange={(e) => setBreakMins(e.target.value)}
                  placeholder="45"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hourly Pay Rate ($)</label>
                <input
                  type="number"
                  step="any"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(e.target.value)}
                  placeholder="25"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Calculate Shift & Wages
            </button>
          </form>

          {workResult && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
              <div>
                <span className="text-slate-400">Net Working Time:</span>
                <p className="text-2xl font-bold text-sky-400 mt-1">{workResult.h}h {workResult.m}m</p>
              </div>
              <div>
                <span className="text-slate-400">Decimal Hours:</span>
                <p className="text-2xl font-bold text-slate-100 mt-1">{workResult.decimalHours} hrs</p>
              </div>
              <div>
                <span className="text-slate-400">Estimated Earnings:</span>
                <p className="text-2xl font-bold text-emerald-400 mt-1">${workResult.earnings}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Conversion */}
      {mode === 'conversion' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-md mx-auto">
          <form onSubmit={handleConvertUnits} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours</label>
              <input
                type="number"
                step="any"
                value={convHours}
                onChange={(e) => setConvHours(e.target.value)}
                placeholder="3.5"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Convert Units
            </button>
          </form>

          {convResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 grid grid-cols-2 gap-3 text-center font-mono">
              <div>
                <span className="text-xs text-slate-400">Minutes</span>
                <p className="text-xl font-bold text-sky-400 mt-0.5">{convResult.mins.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Seconds</span>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{convResult.secs.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} />
    </CalculatorContainer>
  );
}
