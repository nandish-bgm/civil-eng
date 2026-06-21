import { CURRENCY_SYMBOLS } from '../data/materials.js';
import MaterialCard from './MaterialCard.jsx';

function fmt(n, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CostSummary({ results, currency, materials, onCopy, onExport }) {
  const materialsCount = Object.values(materials).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{(results.volume || 0).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Volume (m³)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{(results.area || 0).toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Area (m²)</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{materialsCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Materials</p>
        </div>
      </div>

      {/* Material breakdown */}
      {materialsCount > 0 && (
        <div className="space-y-3">
          {materials.concrete && <MaterialCard type="concrete" data={results.concrete} currency={currency} />}
          {materials.steel && <MaterialCard type="steel" data={results.steel} currency={currency} />}
          {materials.bricks && <MaterialCard type="bricks" data={results.bricks} currency={currency} />}
        </div>
      )}

      {/* Grand total */}
      {materialsCount > 0 && (
        <div className="rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-orange-700 to-orange-500 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Grand Total</p>
              <p className="text-white text-3xl font-bold">{fmt(results.total || 0, currency)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onCopy}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                📋 Copy
              </button>
              <button
                onClick={onExport}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                📄 PDF
              </button>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-100 px-6 py-2">
            <p className="text-xs text-orange-700">* Excludes labour &amp; transport costs</p>
          </div>
        </div>
      )}

      {materialsCount === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">Select at least one material to see cost breakdown</p>
        </div>
      )}
    </div>
  );
}
