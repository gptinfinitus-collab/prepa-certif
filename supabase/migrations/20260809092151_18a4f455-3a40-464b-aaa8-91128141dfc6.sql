
create extension if not exists vector with schema extensions;

create table public.library_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  certification_id uuid references public.certifications(id) on delete set null,
  storage_path text not null,
  name text not null,
  kind text not null default 'cours',
  status text not null default 'pending',
  error text,
  chunk_count integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, storage_path)
);

grant select, insert, update, delete on public.library_documents to authenticated;
grant all on public.library_documents to service_role;
alter table public.library_documents enable row level security;
create policy "own documents" on public.library_documents for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.library_documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.document_chunks to authenticated;
grant all on public.document_chunks to service_role;
alter table public.document_chunks enable row level security;
create policy "own chunks" on public.document_chunks for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index document_chunks_document_idx on public.document_chunks(document_id);
create index document_chunks_embedding_idx on public.document_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_count integer default 8
)
returns table (id uuid, document_id uuid, content text, similarity double precision)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select c.id, c.document_id, c.content, 1 - (c.embedding <=> query_embedding) as similarity
  from public.document_chunks c
  where c.embedding is not null
  order by c.embedding <=> query_embedding
  limit match_count
$$;

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  certification_id uuid references public.certifications(id) on delete set null,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.ai_messages to authenticated;
grant all on public.ai_messages to service_role;
alter table public.ai_messages enable row level security;
create policy "own ai messages" on public.ai_messages for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index ai_messages_user_idx on public.ai_messages(user_id, created_at);
