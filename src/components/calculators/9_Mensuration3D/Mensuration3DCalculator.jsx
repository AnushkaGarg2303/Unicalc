import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { Box } from 'lucide-react';

export default function Mensuration3DCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [shape, setShape] = useState('cube');

  // Input states
  const [valA, setValA] = useState('6'); // side / radius / length
  const [valB, setValB] = useState('4'); // width / small radius
  const [valC, setValC] = useState('5'); // height / depth
  const [valH, setValH] = useState('10');

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const shapesList = [
    { id: 'cube', name: 'Cube', formula: 'V = a³ | TSA = 6a² | LSA = 4a² | d = a√3' },
    { id: 'cuboid', name: 'Cuboid', formula: 'V = l·w·h | TSA = 2(lw + wh + hl) | d = √(l² + w² + h²)' },
    { id: 'cylinder', name: 'Cylinder', formula: 'V = πr²h | CSA = 2πrh | TSA = 2πr(r + h)' },
    { id: 'hollow_cylinder', name: 'Hollow Cylinder', formula: 'V = πh(R² - r²) | TSA = 2π(R+r)h + 2π(R² - r²)' },
    { id: 'cone', name: 'Cone', formula: 'V = ⅓πr²h | l = √(r² + h²) | CSA = πrl | TSA = πr(r + l)' },
    { id: 'frustum_cone', name: 'Frustum of Cone', formula: 'V = ⅓πh(R² + r² + Rr) | l = √((R-r)² + h²)' },
    { id: 'sphere', name: 'Sphere', formula: 'V = ⁴⁄₃πr³ | Surface Area = 4πr² | d = 2r' },
    { id: 'hemisphere', name: 'Hemisphere', formula: 'V = ⅔πr³ | CSA = 2πr² | TSA = 3πr²' },
    { id: 'prism', name: 'Prism', formula: 'V = Base Area × h | LSA = Base Perimeter × h | TSA = LSA + 2(Base Area)' },
    { id: 'pyramid', name: 'Pyramid (Square Base)', formula: 'V = ⅓a²h | Slant l = √(h² + (a/2)²) | TSA = a² + 2al' },
    { id: 'frustum_pyramid', name: 'Frustum of Pyramid', formula: 'V = ⅓h(A₁ + A₂ + √(A₁A₂))' }
  ];

  const handleCalculate = (e) => {
    if (e) e.preventDefault();
    playClickSound(soundEnabled, 'action');

    const a = parseFloat(valA);
    const b = parseFloat(valB);
    const c = parseFloat(valC);
    const h = parseFloat(valH);

    let volume = 0;
    let tsa = 0;
    let lsa = 0;
    let extra = {};
    let calcSteps = [];

    switch (shape) {
      case 'cube':
        if (isNaN(a) || a <= 0) { showToast('Enter valid side length', 'error'); return; }
        volume = a * a * a;
        tsa = 6 * a * a;
        lsa = 4 * a * a;
        const diag = a * Math.sqrt(3);
        extra = { 'Space Diagonal': formatPrecision(diag, precision) };
        calcSteps = [
          { title: 'Volume of Cube', math: `V = a³ = (${a})³ = ${formatPrecision(volume, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = 6a² = 6 × (${a})² = ${formatPrecision(tsa, precision)}` },
          { title: 'Lateral Surface Area (LSA)', math: `LSA = 4a² = 4 × (${a})² = ${formatPrecision(lsa, precision)}` },
          { title: 'Space Diagonal', math: `d = a√3 = ${a} × 1.732... = ${formatPrecision(diag, precision)}` }
        ];
        break;

      case 'cuboid':
        if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
          showToast('Enter valid length, width, and height', 'error'); return;
        }
        volume = a * b * c;
        tsa = 2 * (a * b + b * c + c * a);
        lsa = 2 * c * (a + b);
        const cuboidDiag = Math.sqrt(a * a + b * b + c * c);
        extra = { 'Space Diagonal': formatPrecision(cuboidDiag, precision) };
        calcSteps = [
          { title: 'Volume of Cuboid', math: `V = l × w × h = ${a} × ${b} × ${c} = ${formatPrecision(volume, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = 2(lw + wh + hl) = ${formatPrecision(tsa, precision)}` },
          { title: 'Lateral Surface Area (LSA)', math: `LSA = 2h(l + w) = 2(${c})(${a} + ${b}) = ${formatPrecision(lsa, precision)}` }
        ];
        break;

      case 'cylinder':
        if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) { showToast('Enter radius and height', 'error'); return; }
        volume = Math.PI * a * a * h;
        lsa = 2 * Math.PI * a * h;
        tsa = 2 * Math.PI * a * (a + h);
        const baseArea = Math.PI * a * a;
        extra = { 'Base Area': formatPrecision(baseArea, precision) };
        calcSteps = [
          { title: 'Volume of Cylinder', math: `V = πr²h = π × (${a})² × ${h} = ${formatPrecision(volume, precision)}` },
          { title: 'Curved Surface Area (CSA)', math: `CSA = 2πrh = 2 × π × ${a} × ${h} = ${formatPrecision(lsa, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = 2πr(r + h) = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'hollow_cylinder':
        if (isNaN(a) || isNaN(b) || isNaN(h) || a <= b || b < 0 || h <= 0) {
          showToast('Outer radius R must be greater than inner radius r', 'error'); return;
        }
        volume = Math.PI * h * (a * a - b * b);
        const extCSA = 2 * Math.PI * a * h;
        const intCSA = 2 * Math.PI * b * h;
        lsa = extCSA + intCSA;
        tsa = lsa + 2 * Math.PI * (a * a - b * b);
        extra = { 'External CSA': formatPrecision(extCSA, precision), 'Internal CSA': formatPrecision(intCSA, precision) };
        calcSteps = [
          { title: 'Hollow Volume', math: `V = πh(R² - r²) = π × ${h} × (${a * a} - ${b * b}) = ${formatPrecision(volume, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = 2π(R + r)h + 2π(R² - r²) = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'cone':
        if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) { showToast('Enter radius and height', 'error'); return; }
        const slant = Math.sqrt(a * a + h * h);
        volume = (1 / 3) * Math.PI * a * a * h;
        lsa = Math.PI * a * slant;
        tsa = Math.PI * a * (a + slant);
        extra = { 'Slant Height (l)': formatPrecision(slant, precision) };
        calcSteps = [
          { title: 'Slant Height (Pythagoras)', math: `l = √(r² + h²) = √(${a * a} + ${h * h}) = ${formatPrecision(slant, precision)}` },
          { title: 'Volume of Cone', math: `V = ⅓πr²h = ⅓ × π × (${a})² × ${h} = ${formatPrecision(volume, precision)}` },
          { title: 'Curved Surface Area (CSA)', math: `CSA = πrl = π × ${a} × ${formatPrecision(slant, precision)} = ${formatPrecision(lsa, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = πr(r + l) = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'frustum_cone':
        if (isNaN(a) || isNaN(b) || isNaN(h) || a <= b || b < 0 || h <= 0) {
          showToast('Bottom radius (R) must be greater than top radius (r)', 'error'); return;
        }
        const frustumSlant = Math.sqrt(Math.pow(a - b, 2) + h * h);
        volume = (1 / 3) * Math.PI * h * (a * a + b * b + a * b);
        lsa = Math.PI * frustumSlant * (a + b);
        tsa = lsa + Math.PI * (a * a + b * b);
        extra = { 'Slant Height (l)': formatPrecision(frustumSlant, precision) };
        calcSteps = [
          { title: 'Slant Height', math: `l = √((R - r)² + h²) = ${formatPrecision(frustumSlant, precision)}` },
          { title: 'Volume of Frustum', math: `V = ⅓πh(R² + r² + Rr) = ${formatPrecision(volume, precision)}` },
          { title: 'Total Surface Area', math: `TSA = πl(R + r) + π(R² + r²) = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'sphere':
        if (isNaN(a) || a <= 0) { showToast('Enter valid radius', 'error'); return; }
        volume = (4 / 3) * Math.PI * Math.pow(a, 3);
        tsa = 4 * Math.PI * a * a;
        lsa = tsa;
        extra = { 'Diameter': formatPrecision(2 * a, precision) };
        calcSteps = [
          { title: 'Volume of Sphere', math: `V = ⁴⁄₃πr³ = ⁴⁄₃ × π × (${a})³ = ${formatPrecision(volume, precision)}` },
          { title: 'Surface Area', math: `A = 4πr² = 4 × π × (${a})² = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'hemisphere':
        if (isNaN(a) || a <= 0) { showToast('Enter valid radius', 'error'); return; }
        volume = (2 / 3) * Math.PI * Math.pow(a, 3);
        lsa = 2 * Math.PI * a * a;
        tsa = 3 * Math.PI * a * a;
        calcSteps = [
          { title: 'Volume of Hemisphere', math: `V = ⅔πr³ = ⅔ × π × (${a})³ = ${formatPrecision(volume, precision)}` },
          { title: 'Curved Surface Area (CSA)', math: `CSA = 2πr² = ${formatPrecision(lsa, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = 3πr² = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'prism':
        // Regular triangular prism: base side a, prism height h
        if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) { showToast('Enter base edge and prism height', 'error'); return; }
        const triBaseArea = (Math.sqrt(3) / 4) * a * a;
        volume = triBaseArea * h;
        lsa = 3 * a * h;
        tsa = lsa + 2 * triBaseArea;
        extra = { 'Base Area': formatPrecision(triBaseArea, precision) };
        calcSteps = [
          { title: 'Volume of Prism', math: `V = Base Area × h = ${formatPrecision(triBaseArea, precision)} × ${h} = ${formatPrecision(volume, precision)}` },
          { title: 'Lateral Surface Area (LSA)', math: `LSA = Perimeter × h = 3(${a}) × ${h} = ${formatPrecision(lsa, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = LSA + 2(Base Area) = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'pyramid':
        // Square base: base side a, vertical height h
        if (isNaN(a) || isNaN(h) || a <= 0 || h <= 0) { showToast('Enter base edge and height', 'error'); return; }
        const pyrSlant = Math.sqrt(h * h + (a / 2) * (a / 2));
        volume = (1 / 3) * a * a * h;
        lsa = 2 * a * pyrSlant;
        tsa = a * a + lsa;
        extra = { 'Slant Height (l)': formatPrecision(pyrSlant, precision), 'Base Area': formatPrecision(a * a, precision) };
        calcSteps = [
          { title: 'Slant Height', math: `l = √(h² + (a/2)²) = √(${h * h} + ${(a / 2) * (a / 2)}) = ${formatPrecision(pyrSlant, precision)}` },
          { title: 'Volume of Pyramid', math: `V = ⅓ × a² × h = ⅓ × (${a})² × ${h} = ${formatPrecision(volume, precision)}` },
          { title: 'Lateral Surface Area (4 faces)', math: `LSA = 2 × a × l = ${formatPrecision(lsa, precision)}` },
          { title: 'Total Surface Area (TSA)', math: `TSA = a² + LSA = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      case 'frustum_pyramid':
        // Square frustum: bottom side a, top side b, vertical height h
        if (isNaN(a) || isNaN(b) || isNaN(h) || a <= b || b < 0 || h <= 0) {
          showToast('Bottom base edge (a) must be greater than top base edge (b)', 'error'); return;
        }
        const a1 = a * a;
        const a2 = b * b;
        volume = (1 / 3) * h * (a1 + a2 + Math.sqrt(a1 * a2));
        const fPyrSlant = Math.sqrt(h * h + Math.pow((a - b) / 2, 2));
        lsa = 2 * (a + b) * fPyrSlant;
        tsa = a1 + a2 + lsa;
        extra = { 'Slant Height': formatPrecision(fPyrSlant, precision) };
        calcSteps = [
          { title: 'Volume of Frustum of Pyramid', math: `V = ⅓h(A₁ + A₂ + √(A₁A₂)) = ${formatPrecision(volume, precision)}` },
          { title: 'Total Surface Area', math: `TSA = A₁ + A₂ + LSA = ${formatPrecision(tsa, precision)}` }
        ];
        break;

      default:
        return;
    }

    setSteps(calcSteps);
    setResult({
      volume: formatPrecision(volume, precision),
      tsa: formatPrecision(tsa, precision),
      lsa: formatPrecision(lsa, precision),
      extra
    });

    addHistory({
      tool: 'mensuration_3d',
      toolName: `3D ${shapesList.find(s => s.id === shape)?.name}`,
      expression: `Calculated 3D ${shape}`,
      result: `Volume = ${formatPrecision(volume, precision)}, TSA = ${formatPrecision(tsa, precision)}`
    });
  };

  const currShapeInfo = shapesList.find(s => s.id === shape);

  return (
    <CalculatorContainer
      title="Mensuration – 3D Shapes"
      subtitle="11 Solid figures: Volume, Curved Surface Area (CSA), Total Surface Area (TSA) & slant height"
      toolId="mensuration_3d"
      onReset={() => {
        setValA('6');
        setValB('4');
        setValC('5');
        setValH('10');
        setResult(null);
        setSteps([]);
      }}
      summaryData={result ? {
        '3D Solid': currShapeInfo?.name,
        'Volume Capacity': result.volume,
        'Total Surface Area (TSA)': result.tsa,
        'Curved / Lateral Surface Area': result.lsa,
        ...result.extra
      } : {}}
      steps={steps}
    >
      <FormulaCard
        title={currShapeInfo?.name || '3D Formula'}
        formula={currShapeInfo?.formula || ''}
        description="Select any of the 11 spatial geometric solids."
      />

      {/* Shape Selector Carousel */}
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
        {/* Dimensions Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 pb-2 border-b border-white/10">
            Dimensions for {currShapeInfo?.name}
          </h3>

          <form onSubmit={handleCalculate} className="space-y-4">
            {shape === 'cube' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Side / Edge Length (a)</label>
                <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none" />
              </div>
            )}

            {shape === 'cuboid' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Length (l)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Width (w)</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (h)</label>
                  <input type="number" step="any" value={valC} onChange={(e) => setValC(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['cylinder', 'cone'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Radius (r)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vertical Height (h)</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['hollow_cylinder', 'frustum_cone'].includes(shape) && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Outer Radius (R)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Inner Radius (r)</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (h)</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {['sphere', 'hemisphere'].includes(shape) && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Radius (r)</label>
                <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
              </div>
            )}

            {['prism', 'pyramid'].includes(shape) && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Edge (a)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (h)</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            {shape === 'frustum_pyramid' && (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bottom Edge (a)</label>
                  <input type="number" step="any" value={valA} onChange={(e) => setValA(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Top Edge (b)</label>
                  <input type="number" step="any" value={valB} onChange={(e) => setValB(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height (h)</label>
                  <input type="number" step="any" value={valH} onChange={(e) => setValH(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm" />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-calc-brand py-3.5 rounded-xl text-white font-bold text-sm shadow-btn-brand"
            >
              Compute 3D Surface & Capacity
            </button>
          </form>
        </div>

        {/* Output & 3D Isometric Visual (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-white/10">
              3D Metrics
            </h3>

            {/* 3D Wireframe SVG Graphic */}
            <div className="my-4 h-32 flex items-center justify-center bg-black/30 rounded-2xl border border-white/5 p-3">
              <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-sky-400 fill-sky-500/20 stroke-2">
                {shape === 'cube' && (
                  <path d="M 30 35 L 70 35 L 70 75 L 30 75 Z M 30 35 L 45 15 L 85 15 L 70 35 Z M 85 15 L 85 55 L 70 75 Z" />
                )}
                {shape === 'cuboid' && (
                  <path d="M 20 40 L 75 40 L 75 80 L 20 80 Z M 20 40 L 35 20 L 90 20 L 75 40 Z M 90 20 L 90 60 L 75 80 Z" />
                )}
                {['cylinder', 'hollow_cylinder'].includes(shape) && (
                  <>
                    <ellipse cx="50" cy="25" rx="30" ry="12" />
                    <ellipse cx="50" cy="75" rx="30" ry="12" />
                    <line x1="20" y1="25" x2="20" y2="75" />
                    <line x1="80" y1="25" x2="80" y2="75" />
                  </>
                )}
                {shape === 'cone' && (
                  <>
                    <ellipse cx="50" cy="80" rx="32" ry="12" />
                    <line x1="18" y1="80" x2="50" y2="15" />
                    <line x1="82" y1="80" x2="50" y2="15" />
                  </>
                )}
                {shape === 'frustum_cone' && (
                  <>
                    <ellipse cx="50" cy="30" rx="20" ry="8" />
                    <ellipse cx="50" cy="80" rx="35" ry="12" />
                    <line x1="30" y1="30" x2="15" y2="80" />
                    <line x1="70" y1="30" x2="85" y2="80" />
                  </>
                )}
                {shape === 'sphere' && (
                  <>
                    <circle cx="50" cy="50" r="35" />
                    <ellipse cx="50" cy="50" rx="35" ry="12" strokeDasharray="3 3" />
                  </>
                )}
                {shape === 'hemisphere' && (
                  <>
                    <ellipse cx="50" cy="40" rx="35" ry="14" />
                    <path d="M 15 40 A 35 35 0 0 0 85 40 Z" />
                  </>
                )}
                {shape === 'pyramid' && (
                  <path d="M 50 15 L 20 75 L 65 85 L 85 65 Z M 50 15 L 65 85 M 50 15 L 85 65" />
                )}
                {shape === 'prism' && (
                  <path d="M 30 30 L 60 15 L 80 40 Z M 30 75 L 60 60 L 80 85 Z M 30 30 L 30 75 M 60 15 L 60 60 M 80 40 L 80 85" />
                )}
                {shape === 'frustum_pyramid' && (
                  <path d="M 35 30 L 65 30 L 85 80 L 15 80 Z" />
                )}
              </svg>
            </div>

            {result ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                  <span className="text-xs uppercase font-bold text-sky-300">Volume (Capacity)</span>
                  <div className="text-2xl font-black font-mono text-sky-400 mt-0.5">{result.volume}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Total Surface (TSA)</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{result.tsa}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400">Curved/Lateral (LSA)</span>
                    <p className="font-mono font-bold text-slate-100 text-sm mt-0.5">{result.lsa}</p>
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
                Enter measurements to compute capacity & total surface area.
              </div>
            )}
          </div>
        </div>
      </div>

      <StepByStepSolution steps={steps} finalResult={result ? `Volume = ${result.volume}` : null} />
    </CalculatorContainer>
  );
}
