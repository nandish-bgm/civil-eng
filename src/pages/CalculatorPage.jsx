import { useLocation } from 'react-router-dom';
import Calculator from '../components/Calculator.jsx';

export default function CalculatorPage() {
  const location = useLocation();
  const loadedProject = location.state?.loadedProject;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Material Cost Calculator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter dimensions and select materials to see live cost estimates.
        </p>
      </div>
      <Calculator initialState={loadedProject} />
    </div>
  );
}
