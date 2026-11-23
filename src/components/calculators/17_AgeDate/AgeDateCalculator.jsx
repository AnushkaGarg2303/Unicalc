import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { playClickSound } from '../../../utils/soundUtils';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function AgeDateCalculator() {
  const { soundEnabled, addHistory, showToast } = useApp();

  // Mode: 'age', 'diff', 'add_sub', 'countdown', 'leap_year', 'day_of_week', 'working_days'
  const [mode, setMode] = useState('age');

  // 1. Age state
  const [dob, setDob] = useState('2000-01-15');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [ageResult, setAgeResult] = useState(null);

  // 2. Date Difference state
  const [date1, setDate1] = useState('2024-01-01');
  const [date2, setDate2] = useState('2026-11-23');
  const [diffResult, setDiffResult] = useState(null);

  // 3. Add/Subtract Days
  const [baseDate, setBaseDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [daysOffset, setDaysOffset] = useState('30');
  const [offsetDirection, setOffsetDirection] = useState('add'); // 'add' or 'subtract'
  const [offsetResult, setOffsetResult] = useState(null);

  // 4. Leap Year state
  const [yearToCheck, setYearToCheck] = useState('2028');
  const [leapResult, setLeapResult] = useState(null);

  // 5. Day of the Week
  const [lookupDate, setLookupDate] = useState('1947-08-15');
  const [dowResult, setDowResult] = useState(null);

  // 6. Working Days
  const [workStart, setWorkStart] = useState('2026-11-01');
  const [workEnd, setWorkEnd] = useState('2026-11-30');
  const [workResult, setWorkResult] = useState(null);

  const [steps, setSteps] = useState([]);

  // Calculate Exact Age
  const handleAgeCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      showToast('Please enter valid dates', 'error');
      return;
    }
    if (birth > target) {
      showToast('Date of birth cannot be in the future relative to comparison date', 'error');
      return;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday countdown
    let nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday - target) / (1000 * 60 * 60 * 24));

    const calcSteps = [
      {
        title: 'Chronological Age Breakdown',
        desc: 'Difference between birth date and reference date accounting for variable month lengths',
        math: `${years} Years, ${months} Months, and ${days} Days`
      },
      {
        title: 'Alternative Time Scales',
        math: `Total Days: ${totalDays.toLocaleString()} days  |  Total Weeks: ${totalWeeks.toLocaleString()} weeks  |  Total Hours: ${totalHours.toLocaleString()} hours`
      },
      {
        title: 'Next Birthday Countdown',
        math: `Next birthday in ${daysToNextBday} days (${nextBday.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`
      }
    ];

    setSteps(calcSteps);
    setAgeResult({
      years, months, days,
      totalDays, totalWeeks, totalHours,
      daysToNextBday
    });

    addHistory({
      tool: 'age_date',
      toolName: 'Age Calculator',
      expression: `Born ${dob}`,
      result: `${years}y ${months}m ${days}d`
    });
  };

  // Date Difference
  const handleDiffCalc = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      showToast('Enter valid dates', 'error');
      return;
    }

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    const calcSteps = [
      {
        title: 'Interval Duration',
        math: `${years} Years, ${months} Months, ${days} Days`
      },
      {
        title: 'Total Cumulative Days',
        math: `${totalDays.toLocaleString()} Calendar Days`
      }
    ];

    setSteps(calcSteps);
    setDiffResult({ years, months, days, totalDays });
  };

  // Add / Subtract Days
  const handleAddSub = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const b = new Date(baseDate);
    const offset = parseInt(daysOffset, 10);

    if (isNaN(b.getTime()) || isNaN(offset)) {
      showToast('Enter a valid date and integer day count', 'error');
      return;
    }

    const resDate = new Date(b);
    resDate.setDate(resDate.getDate() + (offsetDirection === 'add' ? offset : -offset));

    const formatted = resDate.toISOString().slice(0, 10);
    const dayName = resDate.toLocaleDateString(undefined, { weekday: 'long' });

    setSteps([
      {
        title: `${offsetDirection === 'add' ? 'Added' : 'Subtracted'} ${offset} Days`,
        math: `${baseDate} ${offsetDirection === 'add' ? '+' : '-'} ${offset} days = ${formatted} (${dayName})`
      }
    ]);

    setOffsetResult({ formatted, dayName });
  };

  // Leap Year Check
  const handleLeapCheck = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const y = parseInt(yearToCheck, 10);
    if (isNaN(y)) {
      showToast('Enter a valid year', 'error');
      return;
    }

    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);

    const calcSteps = [
      {
        title: 'Gregorian Calendar Leap Year Rules',
        desc: '1. Divisible by 4? 2. If divisible by 100, must also be divisible by 400.',
        math: `Year ${y}: Divisible by 4? ${y % 4 === 0 ? 'Yes' : 'No'} | Divisible by 100? ${y % 100 === 0 ? 'Yes' : 'No'} | Divisible by 400? ${y % 400 === 0 ? 'Yes' : 'No'}`
      },
      {
        title: 'Verdict',
        math: `${y} is ${isLeap ? 'A LEAP YEAR (366 days, Feb has 29 days)' : 'A COMMON YEAR (365 days, Feb has 28 days)'}`
      }
    ];

    setSteps(calcSteps);
    setLeapResult({ year: y, isLeap });
  };

  // Day of Week
  const handleDowCheck = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const d = new Date(lookupDate);
    if (isNaN(d.getTime())) {
      showToast('Enter a valid date', 'error');
      return;
    }

    const dayName = d.toLocaleDateString(undefined, { weekday: 'long' });
    const fullDate = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    setSteps([
      {
        title: 'Day of the Week Calculation',
        math: `${fullDate} was a ${dayName}`
      }
    ]);

    setDowResult({ dayName, fullDate });
  };

  // Working / Business Days
  const handleWorkingDays = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const s = new Date(workStart);
    const eD = new Date(workEnd);

    if (isNaN(s.getTime()) || isNaN(eD.getTime())) {
      showToast('Enter valid start and end dates', 'error');
      return;
    }

    let cur = new Date(s);
    let workDays = 0;
    let weekendDays = 0;

    while (cur <= eD) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        workDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    setSteps([
      {
        title: 'Working Days Analysis',
        desc: 'Evaluated Monday through Friday as business days, Saturday and Sunday as weekends',
        math: `Total Working Days = ${workDays}  |  Weekend Days = ${weekendDays}`
      }
    ]);

    setWorkResult({ workDays, weekendDays, total: workDays + weekendDays });
  };

  return (
    <CalculatorContainer
      title="Age & Date Calculator"
      subtitle="Age in Y/M/D, date difference, business working days, countdowns & leap year verifier"
      toolId="age_date"
      onReset={() => {
        setAgeResult(null);
        setDiffResult(null);
        setOffsetResult(null);
        setLeapResult(null);
        setDowResult(null);
        setWorkResult(null);
        setSteps([]);
      }}
      summaryData={ageResult ? {
        'Exact Age': `${ageResult.years}y, ${ageResult.months}m, ${ageResult.days}d`,
        'Total Days Lived': `${ageResult.totalDays} Days`,
        'Next Birthday': `In ${ageResult.daysToNextBday} Days`
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Calendar Math & Astronomical Rules"
        formula="Age = EndDate - StartDate  |  Leap Year: (Year % 4 == 0 && Year % 100 != 0) || (Year % 400 == 0)"
        description="Handles Gregorian calendar variations, irregular month day lengths (28, 29, 30, 31), and leap years."
      />

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 mb-4">
        {[
          { id: 'age', label: 'Exact Age Calculator' },
          { id: 'diff', label: 'Date Difference' },
          { id: 'add_sub', label: 'Add / Subtract Days' },
          { id: 'working_days', label: 'Working Days' },
          { id: 'day_of_week', label: 'Day of the Week' },
          { id: 'leap_year', label: 'Leap Year Checker' }
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

      {/* 1. Age */}
      {mode === 'age' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
            <form onSubmit={handleAgeCalc} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age as of Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
              >
                Calculate Exact Age
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">Age Summary</h3>
              {ageResult ? (
                <div className="space-y-3 mt-4">
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                    <span className="text-xs uppercase tracking-wider text-sky-300 font-semibold">Exact Age</span>
                    <div className="text-3xl font-black font-mono text-sky-400 mt-1">
                      {ageResult.years}y {ageResult.months}m {ageResult.days}d
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Total Days</span>
                      <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{ageResult.totalDays.toLocaleString()}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400">Next Birthday</span>
                      <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">In {ageResult.daysToNextBday} days</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Select birth date to compute.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Date Difference */}
      {mode === 'diff' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleDiffCalc} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Calculate Difference
            </button>
          </form>

          {diffResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Time Interval:</span>
                <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">
                  {diffResult.years} Years, {diffResult.months} Months, {diffResult.days} Days
                </div>
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold">
                {diffResult.totalDays} Total Days
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Add/Subtract */}
      {mode === 'add_sub' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-lg mx-auto">
          <form onSubmit={handleAddSub} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Base Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Action</label>
                <select
                  value={offsetDirection}
                  onChange={(e) => setOffsetDirection(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                >
                  <option value="add" className="bg-slate-900">Add (+)</option>
                  <option value="subtract" className="bg-slate-900">Subtract (−)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Days</label>
                <input
                  type="number"
                  value={daysOffset}
                  onChange={(e) => setDaysOffset(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Future / Past Date
            </button>
          </form>

          {offsetResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-xs text-slate-400">Target Date:</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">{offsetResult.formatted}</div>
              <p className="text-xs text-slate-300 mt-1">{offsetResult.dayName}</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Working Days */}
      {mode === 'working_days' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleWorkingDays} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-calc-brand px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Compute Business Working Days
            </button>
          </form>

          {workResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div>
                <span className="text-slate-400">Working Days:</span>
                <p className="text-2xl font-bold text-sky-400 mt-1">{workResult.workDays}</p>
              </div>
              <div>
                <span className="text-slate-400">Weekend Days:</span>
                <p className="text-2xl font-bold text-purple-400 mt-1">{workResult.weekendDays}</p>
              </div>
              <div>
                <span className="text-slate-400">Total Span:</span>
                <p className="text-2xl font-bold text-slate-200 mt-1">{workResult.total}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Day of Week */}
      {mode === 'day_of_week' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-md mx-auto">
          <form onSubmit={handleDowCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Any Historical or Future Date</label>
              <input
                type="date"
                value={lookupDate}
                onChange={(e) => setLookupDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Find Day of Week
            </button>
          </form>

          {dowResult && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
              <span className="text-xs text-slate-400">{dowResult.fullDate}</span>
              <div className="text-3xl font-black font-mono text-sky-400 mt-0.5">{dowResult.dayName}</div>
            </div>
          )}
        </div>
      )}

      {/* 6. Leap Year */}
      {mode === 'leap_year' && (
        <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4 max-w-md mx-auto">
          <form onSubmit={handleLeapCheck} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Enter Year (e.g. 2028)</label>
              <input
                type="number"
                value={yearToCheck}
                onChange={(e) => setYearToCheck(e.target.value)}
                placeholder="2028"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-xs shadow-btn-brand"
            >
              Check Leap Year
            </button>
          </form>

          {leapResult && (
            <div className={`p-4 rounded-2xl border text-center ${
              leapResult.isLeap ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-500/10 border-slate-500/30'
            }`}>
              <div className="text-2xl font-black font-mono">
                {leapResult.isLeap ? (
                  <span className="text-emerald-400">{leapResult.year} is a Leap Year!</span>
                ) : (
                  <span className="text-slate-300">{leapResult.year} is NOT a Leap Year</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {leapResult.isLeap ? 'Has 366 days (February 29 exists)' : 'Has 365 standard days'}
              </p>
            </div>
          )}
        </div>
      )}

      <StepByStepSolution steps={steps} />
    </CalculatorContainer>
  );
}
