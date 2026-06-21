/*
  Supabase SQL — run this in your Supabase SQL editor:

  create table projects (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    project_type text,
    dimensions jsonb,
    grade text,
    currency text,
    materials jsonb,
    results jsonb,
    created_at timestamptz default now()
  );
  alter table projects enable row level security;
  create policy "Users can only access their own projects"
    on projects for all
    using (auth.uid() = user_id);
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
