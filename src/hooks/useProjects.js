import { supabase } from '../lib/supabase.js';
import { useAuth } from './useAuth.jsx';

export function useProjects() {
  const { user } = useAuth();

  const saveProject = async (projectData) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await supabase.from('projects').insert({
      user_id: user.id,
      ...projectData,
    }).select().single();
    return { data, error };
  };

  const getProjects = async () => {
    if (!user) return { data: [], error: null };
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
  };

  return { saveProject, getProjects, deleteProject };
}
