import { useState, useEffect, useCallback } from 'react';

// ─── Unit Definitions ────────────────────────────────────────────────────────
// Each unit has: label, symbol, toBase (converts unit→base), fromBase (base→unit)
// For linear units, toBase/fromBase are plain numbers (multiplication factors)
// Temperature uses functions

const UNIT_CATEGORIES = {
  length: {
    label: 'Length',
    baseSymbol: 'm',
    units: [
      { label: 'Millimetre',  symbol: 'mm',   toBase: 0.001,        fromBase: 1000 },
      { label: 'Centimetre',  symbol: 'cm',   toBase: 0.01,         fromBase: 100 },
      { label: 'Metre',       symbol: 'm',    toBase: 1,            fromBase: 1 },
      { label: 'Kilometre',   symbol: 'km',   toBase: 1000,         fromBase: 0.001 },
      { label: 'Inch',        symbol: 'in',   toBase: 0.0254,       fromBase: 39.37007874 },
      { label: 'Foot',        symbol: 'ft',   toBase: 0.3048,       fromBase: 3.280839895 },
      { label: 'Yard',        symbol: 'yd',   toBase: 0.9144,       fromBase: 1.093613298 },
      { label: 'Mile',        symbol: 'mile', toBase: 1609.344,     fromBase: 0.000621371192 },
    ],
  },
  area: {
    label: 'Area',
    baseSymbol: 'm²',
    units: [
      { label: 'Square Millimetre', symbol: 'mm²',   toBase: 1e-6,           fromBase: 1e6 },
      { label: 'Square Centimetre', symbol: 'cm²',   toBase: 1e-4,           fromBase: 1e4 },
      { label: 'Square Metre',      symbol: 'm²',    toBase: 1,              fromBase: 1 },
      { label: 'Hectare',           symbol: 'ha',    toBase: 10000,          fromBase: 1e-4 },
      { label: 'Square Kilometre',  symbol: 'km²',   toBase: 1e6,            fromBase: 1e-6 },
      { label: 'Square Inch',       symbol: 'in²',   toBase: 6.4516e-4,      fromBase: 1550.0031 },
      { label: 'Square Foot',       symbol: 'ft²',   toBase: 0.09290304,     fromBase: 10.763910417 },
      { label: 'Square Yard',       symbol: 'yd²',   toBase: 0.83612736,     fromBase: 1.19599005 },
      { label: 'Acre',              symbol: 'acre',  toBase: 4046.8564224,   fromBase: 2.47105381e-4 },
    ],
  },
  volume: {
    label: 'Volume',
    baseSymbol: 'm³',
    units: [
      { label: 'Millilitre',        symbol: 'ml',        toBase: 1e-6,           fromBase: 1e6 },
      { label: 'Litre',             symbol: 'L',         toBase: 0.001,          fromBase: 1000 },
      { label: 'Cubic Metre',       symbol: 'm³',        toBase: 1,              fromBase: 1 },
      { label: 'Cubic Centimetre',  symbol: 'cm³',       toBase: 1e-6,           fromBase: 1e6 },
      { label: 'Cubic Inch',        symbol: 'in³',       toBase: 1.6387064e-5,   fromBase: 61023.7440947 },
      { label: 'Cubic Foot',        symbol: 'ft³',       toBase: 0.028316846592, fromBase: 35.314666721 },
      { label: 'Cubic Yard',        symbol: 'yd³',       toBase: 0.764554857984, fromBase: 1.30795062 },
      { label: 'Gallon (US)',        symbol: 'gal (US)',  toBase: 0.003785411784, fromBase: 264.172052358 },
      { label: 'Gallon (UK)',        symbol: 'gal (UK)',  toBase: 0.00454609,     fromBase: 219.96924829 },
    ],
  },
  mass: {
    label: 'Mass',
    baseSymbol: 'kg',
    units: [
      { label: 'Gram',              symbol: 'g',     toBase: 0.001,          fromBase: 1000 },
      { label: 'Kilogram',          symbol: 'kg',    toBase: 1,              fromBase: 1 },
      { label: 'Metric Ton',        symbol: 't',     toBase: 1000,           fromBase: 0.001 },
      { label: 'Pound',             symbol: 'lb',    toBase: 0.45359237,     fromBase: 2.20462262185 },
      { label: 'Kip (1000 lb)',     symbol: 'kip',   toBase: 453.59237,      fromBase: 0.00220462262 },
      { label: 'Short Ton (US)',     symbol: 'ton',   toBase: 907.18474,      fromBase: 0.00110231131 },
      { label: 'Long Ton (UK)',      symbol: 'ton(L)',toBase: 1016.0469088,   fromBase: 0.000984206528 },
    ],
  },
  force: {
    label: 'Force',
    baseSymbol: 'N',
    units: [
      { label: 'Newton',       symbol: 'N',         toBase: 1,              fromBase: 1 },
      { label: 'Kilonewton',   symbol: 'kN',        toBase: 1000,           fromBase: 0.001 },
      { label: 'Meganewton',   symbol: 'MN',        toBase: 1e6,            fromBase: 1e-6 },
      { label: 'Kilogram-force',symbol: 'kgf',      toBase: 9.80665,        fromBase: 0.101971621 },
      { label: 'Tonne-force',  symbol: 'tf',        toBase: 9806.65,        fromBase: 1.01971621e-4 },
      { label: 'Pound-force',  symbol: 'lbf',       toBase: 4.44822162,     fromBase: 0.224808943 },
      { label: 'Kip-force',    symbol: 'kip-f',     toBase: 4448.22162,     fromBase: 2.24808943e-4 },
    ],
  },
  pressure: {
    label: 'Pressure',
    baseSymbol: 'Pa',
    units: [
      { label: 'Pascal',           symbol: 'Pa',       toBase: 1,              fromBase: 1 },
      { label: 'Kilopascal',       symbol: 'kPa',      toBase: 1000,           fromBase: 0.001 },
      { label: 'Megapascal',       symbol: 'MPa',      toBase: 1e6,            fromBase: 1e-6 },
      { label: 'Gigapascal',       symbol: 'GPa',      toBase: 1e9,            fromBase: 1e-9 },
      { label: 'kN/m²',            symbol: 'kN/m²',    toBase: 1000,           fromBase: 0.001 },
      { label: 'N/mm²',            symbol: 'N/mm²',    toBase: 1e6,            fromBase: 1e-6 },
      { label: 'Bar',              symbol: 'bar',      toBase: 100000,         fromBase: 1e-5 },
      { label: 'PSI',              symbol: 'psi',      toBase: 6894.757293,    fromBase: 1.45037738e-4 },
      { label: 'Kip/ft² (ksf)',    symbol: 'ksf',      toBase: 47880.2589,     fromBase: 2.08854342e-5 },
      { label: 'lb/ft² (psf)',     symbol: 'psf',      toBase: 47.8802589,     fromBase: 0.0208854342 },
      { label: 'kgf/cm²',         symbol: 'kgf/cm²',  toBase: 98066.5,        fromBase: 1.01971621e-5 },
      { label: 'Atmosphere',       symbol: 'atm',      toBase: 101325,         fromBase: 9.86923267e-6 },
    ],
  },
  moment: {
    label: 'Moment',
    baseSymbol: 'N·m',
    units: [
      { label: 'Newton·metre',      symbol: 'N·m',    toBase: 1,              fromBase: 1 },
      { label: 'Kilonewton·metre',  symbol: 'kN·m',   toBase: 1000,           fromBase: 0.001 },
      { label: 'Meganewton·metre',  symbol: 'MN·m',   toBase: 1e6,            fromBase: 1e-6 },
      { label: 'kgf·m',            symbol: 'kgf·m',  toBase: 9.80665,        fromBase: 0.101971621 },
      { label: 'lbf·ft',           symbol: 'lbf·ft', toBase: 1.35581795,     fromBase: 0.737562149 },
      { label: 'lbf·in',           symbol: 'lbf·in', toBase: 0.112984829,    fromBase: 8.85074579 },
      { label: 'kip·ft',           symbol: 'kip·ft', toBase: 1355.81795,     fromBase: 7.37562149e-4 },
      { label: 'kip·in',           symbol: 'kip·in', toBase: 112.984829,     fromBase: 0.00885074579 },
    ],
  },
  linearLoad: {
    label: 'Load (Linear)',
    baseSymbol: 'N/m',
    units: [
      { label: 'N/m',      symbol: 'N/m',    toBase: 1,              fromBase: 1 },
      { label: 'kN/m',     symbol: 'kN/m',   toBase: 1000,           fromBase: 0.001 },
      { label: 'lbf/ft',   symbol: 'lbf/ft', toBase: 14.5939029,     fromBase: 0.0685217659 },
      { label: 'kip/ft',   symbol: 'kip/ft', toBase: 14593.9029,     fromBase: 6.85217659e-5 },
    ],
  },
  density: {
    label: 'Unit Weight',
    baseSymbol: 'kg/m³',
    units: [
      { label: 'kg/m³',    symbol: 'kg/m³',  toBase: 1,              fromBase: 1 },
      { label: 'kN/m³',    symbol: 'kN/m³',  toBase: 101.971621,     fromBase: 0.00980665 },
      { label: 'lb/ft³',   symbol: 'lb/ft³', toBase: 16.0184634,     fromBase: 0.0624279606 },
      { label: 'pcf',      symbol: 'pcf',    toBase: 16.0184634,     fromBase: 0.0624279606 },
    ],
  },
  velocity: {
    label: 'Velocity',
    baseSymbol: 'm/s',
    units: [
      { label: 'Metre/second',    symbol: 'm/s',  toBase: 1,              fromBase: 1 },
      { label: 'Kilometre/hour',  symbol: 'km/h', toBase: 0.277777778,    fromBase: 3.6 },
      { label: 'Foot/second',     symbol: 'ft/s', toBase: 0.3048,         fromBase: 3.280839895 },
      { label: 'Mile/hour',       symbol: 'mph',  toBase: 0.44704,        fromBase: 2.23693629 },
    ],
  },
  flowRate: {
    label: 'Flow Rate',
    baseSymbol: 'm³/s',
    units: [
      { label: 'Litre/second',   symbol: 'L/s',   toBase: 0.001,          fromBase: 1000 },
      { label: 'Cubic metre/s',  symbol: 'm³/s',  toBase: 1,              fromBase: 1 },
      { label: 'Cubic metre/hr', symbol: 'm³/hr', toBase: 2.77777778e-4,  fromBase: 3600 },
      { label: 'Cubic ft/s (cfs)',symbol: 'cfs',  toBase: 0.028316846592, fromBase: 35.314666721 },
      { label: 'Gallon/min (gpm)',symbol: 'gpm',  toBase: 6.30901964e-5,  fromBase: 15850.3231 },
    ],
  },
  temperature: {
    label: 'Temperature',
    baseSymbol: '°C',
    units: [
      {
        label: 'Celsius', symbol: '°C',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        label: 'Fahrenheit', symbol: '°F',
        toBase: (v) => (v - 32) * 5 / 9,
        fromBase: (v) => v * 9 / 5 + 32,
      },
      {
        label: 'Kelvin', symbol: 'K',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyFactor(value, factor) {
  return typeof factor === 'function' ? factor(value) : value * factor;
}

function convert(value, fromUnit, toUnit) {
  const baseValue = applyFactor(value, fromUnit.toBase);
  return applyFactor(baseValue, toUnit.fromBase);
}

function formatResult(num) {
  if (!isFinite(num)) return '';
  // Use toPrecision for 8 sig figs then strip trailing zeros
  const str = parseFloat(num.toPrecision(8)).toString();
  // Avoid scientific notation for very small/large: use exponential only if needed
  if (Math.abs(num) < 1e-7 && num !== 0) return num.toExponential(7).replace(/\.?0+e/, 'e');
  if (Math.abs(num) >= 1e15) return num.toExponential(7).replace(/\.?0+e/, 'e');
  return str;
}

function getBaseEquivalent(unit) {
  if (typeof unit.toBase === 'function') return null; // temperature — skip
  return unit.toBase;
}

// ─── Component ───────────────────────────────────────────────────────────────

const CATEGORY_KEYS = Object.keys(UNIT_CATEGORIES);

export default function UnitConverter() {
  const [activeCat, setActiveCat] = useState('length');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [lastEdited, setLastEdited] = useState('from');

  const category = UNIT_CATEGORIES[activeCat];
  const units = category.units;
  const fromUnit = units[fromIdx];
  const toUnit = units[toIdx];

  // Recalculate whenever inputs or units change
  useEffect(() => {
    if (lastEdited === 'from') {
      const num = parseFloat(fromValue);
      if (fromValue === '' || fromValue === '-') { setToValue(''); return; }
      if (isNaN(num)) { setToValue(''); return; }
      setToValue(formatResult(convert(num, fromUnit, toUnit)));
    } else {
      const num = parseFloat(toValue);
      if (toValue === '' || toValue === '-') { setFromValue(''); return; }
      if (isNaN(num)) { setFromValue(''); return; }
      setFromValue(formatResult(convert(num, toUnit, fromUnit)));
    }
  }, [fromValue, toValue, fromIdx, toIdx, activeCat, lastEdited]); // eslint-disable-line

  const handleCategoryChange = (cat) => {
    setActiveCat(cat);
    setFromIdx(0);
    setToIdx(1);
    setFromValue('1');
    setToValue('');
    setLastEdited('from');
  };

  const handleSwap = () => {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
    // flip values
    setFromValue(toValue);
    setToValue(fromValue);
    setLastEdited('from');
  };

  const handleFromChange = (e) => {
    setLastEdited('from');
    setFromValue(e.target.value);
  };

  const handleToChange = (e) => {
    setLastEdited('to');
    setToValue(e.target.value);
  };

  // Conversion formula line
  const formulaLine = (() => {
    if (typeof fromUnit.toBase === 'function') {
      // Temperature — show two examples
      const ex = convert(0, fromUnit, toUnit);
      return `0 ${fromUnit.symbol} = ${formatResult(ex)} ${toUnit.symbol}`;
    }
    const result = convert(1, fromUnit, toUnit);
    return `1 ${fromUnit.symbol} = ${formatResult(result)} ${toUnit.symbol}`;
  })();

  const inputCls =
    'w-full text-3xl font-light border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white';
  const selectCls =
    'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unit Converter</h1>
        <p className="text-sm text-gray-500 mt-1">Civil &amp; Structural Engineering Units</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORY_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCat === key
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {UNIT_CATEGORIES[key].label}
          </button>
        ))}
      </div>

      {/* Converter Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          {/* FROM */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">From</label>
            <select
              value={fromIdx}
              onChange={(e) => { setFromIdx(Number(e.target.value)); setLastEdited('from'); }}
              className={selectCls}
            >
              {units.map((u, i) => (
                <option key={u.symbol + i} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={handleFromChange}
              placeholder="0"
              className={inputCls}
            />
          </div>

          {/* Swap Button */}
          <div className="flex sm:flex-col items-center justify-center pb-1">
            <button
              onClick={handleSwap}
              title="Swap units"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-colors text-lg"
            >
              ⇄
            </button>
          </div>

          {/* TO */}
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">To</label>
            <select
              value={toIdx}
              onChange={(e) => { setToIdx(Number(e.target.value)); setLastEdited('from'); }}
              className={selectCls}
            >
              {units.map((u, i) => (
                <option key={u.symbol + i} value={i}>{u.label} ({u.symbol})</option>
              ))}
            </select>
            <input
              type="number"
              value={toValue}
              onChange={handleToChange}
              placeholder="0"
              className={inputCls}
            />
          </div>
        </div>

        {/* Formula line */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
          {formulaLine}
        </div>
      </div>

      {/* Reference Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Reference — {category.label} Units (relative to {category.baseSymbol})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2.5 font-semibold text-gray-600">Unit Name</th>
                <th className="px-4 py-2.5 font-semibold text-gray-600">Symbol</th>
                <th className="px-4 py-2.5 font-semibold text-gray-600">
                  Value in {category.baseSymbol}
                </th>
              </tr>
            </thead>
            <tbody>
              {units.map((u, i) => {
                const isActive = i === fromIdx;
                const base = getBaseEquivalent(u);
                return (
                  <tr
                    key={u.symbol + i}
                    className={`border-t border-gray-100 ${
                      isActive
                        ? 'bg-orange-50 border-l-2 border-l-orange-500'
                        : i % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                    }`}
                  >
                    <td className={`px-4 py-2.5 ${isActive ? 'font-semibold text-orange-700' : 'text-gray-700'}`}>
                      {u.label}
                    </td>
                    <td className={`px-4 py-2.5 font-mono ${isActive ? 'text-orange-700' : 'text-gray-600'}`}>
                      {u.symbol}
                    </td>
                    <td className={`px-4 py-2.5 font-mono ${isActive ? 'text-orange-700' : 'text-gray-500'}`}>
                      {base !== null
                        ? `1 ${u.symbol} = ${formatResult(base)} ${category.baseSymbol}`
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
