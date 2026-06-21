import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { calcAll } from '../utils/calculations.js';
import { exportToPDF } from '../utils/pdfExport.js';
import { CURRENCY_SYMBOLS, PROJECT_TYPES, GRADES, CURRENCIES } from '../data/materials.js';
import CostSummary from './CostSummary.jsx';

const DEFAULT_STATE = {
  projectName: 'My Project',
  projectType: 'slab',
  length: '',
  width: '',
  thickness: '',
  grade: 'medium',
  currency: 'USD',
  materials: { concrete: true, steel: true, bricks: false },
};

export default function Calculator({ initialState, onStateChange }) {
  const { user } = useAuth();
  const { saveProject } = useProjects();
  const [state, setState] = useState(initialState || DEFAULT_STATE);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    if (initialState) setState(initialState);
  }, [initialState]);

  useEffect(() => {
    onStateChange?.(state);
  }, [state]);

  const results = useMemo(() => calcAll(state), [state]);

  const set = (key, val) => setState((s) => ({ ...s, [key]: val }));
  const setMat = (key, val) => setState((s) => ({ ...s, materials: { ...s.materials, [key]: val } }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCopy = () => {
    const sym = CURRENCY_SYMBOLS[state.currency] || state.currency;
    const f = (n) => `${sym}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    let text = `BuildCalc Estimate — ${state.projectName}\n`;
    text += `Type: ${state.projectType} | Grade: ${state.grade} | Currency: ${state.currency}\n`;
    text += `Dimensions: ${state.length}m × ${state.width}m × ${state.thickness}m\n`;
    text += `Volume: ${results.volume?.toFixed(3)} m³ | Area: ${results.area?.toFixed(2)} m²\n\n`;
    if (results.concrete) text += `Concrete: ${results.concrete.quantity.toFixed(3)} m³ — ${f(results.concrete.cost)}\n`;
    if (results.steel) text += `Steel: ${results.steel.weight.toFixed(3)} t — ${f(results.steel.cost)}\n`;
    if (results.bricks) text += `Bricks: ${results.bricks.quantity.toLocaleString()} — ${f(results.bricks.cost)}\n`;
    text += `\nGrand Total: ${f(results.total || 0)}\n* Excludes labour & transport`;
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
  };

  const handleExport = () => {
    exportToPDF({
      projectName: state.projectName,
      projectType: state.projectType,
      dimensions: { length: state.length, width: state.width, thickness: state.thickness },
      grade: state.grade,
      currency: state.currency,
      materials: state.materials,
      results,
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await saveProject({
      name: saveName || state.projectName,
      project_type: state.projectType,
      dimensions: { length: state.length, width: state.width, thickness: state.thickness },
      grade: state.grade,
      currency: state.currency,
      materials: state.materials,
      results,
    });
    setSaving(false);
    setShowNamePrompt(false);
    if (error) showToast('Error saving project');
    else showToast('Project saved!');
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white';

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Save name prompt */}
      {showNamePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Save Project</h3>
            <input
              autoFocus
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={state.projectName}
              className={inputCls + ' mb-4'}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowNamePrompt(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-5">
          {/* Project name */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              value={state.projectName}
              onChange={(e) => set('projectName', e.target.value)}
              className={inputCls}
              placeholder="My Project"
            />
          </div>

          {/* Project type */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => set('projectType', pt.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    state.projectType === pt.value
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensions (metres)</h3>
            <div className="grid grid-cols-3 gap-3">
              {[['length', 'Length'], ['width', 'Width'], ['thickness', 'Thickness']].map(([k, label]) => (
                <div key={k}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={state[k]}
                    onChange={(e) => set(k, e.target.value)}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Grade */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality Grade</label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => set('grade', g)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    state.grade === g
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <div className="grid grid-cols-3 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => set('currency', c)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    state.currency === c
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Materials</h3>
            <div className="space-y-3">
              {[
                { key: 'concrete', label: 'Concrete', icon: '🪨', desc: 'Ready-mix concrete' },
                { key: 'steel', label: 'Steel Rebar', icon: '🔩', desc: 'Reinforcement bars' },
                { key: 'bricks', label: 'Bricks', icon: '🧱', desc: 'Clay / cement bricks' },
              ].map(({ key, label, icon, desc }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    state.materials[key]
                      ? 'bg-orange-50 border-orange-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={state.materials[key]}
                    onChange={(e) => setMat(key, e.target.checked)}
                    className="accent-orange-600 w-4 h-4"
                  />
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Save button */}
          {user && (
            <button
              onClick={() => { setSaveName(state.projectName); setShowNamePrompt(true); }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl transition-colors text-sm"
            >
              💾 Save Project
            </button>
          )}
        </div>

        {/* Results panel */}
        <div>
          <CostSummary
            results={results}
            currency={state.currency}
            materials={state.materials}
            onCopy={handleCopy}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  );
}
