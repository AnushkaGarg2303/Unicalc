import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision, factorial, permutation, combination } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Copy, Delete } from 'lucide-react';

export default function ScientificCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [resultVal, setResultVal] = useState('');
  const [angleMode, setAngleMode] = useState('DEG'); // 'DEG' or 'RAD'
  const [isInverse, setIsInverse] = useState(false);
  const [isHyperbolic, setIsHyperbolic] = useState(false);
  const [steps, setSteps] = useState([]);

  // nPr / nCr two-input state
  const [nVal, setNVal] = useState('');
  const [rVal, setRVal] = useState('');
  const [combType, setCombType] = useState('nCr'); // 'nCr' or 'nPr'

  const handleDigit = (digit) => {
    playClickSound(soundEnabled, 'normal');
    setInputVal(prev => prev + digit);
  };

  const handleClear = () => {
    playClickSound(soundEnabled, 'clear');
    setInputVal('');
    setResultVal('');
    setSteps([]);
  };

  const handleDelete = () => {
    playClickSound(soundEnabled, 'normal');
    setInputVal(prev => prev.slice(0, -1));
  };

  // Scientific Single-Argument Function Evaluator
  const executeSciFunction = (fnName) => {
    playClickSound(soundEnabled, 'action');
    const x = parseFloat(inputVal || resultVal);

    if (isNaN(x) && !['pi', 'e'].includes(fnName)) {
      showToast('Please enter a valid number first', 'error');
      return;
    }

    let res = 0;
    let title = '';
    let formulaDesc = '';

    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    switch (fnName) {
      case 'sin':
        if (isHyperbolic) {
          res = Math.sinh(x);
          title = `sinh(${x})`;
          formulaDesc = `sinh(x) = (eˣ - e⁻ˣ) / 2 = ${res}`;
        } else if (isInverse) {
          if (x < -1 || x > 1) {
            showToast('Domain of arcsin is [-1, 1]', 'error');
            return;
          }
          const rad = Math.asin(x);
          res = angleMode === 'DEG' ? toDeg(rad) : rad;
          title = `asin(${x})`;
          formulaDesc = `arcsin(${x}) = ${res}${angleMode === 'DEG' ? '°' : ' rad'}`;
        } else {
          const rad = angleMode === 'DEG' ? toRad(x) : x;
          res = Math.sin(rad);
          title = `sin(${x}${angleMode === 'DEG' ? '°' : ''})`;
          formulaDesc = `sin(${x}) = ${res}`;
        }
        break;

      case 'cos':
        if (isHyperbolic) {
          res = Math.cosh(x);
          title = `cosh(${x})`;
          formulaDesc = `cosh(x) = (eˣ + e⁻ˣ) / 2 = ${res}`;
        } else if (isInverse) {
          if (x < -1 || x > 1) {
            showToast('Domain of arccos is [-1, 1]', 'error');
            return;
          }
          const rad = Math.acos(x);
          res = angleMode === 'DEG' ? toDeg(rad) : rad;
          title = `acos(${x})`;
          formulaDesc = `arccos(${x}) = ${res}${angleMode === 'DEG' ? '°' : ' rad'}`;
        } else {
          const rad = angleMode === 'DEG' ? toRad(x) : x;
          res = Math.cos(rad);
          title = `cos(${x}${angleMode === 'DEG' ? '°' : ''})`;
          formulaDesc = `cos(${x}) = ${res}`;
        }
        break;

      case 'tan':
        if (isHyperbolic) {
          res = Math.tanh(x);
          title = `tanh(${x})`;
          formulaDesc = `tanh(x) = sinh(x) / cosh(x) = ${res}`;
        } else if (isInverse) {
          const rad = Math.atan(x);
          res = angleMode === 'DEG' ? toDeg(rad) : rad;
          title = `atan(${x})`;
          formulaDesc = `arctan(${x}) = ${res}${angleMode === 'DEG' ? '°' : ' rad'}`;
        } else {
          const rad = angleMode === 'DEG' ? toRad(x) : x;
          res = Math.tan(rad);
          title = `tan(${x}${angleMode === 'DEG' ? '°' : ''})`;
          formulaDesc = `tan(${x}) = ${res}`;
        }
        break;

      case 'log10':
        if (x <= 0) {
          showToast('Logarithm defined only for positive numbers (x > 0)', 'error');
          return;
        }
        res = Math.log10(x);
        title = `log₁₀(${x})`;
        formulaDesc = `log₁₀(${x}) = ${res}`;
        break;

      case 'ln':
        if (x <= 0) {
          showToast('Natural log defined only for positive numbers (x > 0)', 'error');
          return;
        }
        res = Math.log(x);
        title = `ln(${x})`;
        formulaDesc = `ln(${x}) = log_e(${x}) = ${res}`;
        break;

      case 'exp':
        res = Math.exp(x);
        title = `e^(${x})`;
        formulaDesc = `e^(${x}) = ${res}`;
        break;

      case 'abs':
        res = Math.abs(x);
        title = `|${x}|`;
        formulaDesc = `|${x}| = ${res}`;
        break;

      case 'floor':
        res = Math.floor(x);
        title = `floor(${x})`;
        formulaDesc = `⌊${x}⌋ = ${res}`;
        break;

      case 'ceil':
        res = Math.ceil(x);
        title = `ceil(${x})`;
        formulaDesc = `⌈${x}⌉ = ${res}`;
        break;

      case 'pi':
        res = Math.PI;
        title = 'π (Pi)';
        formulaDesc = `π ≈ 3.141592653589793`;
        break;

      case 'e':
        res = Math.E;
        title = 'e (Euler\'s Constant)';
        formulaDesc = `e ≈ 2.718281828459045`;
        break;

      default:
        return;
    }

    const formatted = formatPrecision(res, precision);
    setResultVal(formatted);
    setInputVal(formatted);

    const generatedSteps = [
      { title: 'Selected Function', desc: `Applied function in ${angleMode} mode`, math: title },
      { title: 'Mathematical Evaluation', math: formulaDesc },
      { title: 'Final Value', math: `= ${formatted}` }
    ];
    setSteps(generatedSteps);

    addHistory({
      tool: 'scientific',
      toolName: 'Scientific Calculator',
      expression: title,
      result: formatted
    });
  };

  // Evaluate Permutation / Combination
  const handlePermComb = () => {
    playClickSound(soundEnabled, 'action');
    const n = parseInt(nVal, 10);
    const r = parseInt(rVal, 10);

    if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
      showToast('Please enter valid non-negative integers for n and r', 'error');
      return;
    }
    if (r > n) {
      showToast('r cannot be greater than n (r ≤ n)', 'error');
      return;
    }

    let res = 0;
    let mathStr = '';

    if (combType === 'nPr') {
      res = permutation(n, r);
      mathStr = `${n}P${r} = ${n}! / (${n} - ${r})! = ${n}! / ${n - r}! = ${res}`;
    } else {
      res = combination(n, r);
      mathStr = `${n}C${r} = ${n}! / (${r}! × (${n} - ${r})!) = ${res}`;
    }

    const formatted = res.toString();
    setResultVal(formatted);

    const generatedSteps = [
      { title: `${combType} Calculation`, desc: `Evaluating ${combType} for n = ${n}, r = ${r}`, math: mathStr },
      { title: 'Factorials Expansion', math: `n! = ${factorial(n)}, r! = ${factorial(r)}, (n-r)! = ${factorial(n - r)}` },
      { title: 'Result', math: `= ${formatted}` }
    ];
    setSteps(generatedSteps);

    addHistory({
      tool: 'scientific',
      toolName: 'Scientific Calculator',
      expression: `${n}${combType === 'nPr' ? 'P' : 'C'}${r}`,
      result: formatted
    });
  };

  return (
    <CalculatorContainer
      title="Scientific Calculator"
      subtitle="Trigonometry, inverse, hyperbolic, logarithms, eˣ, permutations & combinations"
      toolId="scientific"
      onReset={handleClear}
      summaryData={{
        'Input Number': inputVal || '0',
        'Computed Result': resultVal || '0',
        'Angle Unit': angleMode,
        'Trig Mode': isInverse ? 'Inverse (Arc)' : isHyperbolic ? 'Hyperbolic' : 'Standard'
      }}
      steps={steps}
    >
      <FormulaCard
        title="Trigonometric & Exponential Identities"
        formula="sin²(θ) + cos²(θ) = 1  |  eⁱˣ = cos(x) + i·sin(x)  |  nPr = n! / (n-r)!  |  nCr = n! / (r!(n-r)!)"
        description="Supports both Degree and Radian modes, inverse functions (asin, acos, atan), hyperbolic functions (sinh, cosh, tanh), logs (base 10 & natural ln)."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Keypad */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/20 shadow-2xl space-y-4 transition-colors duration-200">
          {/* Display & Mode Status Bar */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold border border-sky-400/40 hover:bg-sky-500/30 transition-colors"
              >
                {angleMode}
              </button>
              <button
                onClick={() => {
                  setIsInverse(!isInverse);
                  setIsHyperbolic(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  isInverse
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-400/40'
                    : 'bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                INV
              </button>
              <button
                onClick={() => {
                  setIsHyperbolic(!isHyperbolic);
                  setIsInverse(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                  isHyperbolic
                    ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-400/40'
                    : 'bg-slate-200/60 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                HYP
              </button>
            </div>
            <span className="font-mono text-sky-600 dark:text-sky-400 text-xs font-semibold">Precision: {precision} Decimals</span>
          </div>

          {/* Screen */}
          <div className="rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 p-4 text-right shadow-inner relative transition-colors duration-200">
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400 min-h-[1.25rem]">
              x = {inputVal || '0'}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-sky-600 dark:text-sky-400 min-h-[2.5rem] flex items-center justify-end overflow-x-auto">
              {resultVal || (inputVal ? '' : '0')}
            </div>
            {resultVal && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(resultVal);
                  showToast('Result copied to clipboard!');
                }}
                className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-200/80 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Copy result"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scientific Keypad Grid */}
          <div className="grid grid-cols-5 gap-2">
            {/* Row 1 */}
            <button
              onClick={() => executeSciFunction('sin')}
              className="btn-calc-3d py-3 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-200 font-mono text-xs font-semibold"
            >
              {isHyperbolic ? 'sinh' : isInverse ? 'sin⁻¹' : 'sin'}
            </button>
            <button
              onClick={() => executeSciFunction('cos')}
              className="btn-calc-3d py-3 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-200 font-mono text-xs font-semibold"
            >
              {isHyperbolic ? 'cosh' : isInverse ? 'cos⁻¹' : 'cos'}
            </button>
            <button
              onClick={() => executeSciFunction('tan')}
              className="btn-calc-3d py-3 rounded-xl bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-200 font-mono text-xs font-semibold"
            >
              {isHyperbolic ? 'tanh' : isInverse ? 'tan⁻¹' : 'tan'}
            </button>
            <button
              onClick={() => executeSciFunction('log10')}
              className="btn-calc-3d py-3 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 font-mono text-xs font-semibold"
            >
              log₁₀
            </button>
            <button
              onClick={() => executeSciFunction('ln')}
              className="btn-calc-3d py-3 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 font-mono text-xs font-semibold"
            >
              ln
            </button>

            {/* Row 2 */}
            <button
              onClick={() => executeSciFunction('exp')}
              className="btn-calc-3d py-3 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 font-mono text-xs font-semibold"
            >
              eˣ
            </button>
            <button
              onClick={() => executeSciFunction('pi')}
              className="btn-calc-3d py-3 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold"
            >
              π
            </button>
            <button
              onClick={() => executeSciFunction('e')}
              className="btn-calc-3d py-3 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold"
            >
              e
            </button>
            <button
              onClick={() => executeSciFunction('abs')}
              className="btn-calc-3d py-3 rounded-xl text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold"
            >
              |x|
            </button>
            <button
              onClick={handleClear}
              className="btn-calc-accent py-3 rounded-xl text-white font-mono text-xs font-bold"
            >
              AC
            </button>

            {/* Row 3 */}
            <button
              onClick={() => executeSciFunction('floor')}
              className="btn-calc-3d py-3 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold"
            >
              ⌊x⌋
            </button>
            <button
              onClick={() => executeSciFunction('ceil')}
              className="btn-calc-3d py-3 rounded-xl text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold"
            >
              ⌈x⌉
            </button>
            <button
              onClick={() => handleDigit('7')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              9
            </button>

            {/* Row 4 */}
            <button
              onClick={handleDelete}
              className="btn-calc-3d py-3 rounded-xl text-rose-500 dark:text-rose-400 font-mono text-xs font-semibold flex items-center justify-center col-span-2"
            >
              <Delete className="w-4 h-4 mr-1" /> Backspace
            </button>
            <button
              onClick={() => handleDigit('4')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              6
            </button>

            {/* Row 5 */}
            <button
              onClick={() => handleDigit('0')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold col-span-2 text-center"
            >
              0
            </button>
            <button
              onClick={() => handleDigit('1')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="btn-calc-3d py-3 rounded-xl text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold"
            >
              3
            </button>
          </div>
        </div>

        {/* Right Col: Permutations & Combinations (nPr / nCr) */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-white/20 shadow-2xl flex flex-col justify-between space-y-4 transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Permutations & Combinations
              </h3>
              <div className="flex bg-slate-200/80 dark:bg-white/10 rounded-lg p-0.5">
                <button
                  onClick={() => setCombType('nCr')}
                  className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                    combType === 'nCr' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  nCr
                </button>
                <button
                  onClick={() => setCombType('nPr')}
                  className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                    combType === 'nPr' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  nPr
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              {combType === 'nCr'
                ? 'Combination (Order does not matter): nCr = n! / (r!(n-r)!)'
                : 'Permutation (Order matters): nPr = n! / (n-r)!'}
            </p>

            <div className="space-y-3 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Items (n)</label>
                <input
                  type="number"
                  min="0"
                  value={nVal}
                  onChange={(e) => setNVal(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Chosen Items (r)</label>
                <input
                  type="number"
                  min="0"
                  value={rVal}
                  onChange={(e) => setRVal(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePermComb}
            className="w-full btn-calc-brand py-3 rounded-xl text-white font-bold text-sm shadow-btn-brand"
          >
            Compute {combType}
          </button>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={resultVal} />
    </CalculatorContainer>
  );
}
