import { CURRENCY_SYMBOLS } from '../data/materials.js';

function fmt(n, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MaterialCard({ type, data, currency }) {
  if (!data) return null;

  const configs = {
    concrete: {
      icon: '🪨',
      label: 'Concrete',
      qty: `${data.quantity?.toFixed(3)} m³`,
      unitLabel: 'per m³',
      extra: `${data.cementBags} cement bags needed`,
      color: 'bg-stone-50 border-stone-200',
      badge: 'bg-stone-100 text-stone-700',
    },
    steel: {
      icon: '🔩',
      label: 'Steel Rebar',
      qty: `${data.weight?.toFixed(3)} tons`,
      unitLabel: 'per ton',
      extra: `${(data.reinPct * 100).toFixed(1)}% reinforcement ratio`,
      color: 'bg-slate-50 border-slate-200',
      badge: 'bg-slate-100 text-slate-700',
    },
    bricks: {
      icon: '🧱',
      label: 'Bricks',
      qty: `${data.quantity?.toLocaleString()} bricks`,
      unitLabel: 'per 1000',
      extra: `${data.mortarBags} mortar bags needed`,
      color: 'bg-red-50 border-red-100',
      badge: 'bg-red-100 text-red-700',
    },
  };

  const c = configs[type];
  if (!c) return null;

  const unitPriceDisplay = type === 'bricks'
    ? fmt(data.unitPrice * 1000, currency)
    : fmt(data.unitPrice, currency);

  return (
    <div className={`rounded-xl border p-5 ${c.color}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{c.icon}</span>
          <span className="font-semibold text-gray-800">{c.label}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badge}`}>
          {c.extra}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Quantity (incl. waste)</p>
          <p className="font-medium text-gray-900">{c.qty}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs mb-0.5">Unit Price ({c.unitLabel})</p>
          <p className="font-medium text-gray-900">{unitPriceDisplay}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs mb-0.5">Cost</p>
          <p className="font-bold text-gray-900 text-base">{fmt(data.cost, currency)}</p>
        </div>
      </div>
    </div>
  );
}
