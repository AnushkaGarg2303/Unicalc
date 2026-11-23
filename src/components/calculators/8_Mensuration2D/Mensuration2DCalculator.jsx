import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Shapes } from 'lucide-react';

export default function Mensuration2DCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [shape, setShape] = useState('square');

  // Input states
  const [valA, setValA] = useState('10');
  const [valB, setValB] = useState('6');
  const [valC, setValC] = useState('8');
  const [valH, setValH] = useState('5');
  const [valTheta, setValTheta] = useState('60');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const shapesList = [
    { id: 'square', name: 'Square', formula: 'Area = a² | P = 4a | d = a√2' },
    { id: 'rectangle', name: 'Rectangle', formula: 'Area = l × w | P = 2(l + w) | d = √(l² + w²)' },
    { id: 'triangle', name: 'Triangle (Base & Height)', formula: 'Area = ½ × b × h | P = a + b + c' },
    { id: 'equilateral_triangle', name: 'Equilateral Triangle', formula: 'Area = (√3/4)a² | h = (√3/2)a | P = 3a' },
    { id: 'isosceles_triangle', name: 'Isosceles Triangle', formula: 'Area = ½ × b × √(a² - b²/4) | P = 2a + b' },
    { id: 'scalene_triangle', name: 'Scalene Triangle (Heron)', formula: 'Area = √(s(s-a)(s-b)(s-c)) | s = (a+b+c)/2' },
    { id: 'right_triangle', name: 'Right-Angled Triangle', formula: 'Hypotenuse c = √(a² + b²) | Area = ½ × a × b' },
    { id: 'circle', name: 'Circle', formula: 'Area = πr² | Circumference = 2πr | d = 2r' },
    { id: 'semicircle', name: 'Semicircle', formula: 'Area = ½πr² | Perimeter = πr + 2r' },
    { id: 'quadrant', name: 'Quadrant', formula: 'Area = ¼πr² | Perimeter = ½πr + 2r' },
    { id: 'parallelogram', name: 'Parallelogram', formula: 'Area = b × h | Perimeter = 2(a + b)' },
    { id: 'rhombus', name: 'Rhombus', formula: 'Area = ½ × d₁ × d₂ | Side = ½√(d₁² + d₂²) | P = 4a' },
    { id: 'trapezium', name: 'Trapezium', formula: 'Area = ½(a + b) × h | Perimeter = a + b + c + d' },
    { id: 'kite', name: 'Kite', formula: 'Area = ½ × d₁ × d₂ | Perimeter = 2(a + b)' },
    { id: 'sector', name: 'Sector of Circle', formula: 'Area = (θ/360)πr² | Arc = (θ/360)2πr | P = Arc + 2r' },
    { id: 'annulus', name: 'Annulus (Ring)', formula: 'Area = π(R² - r²) | Width = R - r' }
  ];

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(valA);
    const b = parseFloat(valB);
    const c = parseFloat(valC);
    const h = parseFloat(valH);
    const theta = parseFloat(valTheta);

    let area = 0;
    let perimeter = 0;
    let extra = {};
    let calcSteps = [];

    switch (shape) {
      case 'square':
        if (isNaN(a) || a <= 0) { showToast('Enter valid side length', 'error'); return; }
        area = a * a;
        perimeter = 4 * a;
        const diag = a * Math.SQRT2;
        extra = { 'Diagonal': formatPrecision(diag, precision) };
        calcSteps = [
          { title: 'Area of Square', math: `Area = a² = (${a})² = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter of Square', math: `P = 4a = 4 × ${a} = ${formatPrecision(perimeter, precision)}` },
          { title: 'Diagonal length', math: `d = a√2 = ${a} × 1.4142... = ${formatPrecision(diag, precision)}` }
        ];
        break;

      case 'rectangle':
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { showToast('Enter valid length and width', 'error'); return; }
        area = a * b;
        perimeter = 2 * (a + b);
        const rectDiag = Math.sqrt(a * a + b * b);
        extra = { 'Diagonal': formatPrecision(rectDiag, precision) };
        calcSteps = [
          { title: 'Area of Rectangle', math: `Area = l × w = ${a} × ${b} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = 2(l + w) = 2(${a} + ${b}) = ${formatPrecision(perimeter, precision)}` },
          { title: 'Diagonal length', math: `d = √(l² + w²) = √(${a*a} + ${b*b}) = ${formatPrecision(rectDiag, precision)}` }
        ];
        break;

      case 'triangle':
        if (isNaN(b) || isNaN(h) || b <= 0 || h <= 0) { showToast('Enter valid base and height', 'error'); return; }
        area = 0.5 * b * h;
        perimeter = !isNaN(a) && !isNaN(c) ? a + b + c : b + 2 * Math.sqrt(h * h + (b / 2) * (b / 2));
        calcSteps = [
          { title: 'Area of Triangle', math: `Area = ½ × b × h = 0.5 × ${b} × ${h} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P ≈ ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'equilateral_triangle':
        if (isNaN(a) || a <= 0) { showToast('Enter valid side length', 'error'); return; }
        area = (Math.sqrt(3) / 4) * a * a;
        perimeter = 3 * a;
        const eqHeight = (Math.sqrt(3) / 2) * a;
        extra = { 'Altitude / Height': formatPrecision(eqHeight, precision) };
        calcSteps = [
          { title: 'Equilateral Triangle Area', math: `Area = (√3/4) × a² = (0.4330) × ${a * a} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = 3a = 3 × ${a} = ${formatPrecision(perimeter, precision)}` },
          { title: 'Height', math: `h = (√3/2)a = ${formatPrecision(eqHeight, precision)}` }
        ];
        break;

      case 'isosceles_triangle':
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0 || 2 * a <= b) {
          showToast('Equal sides (a) must satisfy 2a > base (b)', 'error');
          return;
        }
        const isoHeight = Math.sqrt(a * a - (b * b) / 4);
        area = 0.5 * b * isoHeight;
        perimeter = 2 * a + b;
        extra = { 'Height': formatPrecision(isoHeight, precision) };
        calcSteps = [
          { title: 'Height of Isosceles Triangle', math: `h = √(a² - b²/4) = √(${a*a} - ${(b*b)/4}) = ${formatPrecision(isoHeight, precision)}` },
          { title: 'Area', math: `Area = ½ × b × h = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = 2a + b = 2(${a}) + ${b} = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'scalene_triangle':
        if (isNaN(a) || isNaN(b) || isNaN(c) || a + b <= c || a + c <= b || b + c <= a) {
          showToast('Side lengths must satisfy triangle inequality (sum of any 2 > 3rd)', 'error');
          return;
        }
        const s = (a + b + c) / 2;
        area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        perimeter = a + b + c;
        extra = { 'Semi-perimeter (s)': formatPrecision(s, precision) };
        calcSteps = [
          { title: 'Semi-perimeter', math: `s = (a + b + c) / 2 = (${a} + ${b} + ${c}) / 2 = ${s}` },
          { title: "Heron's Formula Area", math: `Area = √[${s}(${s}-${a})(${s}-${b})(${s}-${c})] = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = a + b + c = ${perimeter}` }
        ];
        break;

      case 'right_triangle':
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { showToast('Enter valid legs a and b', 'error'); return; }
        const hyp = Math.sqrt(a * a + b * b);
        area = 0.5 * a * b;
        perimeter = a + b + hyp;
        extra = { 'Hypotenuse (c)': formatPrecision(hyp, precision) };
        calcSteps = [
          { title: 'Hypotenuse (Pythagorean Theorem)', math: `c = √(a² + b²) = √(${a*a} + ${b*b}) = ${formatPrecision(hyp, precision)}` },
          { title: 'Area', math: `Area = ½ × a × b = 0.5 × ${a} × ${b} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = a + b + c = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'circle':
        if (isNaN(a) || a <= 0) { showToast('Enter valid radius', 'error'); return; }
        area = Math.PI * a * a;
        perimeter = 2 * Math.PI * a;
        extra = { 'Diameter': formatPrecision(2 * a, precision) };
        calcSteps = [
          { title: 'Area of Circle', math: `Area = πr² = π × (${a})² = ${formatPrecision(area, precision)}` },
          { title: 'Circumference', math: `C = 2πr = 2 × π × ${a} = ${formatPrecision(perimeter, precision)}` },
          { title: 'Diameter', math: `d = 2r = ${2 * a}` }
        ];
        break;

      case 'semicircle':
        if (isNaN(a) || a <= 0) { showToast('Enter valid radius', 'error'); return; }
        area = 0.5 * Math.PI * a * a;
        perimeter = Math.PI * a + 2 * a;
        extra = { 'Diameter': formatPrecision(2 * a, precision) };
        calcSteps = [
          { title: 'Area of Semicircle', math: `Area = ½πr² = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter (Arc + Diameter)', math: `P = πr + 2r = π(${a}) + 2(${a}) = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'quadrant':
        if (isNaN(a) || a <= 0) { showToast('Enter valid radius', 'error'); return; }
        area = 0.25 * Math.PI * a * a;
        perimeter = 0.5 * Math.PI * a + 2 * a;
        calcSteps = [
          { title: 'Area of Quadrant', math: `Area = ¼πr² = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter (Quarter Arc + 2r)', math: `P = ½πr + 2r = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'parallelogram':
        if (isNaN(b) || isNaN(h) || isNaN(a) || b <= 0 || h <= 0) { showToast('Enter valid base, side, and height', 'error'); return; }
        area = b * h;
        perimeter = 2 * (a + b);
        calcSteps = [
          { title: 'Area of Parallelogram', math: `Area = base × height = ${b} × ${h} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = 2(a + b) = 2(${a} + ${b}) = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'rhombus':
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { showToast('Enter diagonals d1 and d2', 'error'); return; }
        area = 0.5 * a * b;
        const rSide = 0.5 * Math.sqrt(a * a + b * b);
        perimeter = 4 * rSide;
        extra = { 'Side length (a)': formatPrecision(rSide, precision) };
        calcSteps = [
          { title: 'Area from Diagonals', math: `Area = ½ × d₁ × d₂ = 0.5 × ${a} × ${b} = ${formatPrecision(area, precision)}` },
          { title: 'Side of Rhombus', math: `Side = ½√(d₁² + d₂²) = ${formatPrecision(rSide, precision)}` },
          { title: 'Perimeter', math: `P = 4 × Side = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'trapezium':
        if (isNaN(a) || isNaN(b) || isNaN(h) || a <= 0 || b <= 0 || h <= 0) { showToast('Enter parallel sides a, b and height h', 'error'); return; }
        area = 0.5 * (a + b) * h;
        perimeter = a + b + 2 * Math.sqrt(h * h + Math.pow((b - a) / 2, 2));
        calcSteps = [
          { title: 'Area of Trapezium', math: `Area = ½(a + b) × h = 0.5 × (${a} + ${b}) × ${h} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter (approx symmetric)', math: `P ≈ ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'kite':
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) { showToast('Enter diagonals d1 and d2', 'error'); return; }
        area = 0.5 * a * b;
        perimeter = 2 * (a + b);
        calcSteps = [
          { title: 'Area of Kite', math: `Area = ½ × d₁ × d₂ = 0.5 × ${a} × ${b} = ${formatPrecision(area, precision)}` },
          { title: 'Perimeter', math: `P = 2(side_a + side_b) ≈ ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'sector':
        if (isNaN(a) || isNaN(theta) || a <= 0 || theta <= 0) { showToast('Enter radius and angle θ in degrees', 'error'); return; }
        area = (theta / 360) * Math.PI * a * a;
        const arc = (theta / 360) * 2 * Math.PI * a;
        perimeter = arc + 2 * a;
        extra = { 'Arc Length': formatPrecision(arc, precision) };
        calcSteps = [
          { title: 'Sector Area', math: `Area = (θ/360) × πr² = (${theta}/360) × π × (${a})² = ${formatPrecision(area, precision)}` },
          { title: 'Arc Length', math: `Arc = (θ/360) × 2πr = ${formatPrecision(arc, precision)}` },
          { title: 'Perimeter (Arc + 2r)', math: `P = ${formatPrecision(arc, precision)} + 2(${a}) = ${formatPrecision(perimeter, precision)}` }
        ];
        break;

      case 'annulus':
        if (isNaN(a) || isNaN(b) || a <= b || b < 0) { showToast('Outer radius (R) must be strictly greater than inner radius (r)', 'error'); return; }
        area = Math.PI * (a * a - b * b);
        perimeter = 2 * Math.PI * (a + b);
        const width = a - b;
        extra = { 'Ring Width (R - r)': formatPrecision(width, precision) };
        calcSteps = [
          { title: 'Area of Annulus (Ring)', math: `Area = π(R² - r²) = π × (${a}² - ${b}²) = π × (${a*a - b*b}) = ${formatPrecision(area, precision)}` },
          { title: 'Total Boundaries (Outer + Inner)', math: `P = 2π(R + r) = ${formatPrecision(perimeter, precision)}` },
          { title: 'Width', math: `Width = R - r = ${a} - ${b} = ${width}` }
        ];
        break;

      default:
        return;
    }

    setSteps(calcSteps);
    setResult({
      area: formatPrecision(area, precision),
      perimeter: formatPrecision(perimeter, precision),
      extra
    });

    addHistory({
      tool: 'mensuration_2d',
      toolName: `2D ${shapesList.find(s => s.id === shape)?.name}`,
      expression: `Calculated ${shape}`,
      result: `Area = ${formatPrecision(area, precision)}, Perimeter = ${formatPrecision(perimeter, precision)}`
    });
  };

  const currShapeInfo = shapesList.find(s => s.id === shape);

  return (
    <CalculatorContainer
      title="Mensuration – 2D Shapes"
      subtitle="16 Plane figures: Area, perimeter, circumference, diagonals, sectors & rings"
      toolId="mensuration_2d"
      onReset={() => {
        setValA('10');
        setValB('6');
        setValC('8');
        setValH('5');
        setValTheta('60');
        setResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        'Shape': currShapeInfo?.name,
        'Enclosed Area': result.area,
        'Perimeter / Boundary': result.perimeter,
        ...result.extra
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title={currShapeInfo?.name || '2D Formula'}
        formula={currShapeInfo?.formula || ''}
        description="Select any of the 16 standard Euclidean plane geometric figures."
      />

      {/* Shape Selector Carousel / Grid */}
      <div className="flex gap-2 p-1.5 rounded-2xl glass-panel-subtle border border-white/10 overflow-x-auto mb-4">
        {shapesList.map(s => (
          <button
            key={s.id}
            onClick={() => {
              setShape(s.id);
              setResult(null);
              setSteps([]);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              shape === s.id ? 'bg-sky-500 text-white shadow-btn-brand' : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Dimensions (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-white/10">
            Dimensions for {currShapeInfo?.name}
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Inputs vary according to shape */}
            {['square', 'equilateral_triangle'].includes(shape) && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Side Length (a)</label>
                <input
                  type="number"
                  step="any"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            {['rectangle'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Length (l)</label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Width (w)</label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {['triangle'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base (b)</label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (h)</label>
                  <input
                    type="number"
                    step="any"
                    value={valH}
                    onChange={(e) => setValH(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {['isosceles_triangle'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Equal Sides (a)</label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base (b)</label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {['scalene_triangle'].includes(shape) && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side a</label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side b</label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side c</label>
                  <input
                    type="number"
                    step="any"
                    value={valC}
                    onChange={(e) => setValC(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {['right_triangle'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Perpendicular (a)</label>
                  <input
                    type="number"
                    step="any"
                    value={valA}
                    onChange={(e) => setValA(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base (b)</label>
                  <input
                    type="number"
                    step="any"
                    value={valB}
                    onChange={(e) => setValB(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {['circle', 'semicircle', 'quadrant'].includes(shape) && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Radius (r)</label>
                <input
                  type="number"
                  step="any"
                  value={valA}
                  onChange={(e) => setValA(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none"
                />
              </div>
            )}

            {['parallelogram'].includes(shape) && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side a</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base b</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height h</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['rhombus', 'kite'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Diagonal 1 (d₁)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Diagonal 2 (d₂)</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['trapezium'].includes(shape) && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side a</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Side b</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height h</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['sector'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Radius (r)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Angle (θ in degrees)</label>
                  <input type="number" step="any" value={valTheta} onChange={(e) => setValTheta(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['annulus'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Outer Radius (R)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Inner Radius (r)</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
            >
              Calculate Geometry
            </button>
          </form>
        </div>

        {/* Output & SVG Visualization (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">
              Geometric Metrics
            </h3>

            {/* Shape SVG Diagram */}
            <div className="my-4 h-32 flex items-center justify-center bg-black/30 rounded-2xl border border-white/5 p-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-sky-400 fill-sky-500/20 stroke-2">
                {shape === 'square' && <rect x="20" y="20" width="60" height="60" rx="4" />}
                {shape === 'rectangle' && <rect x="10" y="25" width="80" height="50" rx="4" />}
                {['triangle', 'equilateral_triangle', 'isosceles_triangle', 'scalene_triangle'].includes(shape) && (
                  <polygon points="50,15 15,85 85,85" />
                )}
                {shape === 'right_triangle' && <polygon points="20,15 20,85 85,85" />}
                {shape === 'circle' && <circle cx="50" cy="50" r="38" />}
                {shape === 'semicircle' && <path d="M 15 50 A 35 35 0 0 1 85 50 Z" />}
                {shape === 'quadrant' && <path d="M 20 20 L 20 80 A 60 60 0 0 0 80 80 Z" />}
                {shape === 'parallelogram' && <polygon points="30,20 90,20 70,80 10,80" />}
                {shape === 'rhombus' && <polygon points="50,10 90,50 50,90 10,50" />}
                {shape === 'trapezium' && <polygon points="30,20 70,20 90,80 10,80" />}
                {shape === 'kite' && <polygon points="50,10 85,45 50,90 15,45" />}
                {shape === 'sector' && <path d="M 50 50 L 85 30 A 40 40 0 0 0 20 25 Z" />}
                {shape === 'annulus' && (
                  <>
                    <circle cx="50" cy="50" r="38" />
                    <circle cx="50" cy="50" r="22" className="fill-black/30 stroke-sky-300" />
                  </>
                )}
              </svg>
            </div>

            {result ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                    <span className="text-sky-300 font-semibold uppercase">Total Area</span>
                    <p className="font-mono font-bold text-sky-400 text-lg mt-0.5">{result.area}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 font-semibold uppercase">Perimeter</span>
                    <p className="font-mono font-bold text-slate-100 text-lg mt-0.5">{result.perimeter}</p>
                  </div>
                </div>

                {result.extra && Object.entries(result.extra).map(([k, v]) => (
                  <div key={k} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between text-xs font-mono">
                    <span className="text-slate-400">{k}:</span>
                    <span className="font-bold text-slate-200">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400">
                Enter lengths and compute to view area and perimeter.
              </div>
            )}
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `Area = ${result.area}` : null} />
    </CalculatorContainer>
  );
}
