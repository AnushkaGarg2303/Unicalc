import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { evaluateExpression, formatPrecision, factorial } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Delete, Copy } from 'lucide-react';

export default function BasicCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [lastCalculated, setLastCalculated] = useState(false);
  const [steps, setSteps] = useState([]);

  // Handle tactile button press
  const handleInput = (char) => {
    playClickSound(soundEnabled, 'normal');

    if (lastCalculated && !['+', '−', '×', '÷', '^', '%'].includes(char)) {
      setExpression(char);
      setResult('');
      setLastCalculated(false);
      return;
    }

    if (lastCalculated) {
      setExpression(result + char);
      setResult('');
      setLastCalculated(false);
      return;
    }

    setExpression(prev => prev + char);
  };

  const handleClear = () => {
    playClickSound(soundEnabled, 'clear');
    setExpression('');
    setResult('');
    setSteps([]);
    setLastCalculated(false);
  };

  const handleDelete = () => {
    playClickSound(soundEnabled, 'normal');
    if (lastCalculated) {
      handleClear();
      return;
    }
    setExpression(prev => prev.slice(0, -1));
  };

  // Instant single-value operations: x², x³, √, ∛, 1/x, n!
  const handleSpecialOp = (op) => {
    playClickSound(soundEnabled, 'action');
    const valStr = result || expression;
    const num = parseFloat(valStr);

    if (isNaN(num)) {
      showToast('Please enter or compute a valid number first', 'error');
      return;
    }

    let calculated = 0;
    let stepTitle = '';
    let stepMath = '';

    switch (op) {
      case 'sq':
        calculated = num * num;
        stepTitle = 'Square (x²)';
        stepMath = `(${num})² = ${num} × ${num} = ${formatPrecision(calculated, precision)}`;
        break;
      case 'cube':
        calculated = num * num * num;
        stepTitle = 'Cube (x³)';
        stepMath = `(${num})³ = ${num} × ${num} × ${num} = ${formatPrecision(calculated, precision)}`;
        break;
      case 'sqrt':
        if (num < 0) {
          showToast('Cannot take square root of negative number', 'error');
          return;
        }
        calculated = Math.sqrt(num);
        stepTitle = 'Square Root (√x)';
        stepMath = `√(${num}) = ${formatPrecision(calculated, precision)}`;
        break;
      case 'cbrt':
        calculated = Math.cbrt(num);
        stepTitle = 'Cube Root (∛x)';
        stepMath = `∛(${num}) = ${formatPrecision(calculated, precision)}`;
        break;
      case 'recip':
        if (num === 0) {
          showToast('Cannot divide by zero', 'error');
          return;
        }
        calculated = 1 / num;
        stepTitle = 'Reciprocal (1/x)';
        stepMath = `1 / (${num}) = ${formatPrecision(calculated, precision)}`;
        break;
      case 'fact':
        if (num < 0 || !Number.isInteger(num)) {
          showToast('Factorial requires a non-negative integer', 'error');
          return;
        }
        if (num > 170) {
          showToast('Number too large for factorial', 'error');
          return;
        }
        calculated = factorial(num);
        stepTitle = 'Factorial (n!)';
        stepMath = `${num}! = ${calculated}`;
        break;
      default:
        return;
    }

    const formatted = formatPrecision(calculated, precision);
    setResult(formatted);
    setExpression(`${op}(${num})`);
    setLastCalculated(true);

    const generatedSteps = [
      { title: 'Input Value', math: `x = ${num}` },
      { title: stepTitle, math: stepMath },
      { title: 'Computed Result', math: `= ${formatted}` }
    ];
    setSteps(generatedSteps);

    addHistory({
      tool: 'basic',
      toolName: 'Basic Calculator',
      expression: `${stepTitle} on ${num}`,
      result: formatted
    });
  };

  // Evaluate Expression using BODMAS
  const handleCalculate = () => {
    if (!expression) return;
    playClickSound(soundEnabled, 'action');

    const evalResult = evaluateExpression(expression);
    if (evalResult === 'Error' || isNaN(evalResult)) {
      setResult('Error');
      showToast('Syntax or evaluation error in expression', 'error');
      return;
    }

    const formatted = formatPrecision(evalResult, precision);
    setResult(formatted);
    setLastCalculated(true);

    // Build BODMAS step-by-step
    const generatedSteps = [
      {
        title: 'Original Input Expression',
        desc: 'UniCalc applies standard BODMAS hierarchy: Brackets, Orders (powers & roots), Division & Multiplication, Addition & Subtraction.',
        math: expression
      },
      {
        title: 'BODMAS Evaluation',
        desc: 'Evaluated operators by mathematical priority.',
        math: `${expression} = ${formatted}`
      }
    ];
    setSteps(generatedSteps);

    addHistory({
      tool: 'basic',
      toolName: 'Basic Calculator',
      expression: expression,
      result: formatted
    });
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        handleInput(key);
      } else if (key === '+') {
        handleInput('+');
      } else if (key === '-') {
        handleInput('−');
      } else if (key === '*') {
        handleInput('×');
      } else if (key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (key === '(' || key === ')') {
        handleInput(key);
      } else if (key === '^') {
        handleInput('^');
      } else if (key === '%') {
        handleInput('%');
      } else if (key === '.') {
        handleInput('.');
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <CalculatorContainer
      title="Basic Calculator"
      subtitle="Complete arithmetic, BODMAS parentheses, powers, roots, factorials & full keyboard support"
      toolId="basic"
      onReset={handleClear}
      summaryData={{
        'Input Expression': expression || '0',
        'Evaluated Result': result || '0',
        'Precision': `${precision} decimals`
      }}
      steps={steps}
    >
      <FormulaCard
        title="BODMAS Order of Operations"
        formula="B → O → D → M → A → S  |  ( )  →  ^ / √  →  ÷ / ×  →  + / −"
        description="Standard mathematical convention to evaluate expressions: Brackets first, Orders (powers/roots), Division & Multiplication, then Addition & Subtraction."
      />

      {/* Main Glassmorphic Calculator Body */}
      <div className="max-w-md mx-auto glass-panel rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-white/20 shadow-2xl relative transition-colors duration-200">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Display Screen */}
        <div className="rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/10 p-4 mb-5 text-right relative overflow-hidden shadow-inner transition-colors duration-200">
          <div className="text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400 min-h-[1.5rem] break-all overflow-x-auto">
            {expression || '0'}
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold font-mono text-sky-600 dark:text-sky-400 min-h-[2.5rem] flex items-center justify-end break-all overflow-x-auto">
            {result || (expression ? '' : '0')}
          </div>
          {result && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
                showToast('Result copied to clipboard!');
              }}
              className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-200/80 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Copy result"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Keypad Grid */}
        <div className="space-y-2.5">
          {/* Row 1: Special Math Functions (x², x³, √, ∛, 1/x, n!) */}
          <div className="grid grid-cols-6 gap-2">
            <button
              onClick={() => handleSpecialOp('sq')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Square (x²)"
            >
              x²
            </button>
            <button
              onClick={() => handleSpecialOp('cube')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Cube (x³)"
            >
              x³
            </button>
            <button
              onClick={() => handleSpecialOp('sqrt')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Square Root (√)"
            >
              √x
            </button>
            <button
              onClick={() => handleSpecialOp('cbrt')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Cube Root (∛)"
            >
              ∛x
            </button>
            <button
              onClick={() => handleSpecialOp('recip')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Reciprocal (1/x)"
            >
              1/x
            </button>
            <button
              onClick={() => handleSpecialOp('fact')}
              className="btn-calc-3d py-2 rounded-xl text-sky-600 dark:text-sky-300 font-mono text-xs font-semibold"
              title="Factorial (n!)"
            >
              n!
            </button>
          </div>

          {/* Row 2: Clear, Parens, Delete */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={handleClear}
              className="btn-calc-accent py-3.5 rounded-2xl text-white font-bold text-sm"
              title="Clear All (Esc)"
            >
              AC
            </button>
            <button
              onClick={() => handleInput('(')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-800 dark:text-slate-200 font-mono text-base font-semibold"
              title="Left Parenthesis"
            >
              (
            </button>
            <button
              onClick={() => handleInput(')')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-800 dark:text-slate-200 font-mono text-base font-semibold"
              title="Right Parenthesis"
            >
              )
            </button>
            <button
              onClick={handleDelete}
              className="btn-calc-3d py-3.5 rounded-2xl text-rose-500 dark:text-rose-400 font-mono text-base font-semibold flex items-center justify-center"
              title="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Row 3: Modulo, Power, Divide, Multiply */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => handleInput('%')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-base font-semibold"
              title="Modulus / Percent"
            >
              %
            </button>
            <button
              onClick={() => handleInput('^')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-base font-semibold"
              title="Power (xʸ)"
            >
              xʸ
            </button>
            <button
              onClick={() => handleInput('÷')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-lg font-bold"
              title="Divide (/)"
            >
              ÷
            </button>
            <button
              onClick={() => handleInput('×')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-lg font-bold"
              title="Multiply (*)"
            >
              ×
            </button>
          </div>

          {/* Row 4: 7, 8, 9, Minus */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => handleInput('7')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              7
            </button>
            <button
              onClick={() => handleInput('8')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              8
            </button>
            <button
              onClick={() => handleInput('9')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              9
            </button>
            <button
              onClick={() => handleInput('−')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-lg font-bold"
              title="Subtract (-)"
            >
              −
            </button>
          </div>

          {/* Row 5: 4, 5, 6, Plus */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => handleInput('4')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              4
            </button>
            <button
              onClick={() => handleInput('5')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              5
            </button>
            <button
              onClick={() => handleInput('6')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              6
            </button>
            <button
              onClick={() => handleInput('+')}
              className="btn-calc-3d py-3.5 rounded-2xl text-sky-600 dark:text-sky-300 font-mono text-lg font-bold"
              title="Add (+)"
            >
              +
            </button>
          </div>

          {/* Row 6: 1, 2, 3, Equals */}
          <div className="grid grid-cols-4 gap-2.5">
            <button
              onClick={() => handleInput('1')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              1
            </button>
            <button
              onClick={() => handleInput('2')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              2
            </button>
            <button
              onClick={() => handleInput('3')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              3
            </button>
            <button
              onClick={handleCalculate}
              className="btn-calc-brand row-span-2 py-3.5 rounded-2xl text-white font-mono text-xl font-bold flex items-center justify-center shadow-btn-brand"
              title="Calculate (Enter / =)"
            >
              =
            </button>

            {/* Row 7: 0, decimal */}
            <button
              onClick={() => handleInput('0')}
              className="btn-calc-3d col-span-2 py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold text-center"
            >
              0
            </button>
            <button
              onClick={() => handleInput('.')}
              className="btn-calc-3d py-3.5 rounded-2xl text-slate-900 dark:text-slate-100 font-mono text-lg font-semibold"
            >
              .
            </button>
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result} />
    </CalculatorContainer>
  );
}
