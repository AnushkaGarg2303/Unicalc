import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { UNIT_CATEGORIES, convertUnit } from '../../../utils/unitData';
import { ArrowLeftRight, ArrowUpDown } from 'lucide-react';

export default function UnitConverterCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const categoryKeys = Object.keys(UNIT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('length');

  const catData = UNIT_CATEGORIES[selectedCategory];
  const unitKeys = Object.keys(catData.units);

  const [fromVal, setFromVal] = useState('100');
  const [fromUnit, setFromUnit] = useState(() => unitKeys[2] || unitKeys[0]); // default e.g. meter
  const [toUnit, setToUnit] = useState(() => unitKeys[3] || unitKeys[1]); // default e.g. km

  // When category changes, update fromUnit and toUnit safely
  const handleCategoryChange = (newCat) => {
    setSelectedCategory(newCat);
    const newUnitKeys = Object.keys(UNIT_CATEGORIES[newCat].units);
    setFromUnit(newUnitKeys[0]);
    setToUnit(newUnitKeys[1] || newUnitKeys[0]);
    playClickSound(soundEnabled, 'normal');
  };

  const handleSwap = () => {
    playClickSound(soundEnabled, 'normal');
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const numVal = parseFloat(fromVal);
  const convertedResult = !isNaN(numVal)
    ? convertUnit(numVal, selectedCategory, fromUnit, toUnit)
    : 0;

  const formattedResult = formatPrecision(convertedResult, precision);

  const fromName = catData.units[fromUnit]?.name || fromUnit;
  const toName = catData.units[toUnit]?.name || toUnit;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    showToast('Converted value copied to clipboard!');
  };

  return (
    <CalculatorContainer
      title="Unit Converter"
      subtitle="15 Measurement categories: Length, weight, temperature, speed, area, volume & physical units"
      toolId="unit_converter"
      onReset={() => {
        setFromVal('100');
      }}
      summaryData={{
        'Category': catData.name,
        'Original Value': `${fromVal} ${fromName}`,
        'Converted Result': `${formattedResult} ${toName}`
      }}
      steps={[
        {
          title: `Direct Conversion in ${catData.name}`,
          desc: `Translating from ${fromName} to ${toName}`,
          math: `${fromVal} ${fromName} = ${formattedResult} ${toName}`
        }
      ]}
    >
      <FormulaCard
        title={`${catData.name} Conversion Matrix`}
        formula="Standard Metric & Imperial conversion relations across all 15 scientific dimensions"
        description="UniCalc uses exact physical constants for conversion across ISO, SI, and Imperial standards."
      />

      {/* 15 Category Selector Carousel */}
      <div className="flex gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 overflow-x-auto mb-5">
        {categoryKeys.map(k => (
          <button
            key={k}
            onClick={() => handleCategoryChange(k)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === k ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {UNIT_CATEGORIES[k].name}
          </button>
        ))}
      </div>

      {/* Main Conversion Panel */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
          {/* From Input (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">From Unit</label>
            <input
              type="number"
              step="any"
              value={fromVal}
              onChange={(e) => setFromVal(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-slate-100 font-mono text-base focus:outline-none focus:border-sky-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {unitKeys.map(u => (
                <option key={u} value={u} className="bg-slate-900">{catData.units[u].name}</option>
              ))}
            </select>
          </div>

          {/* Swap Button (1 col) */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-sky-400 transition-all active:scale-95 shadow-md"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5 hidden md:block" />
              <ArrowUpDown className="w-5 h-5 md:hidden" />
            </button>
          </div>

          {/* To Output (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">To Unit</label>
            <div
              onClick={handleCopy}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-sky-300 font-mono text-base font-bold truncate flex items-center justify-between cursor-pointer hover:border-sky-500/40"
              title="Click to copy"
            >
              <span>{formattedResult}</span>
              <span className="text-[10px] text-slate-500 uppercase">Copy</span>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              {unitKeys.map(u => (
                <option key={u} value={u} className="bg-slate-900">{catData.units[u].name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Cross-Conversion Matrix to ALL sister units */}
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-semibold uppercase text-slate-400 mb-3 tracking-wider">
            Live {catData.name} Equivalent Equivalences
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {unitKeys.map(uKey => {
              const uObj = catData.units[uKey];
              const conv = convertUnit(numVal || 0, selectedCategory, fromUnit, uKey);
              const isSelected = uKey === toUnit;
              return (
                <div
                  key={uKey}
                  onClick={() => setToUnit(uKey)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-500/20 border-sky-400/40 shadow-sm text-sky-300'
                      : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 truncate">{uObj.name}</div>
                  <div className="font-mono font-bold mt-0.5 truncate text-slate-100">
                    {formatPrecision(conv, precision)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
