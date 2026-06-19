-- Casinao.cz rating voting schema (prepare now, wire later)

create table if not exists public.page_votes (
  id bigint generated always as identity primary key,
  page text not null,
  rating smallint not null check (rating between 1 and 5),
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_page_votes_page_created_at
  on public.page_votes (page, created_at desc);

-- Optional daily anti-spam helper index
create index if not exists idx_page_votes_ip_hash_created_at
  on public.page_votes (ip_hash, created_at desc);

-- Summary helper view
create or replace view public.page_vote_summary as
select
  page,
  round(avg(rating)::numeric, 2) as avg,
  count(*)::int as count
from public.page_votes
group by page;

-- Row Level Security
alter table public.page_votes enable row level security;

-- Public read summary data
create policy if not exists "Public can read vote summary via table"
  on public.page_votes
  for select
  using (true);

-- Write policy can stay strict; recommended write through Edge Function (service role).
-- If you want direct browser writes (less secure), uncomment:
-- create policy "Public can insert votes"
--   on public.page_votes
--   for insert
--   with check (rating between 1 and 5 and char_length(page) > 0);
