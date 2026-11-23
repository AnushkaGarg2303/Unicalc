import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { HeartPulse, Check, ArrowRight } from 'lucide-react';

export default function BmiCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' or 'imperial'

  // Metric: height in cm, weight in kg
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');

  // Imperial: height in feet & inches, weight in lbs
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('155');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    let hMeters = 0;
    let wKilos = 0;

    if (unitSystem === 'metric') {
      const cm = parseFloat(heightCm);
      const kg = parseFloat(weightKg);
      if (isNaN(cm) || isNaN(kg) || cm <= 0 || kg <= 0) {
        showToast('Please enter valid positive height and weight', 'error');
        return;
      }
      hMeters = cm / 100;
      wKilos = kg;
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const lbs = parseFloat(weightLbs) || 0;
      const totalInches = ft * 12 + inch;

      if (totalInches <= 0 || lbs <= 0) {
        showToast('Please enter valid positive imperial height and weight', 'error');
        return;
      }
      hMeters = totalInches * 0.0254;
      wKilos = lbs * 0.45359237;
    }

    const bmi = wKilos / (hMeters * hMeters);

    let category = '';
    let categoryColor = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-sky-400';
    } else if (bmi < 25) {
      category = 'Normal weight (Healthy)';
      categoryColor = 'text-emerald-400';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-amber-400';
    } else if (bmi < 35) {
      category = 'Obesity Class I';
      categoryColor = 'text-orange-400';
    } else if (bmi < 40) {
      category = 'Obesity Class II';
      categoryColor = 'text-rose-400';
    } else {
      category = 'Obesity Class III (Severe)';
      categoryColor = 'text-rose-500';
    }

    // Normal range weight for this height (BMI 18.5 to 24.9)
    const minHealthyKg = 18.5 * (hMeters * hMeters);
    const maxHealthyKg = 24.9 * (hMeters * hMeters);

    const minHealthyLbs = minHealthyKg * 2.20462;
    const maxHealthyLbs = maxHealthyKg * 2.20462;

    let targetDiffText = '';
    if (bmi < 18.5) {
      const gainKg = minHealthyKg - wKilos;
      targetDiffText = `Gain at least ${formatPrecision(gainKg, 1)} kg (${formatPrecision(gainKg * 2.20462, 1)} lbs) to reach normal BMI.`;
    } else if (bmi > 24.9) {
      const loseKg = wKilos - maxHealthyKg;
      targetDiffText = `Lose at least ${formatPrecision(loseKg, 1)} kg (${formatPrecision(loseKg * 2.20462, 1)} lbs) to reach normal BMI.`;
    } else {
      targetDiffText = 'Great job! Your weight is in the ideal healthy range for your height.';
    }

    const calcSteps = [
      {
        title: 'Normalized Metric Measurements',
        math: `Height = ${formatPrecision(hMeters, 2)} m  |  Weight = ${formatPrecision(wKilos, 1)} kg`
      },
      {
        title: 'Body Mass Index Formula',
        desc: 'BMI = Weight (kg) / [Height (m)]²',
        math: `BMI = ${formatPrecision(wKilos, 1)} / (${formatPrecision(hMeters, 2)})² = ${formatPrecision(wKilos, 1)} / ${formatPrecision(hMeters * hMeters, 4)} = ${formatPrecision(bmi, precision)}`
      },
      {
        title: 'WHO Classification',
        math: `Category: ${category}`
      },
      {
        title: 'Healthy Weight Range for this Height',
        math: `Ideal weight: ${formatPrecision(minHealthyKg, 1)} kg - ${formatPrecision(maxHealthyKg, 1)} kg (${formatPrecision(minHealthyLbs, 1)} lbs - ${formatPrecision(maxHealthyLbs, 1)} lbs)`
      }
    ];

    setSteps(calcSteps);
    setResult({
      bmi: formatPrecision(bmi, 1),
      category,
      categoryColor,
      minHealthy: unitSystem === 'metric' ? `${formatPrecision(minHealthyKg, 1)} kg` : `${formatPrecision(minHealthyLbs, 1)} lbs`,
      maxHealthy: unitSystem === 'metric' ? `${formatPrecision(maxHealthyKg, 1)} kg` : `${formatPrecision(maxHealthyLbs, 1)} lbs`,
      targetDiffText,
      percentGauge: Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))
    });

    addHistory({
      tool: 'bmi',
      toolName: 'BMI Calculator',
      expression: `${wKilos.toFixed(1)} kg, ${(hMeters * 100).toFixed(0)} cm`,
      result: `BMI = ${formatPrecision(bmi, 1)} (${category})`
    });
  };

  return (
    <CalculatorContainer
      title="BMI Calculator"
      subtitle="Body Mass Index, World Health Organization categories, healthy weight goals & metric/imperial support"
      toolId="bmi"
      onReset={() => {
        setResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        'Body Mass Index': result.bmi,
        'Classification': result.category,
        'Optimal Weight Range': `${result.minHealthy} - ${result.maxHealthy}`,
        'Advice': result.targetDiffText
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title="Body Mass Index (BMI)"
        formula="Metric: BMI = weight (kg) / [height (m)]²  |  Imperial: BMI = 703 × weight (lbs) / [height (in)]²"
        description="Standardized screening metric developed by Adolphe Quetelet to categorize body mass."
      />

      {/* Unit System Switcher */}
      <div className="flex gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 w-fit mb-4">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            unitSystem === 'metric' ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
          }`}
        >
          Metric Units (cm, kg)
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            unitSystem === 'imperial' ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
          }`}
        >
          Imperial Units (ft/in, lbs)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <form onSubmit={handleCalculate} className="space-y-4">
            {unitSystem === 'metric' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="any"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="175"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="any"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="70"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Height (Feet)</label>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Height (Inches)</label>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="9"
                      className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Weight (Pounds lbs)</label>
                  <input
                    type="number"
                    step="any"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="155"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
            >
              Compute BMI & Health Range
            </button>
          </form>
        </div>

        {/* Output & Spectrum Gauge (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">
              BMI Diagnostic Report
            </h3>

            {result ? (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Your BMI Score</span>
                  <div className="text-4xl font-black font-mono text-sky-400 mt-1">{result.bmi}</div>
                  <span className={`text-sm font-bold mt-1 block ${result.categoryColor}`}>
                    {result.category}
                  </span>
                </div>

                {/* Color Spectrum Gauge */}
                <div>
                  <div className="w-full h-3 rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-500 relative">
                    <div
                      style={{ left: `${result.percentGauge}%` }}
                      className="absolute -top-1 w-5 h-5 -ml-2.5 rounded-full bg-white border-2 border-slate-900 shadow-lg"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1.5">
                    <span>18.5</span>
                    <span>25.0</span>
                    <span>30.0</span>
                    <span>35+</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Normal Range:</span>
                    <span className="font-mono font-bold text-slate-100">{result.minHealthy} – {result.maxHealthy}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] pt-1 border-t border-white/10">{result.targetDiffText}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm">
                Enter your height & weight to compute BMI.
              </div>
            )}
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `BMI = ${result.bmi} (${result.category})` : null} />
    </CalculatorContainer>
  );
}
