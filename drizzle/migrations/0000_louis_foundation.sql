create extension if not exists vector with schema extensions;

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path=public as $$
begin new.updated_at = now(); return new; end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Writer style profile (versioned)
create table public.writer_profile_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  version int not null,
  profile jsonb not null default '{}'::jsonb,
  change_note text,
  source text,
  created_at timestamptz not null default now(),
  unique(user_id, version)
);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  synopsis text,
  genre text,
  themes text[] not null default '{}',
  narrative_perspective text,
  status text not null default 'drafting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  position int not null default 0,
  title text not null,
  content text not null default '',
  summary text,
  word_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger chapters_touch before update on public.chapters for each row execute function public.touch_updated_at();

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null default 'New conversation',
  mode text not null default 'partner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger conversations_touch before update on public.conversations for each row execute function public.touch_updated_at();

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null,
  parts jsonb not null default '[]'::jsonb,
  content text not null default '',
  saved boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.messages(conversation_id, created_at);
create index messages_search on public.messages using gin (to_tsvector('english', content));

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid references public.projects(id) on delete cascade,
  layer text not null default 'writer',
  category text,
  content text not null,
  source_type text,
  source_ref uuid,
  source_excerpt text,
  version int not null default 1,
  supersedes uuid references public.memories(id) on delete set null,
  is_active boolean not null default true,
  embedding extensions.vector(768),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger memories_touch before update on public.memories for each row execute function public.touch_updated_at();

create table public.bible_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null,
  name text not null,
  details jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger bible_touch before update on public.bible_entries for each row execute function public.touch_updated_at();

create table public.continuity_issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete cascade,
  issue_type text not null,
  description text not null,
  evidence text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table public.edit_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid references public.projects(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  mode int not null,
  original_text text not null,
  analysis text,
  created_at timestamptz not null default now()
);

create table public.edit_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  session_id uuid not null references public.edit_sessions(id) on delete cascade,
  original text not null,
  suggestion text not null,
  rationale text,
  significance text not null default 'minor',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.research_briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  project_id uuid references public.projects(id) on delete set null,
  question text not null,
  category text,
  brief text,
  created_at timestamptz not null default now()
);

create table public.research_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  brief_id uuid not null references public.research_briefs(id) on delete cascade,
  title text not null,
  authors text,
  venue text,
  year int,
  url text,
  doi text,
  provider text,
  verified boolean not null default false,
  abstract text,
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['writer_profile_versions','projects','chapters','conversations','messages','memories','bible_entries','continuity_issues','edit_sessions','edit_suggestions','research_briefs','research_sources'] loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "owner access" on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t);
    execute format('create index on public.%I(user_id)', t);
  end loop;
end $$;