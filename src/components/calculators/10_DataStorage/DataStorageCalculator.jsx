import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import CalculatorContainer from '../../common/CalculatorContainer';
import FormulaCard from '../../common/FormulaCard';
import StepByStepSolution from '../../common/StepByStepSolution';
import { formatPrecision } from '../../../utils/mathUtils';
import { playClickSound } from '../../../utils/soundUtils';
import { HardDrive, Network, Clock, ArrowRight } from 'lucide-react';

export default function DataStorageCalculator() {
  const { soundEnabled, precision, addHistory, showToast } = useApp();

  const [value, setValue] = useState('1');
  const [sourceUnit, setSourceUnit] = useState('GB');
  const [standard, setStandard] = useState('binary'); // 'binary' (1024) or 'decimal' (1000)

  // Transfer speed estimator
  const [fileSizeVal, setFileSizeVal] = useState('10');
  const [fileSizeUnit, setFileSizeUnit] = useState('GB');
  const [speedVal, setSpeedVal] = useState('100');
  const [speedUnit, setSpeedUnit] = useState('Mbps'); // 'Mbps', 'MB/s', 'Gbps'
  const [transferTime, setTransferTime] = useState(null);

  const unitsList = [
    { id: 'b', name: 'Bit (b)', power: 0, isBit: true },
    { id: 'nibble', name: 'Nibble (4 bits)', power: 0, isNibble: true },
    { id: 'B', name: 'Byte (B)', power: 0 },
    { id: 'KB', name: 'Kilobyte (KB / KiB)', power: 1 },
    { id: 'MB', name: 'Megabyte (MB / MiB)', power: 2 },
    { id: 'GB', name: 'Gigabyte (GB / GiB)', power: 3 },
    { id: 'TB', name: 'Terabyte (TB / TiB)', power: 4 },
    { id: 'PB', name: 'Petabyte (PB / PiB)', power: 5 },
    { id: 'EB', name: 'Exabyte (EB / EiB)', power: 6 },
    { id: 'ZB', name: 'Zettabyte (ZB / ZiB)', power: 7 },
    { id: 'YB', name: 'Yottabyte (YB / YiB)', power: 8 }
  ];

  const baseMultiplier = standard === 'binary' ? 1024 : 1000;

  // Convert given value to base Bytes
  const numVal = parseFloat(value) || 0;
  let inBytes = 0;
  const srcObj = unitsList.find(u => u.id === sourceUnit);

  if (srcObj) {
    if (srcObj.isBit) {
      inBytes = numVal / 8;
    } else if (srcObj.isNibble) {
      inBytes = numVal / 2;
    } else {
      inBytes = numVal * Math.pow(baseMultiplier, srcObj.power);
    }
  }

  // Convert inBytes to any target unit
  const convertTo = (targetId) => {
    const tgt = unitsList.find(u => u.id === targetId);
    if (!tgt) return 0;
    if (tgt.isBit) return inBytes * 8;
    if (tgt.isNibble) return inBytes * 2;
    return inBytes / Math.pow(baseMultiplier, tgt.power);
  };

  // Transfer time estimator
  const handleEstimateTransfer = () => {
    playClickSound(soundEnabled, 'action');
    const fSize = parseFloat(fileSizeVal) || 0;
    const spd = parseFloat(speedVal) || 0;

    if (fSize <= 0 || spd <= 0) {
      showToast('Enter positive values for file size and network speed', 'error');
      return;
    }

    // Convert file size to Megabits (Mb)
    let fSizeInMB = fSize;
    if (fileSizeUnit === 'KB') fSizeInMB = fSize / 1024;
    if (fileSizeUnit === 'GB') fSizeInMB = fSize * 1024;
    if (fileSizeUnit === 'TB') fSizeInMB = fSize * 1024 * 1024;
    const fSizeInMegabits = fSizeInMB * 8;

    // Convert speed to Megabits per second (Mbps)
    let speedInMbps = spd;
    if (speedUnit === 'MB/s') speedInMbps = spd * 8;
    if (speedUnit === 'Gbps') speedInMbps = spd * 1000;

    const totalSeconds = fSizeInMegabits / speedInMbps;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.round(totalSeconds % 60);

    let formattedTime = '';
    if (hrs > 0) formattedTime += `${hrs}h `;
    if (mins > 0 || hrs > 0) formattedTime += `${mins}m `;
    formattedTime += `${secs}s`;

    setTransferTime({
      seconds: totalSeconds.toFixed(1),
      human: formattedTime
    });
  };

  return (
    <CalculatorContainer
      title="Data Storage Converter"
      subtitle="Bits, Nibbles, Bytes up to Yottabytes with Binary (1024) & Decimal (1000) conversions"
      toolId="data_storage"
      onReset={() => {
        setValue('1');
        setSourceUnit('GB');
        setStandard('binary');
        setTransferTime(null);
      }}
      summaryData={{
        'Input Size': `${value} ${sourceUnit}`,
        'Storage System': standard === 'binary' ? 'Binary (Base 2: 1024)' : 'Decimal (Base 10: 1000)',
        'In Bytes': `${formatPrecision(inBytes, precision)} B`,
        'In Bits': `${formatPrecision(inBytes * 8, precision)} bits`
      }}
      steps={[
        {
          title: 'Base Conversion to Bytes',
          math: `${value} ${sourceUnit} = ${formatPrecision(inBytes, precision)} Bytes (${formatPrecision(inBytes * 8, precision)} bits)`
        },
        {
          title: 'Standard Multiplier',
          desc: standard === 'binary' ? 'IEC 60027-2 standard uses 1024 (2¹⁰) multiplier' : 'SI standard uses 1000 (10³) multiplier',
          math: `1 Unit = ${baseMultiplier} × Sub-unit`
        }
      ]}
    >
      <FormulaCard
        title="Digital Storage Standards"
        formula="Binary: 1 KiB = 1024 B = 2¹⁰ B  |  Decimal: 1 KB = 1000 B = 10³ B  |  1 Byte = 8 bits"
        description="Operating systems like Windows and macOS memory typically measure in powers of 2 (1024), while storage drive manufacturers label capacity in powers of 10 (1000)."
      />

      {/* Input & Mode Settings */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-5 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100">Live Storage Unit Matrix</h3>
          </div>

          {/* Standard Toggle (Binary vs Decimal) */}
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                setStandard('binary');
                playClickSound(soundEnabled, 'normal');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                standard === 'binary' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Binary (IEC 1024)
            </button>
            <button
              onClick={() => {
                setStandard('decimal');
                playClickSound(soundEnabled, 'normal');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                standard === 'decimal' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Decimal (SI 1000)
            </button>
          </div>
        </div>

        {/* Input Value & Source Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Data Storage Quantity</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-sm focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Source Unit</label>
            <select
              value={sourceUnit}
              onChange={(e) => setSourceUnit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-sm focus:outline-none focus:border-sky-500"
            >
              {unitsList.map(u => (
                <option key={u.id} value={u.id} className="bg-slate-900">{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Cross Conversion Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {unitsList.map(u => {
            const converted = convertTo(u.id);
            const isSource = u.id === sourceUnit;
            return (
              <div
                key={u.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isSource
                    ? 'bg-sky-500/20 border-sky-400/40 shadow-glow-cyan'
                    : 'bg-white/5 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-0.5">
                  <span className="font-semibold text-slate-300">{u.name}</span>
                  {isSource && <span className="text-[10px] text-sky-300 font-bold uppercase">Source</span>}
                </div>
                <div className="font-mono font-bold text-sm text-sky-300 truncate">
                  {formatPrecision(converted, precision)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Download / Upload Time Estimator */}
      <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-white/20 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Network className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100">Network File Transfer Time Estimator</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">File Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fileSizeVal}
                  onChange={(e) => setFileSizeVal(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-xs"
                />
                <select
                  value={fileSizeUnit}
                  onChange={(e) => setFileSizeUnit(e.target.value)}
                  className="w-24 px-2 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                >
                  <option value="MB" className="bg-slate-900">MB</option>
                  <option value="GB" className="bg-slate-900">GB</option>
                  <option value="TB" className="bg-slate-900">TB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Connection Bandwidth</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={speedVal}
                  onChange={(e) => setSpeedVal(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 font-mono text-xs"
                />
                <select
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value)}
                  className="w-24 px-2 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs"
                >
                  <option value="Mbps" className="bg-slate-900">Mbps</option>
                  <option value="MB/s" className="bg-slate-900">MB/s</option>
                  <option value="Gbps" className="bg-slate-900">Gbps</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleEstimateTransfer}
              className="btn-calc-emerald px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm w-full"
            >
              Calculate Transfer Time
            </button>
          </div>

          <div className="flex items-center justify-center p-4 rounded-2xl bg-black/30 border border-white/10 text-center">
            {transferTime ? (
              <div>
                <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs uppercase text-slate-400 font-semibold">Estimated Duration</span>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                  {transferTime.human}
                </div>
                <p className="text-xs text-slate-500 mt-1">({transferTime.seconds} total seconds)</p>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Enter file size & internet speed to estimate download/upload time.
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorContainer>
  );
}
