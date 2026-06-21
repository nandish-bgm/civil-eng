import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { CURRENCY_SYMBOLS } from '../data/materials.js';

function fmt(cost, currency) {
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  return `${sym}${(cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getProjects, deleteProject } = useProjects();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/calculator');
      return;
    }
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data } = await getProjects();
    setProjects(data || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    setProjects((p) => p.filter((x) => x.id !== id));
    showToast('Project deleted');
  };

  const handleLoad = (project) => {
    const state = {
      projectName: project.name,
      projectType: project.project_type,
      length: project.dimensions?.length || '',
      width: project.dimensions?.width || '',
      thickness: project.dimensions?.thickness || '',
      grade: project.grade,
      currency: project.currency,
      materials: project.materials,
    };
    navigate('/calculator', { state: { loadedProject: state } });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Projects</h1>
          <p className="text-sm text-gray-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📂</div>
          <p className="text-gray-500 mb-4">No saved projects yet.</p>
          <button
            onClick={() => navigate('/calculator')}
            className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Create your first estimate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => handleLoad(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 truncate pr-2">{project.name}</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full capitalize whitespace-nowrap">
                    {project.project_type}
                  </span>
                </div>

                <p className="text-2xl font-bold text-orange-600 mb-3">
                  {fmt(project.results?.total, project.currency)}
                </p>

                <div className="text-xs text-gray-500 space-y-0.5">
                  {project.dimensions && (
                    <p>
                      {project.dimensions.length}m × {project.dimensions.width}m × {project.dimensions.thickness}m
                    </p>
                  )}
                  <p className="capitalize">Grade: {project.grade}</p>
                  <p>{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => handleLoad(project)}
                  className="text-sm text-orange-600 font-medium hover:text-orange-700"
                >
                  Load →
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
