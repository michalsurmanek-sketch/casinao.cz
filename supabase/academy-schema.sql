-- Casino Akademie CMS schema (Supabase)

create extension if not exists pgcrypto;

create table if not exists public.cms_admins (
  email text primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.academy_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  url text not null,
  image text not null default 'img/vyhledavani.png',
  category text not null,
  level text not null default 'Začátečník',
  tags text[] not null default '{}',
  reading_time integer not null default 5 check (reading_time > 0),
  views integer not null default 0 check (views >= 0),
  featured boolean not null default false,
  published boolean not null default true,
  updated_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists idx_academy_articles_published_updated
  on public.academy_articles (published, updated_at desc);

create index if not exists idx_academy_articles_slug
  on public.academy_articles (slug);

alter table public.academy_articles enable row level security;
alter table public.cms_admins enable row level security;

-- Public can read only published articles (for navody.html)
drop policy if exists "Public read published academy articles" on public.academy_articles;
create policy "Public read published academy articles"
  on public.academy_articles
  for select
  using (published = true);

-- Admins can read all rows
drop policy if exists "CMS admins read all academy articles" on public.academy_articles;
create policy "CMS admins read all academy articles"
  on public.academy_articles
  for select
  using (
    exists (
      select 1
      from public.cms_admins ca
      where ca.email = auth.email()
    )
  );

-- Admins can insert/update/delete
drop policy if exists "CMS admins insert academy articles" on public.academy_articles;
create policy "CMS admins insert academy articles"
  on public.academy_articles
  for insert
  with check (
    exists (
      select 1
      from public.cms_admins ca
      where ca.email = auth.email()
    )
  );

drop policy if exists "CMS admins update academy articles" on public.academy_articles;
create policy "CMS admins update academy articles"
  on public.academy_articles
  for update
  using (
    exists (
      select 1
      from public.cms_admins ca
      where ca.email = auth.email()
    )
  )
  with check (
    exists (
      select 1
      from public.cms_admins ca
      where ca.email = auth.email()
    )
  );

drop policy if exists "CMS admins delete academy articles" on public.academy_articles;
create policy "CMS admins delete academy articles"
  on public.academy_articles
  for delete
  using (
    exists (
      select 1
      from public.cms_admins ca
      where ca.email = auth.email()
    )
  );

-- Allow authenticated users to read only their own admin row.
-- This is required so academy_articles RLS checks can verify admin membership.
drop policy if exists "Read own cms_admin row" on public.cms_admins;
create policy "Read own cms_admin row"
  on public.cms_admins
  for select
  using (email = auth.email());

-- Block direct client-side writes to cms_admins table.
drop policy if exists "No direct insert to cms_admins" on public.cms_admins;
create policy "No direct insert to cms_admins"
  on public.cms_admins
  for insert
  with check (false);

drop policy if exists "No direct update to cms_admins" on public.cms_admins;
create policy "No direct update to cms_admins"
  on public.cms_admins
  for update
  using (false)
  with check (false);

drop policy if exists "No direct delete from cms_admins" on public.cms_admins;
create policy "No direct delete from cms_admins"
  on public.cms_admins
  for delete
  using (false);

-- Seed minimal articles matching current navody structure
insert into public.academy_articles (slug, title, description, url, image, category, level, tags, reading_time, views, featured, published, updated_at)
values
  ('jak-zacit-hrat-v-online-casinu', 'Jak začít hrát v online casinu', 'Registrace, ověření identity, první vklad a aktivace bonusu krok za krokem.', 'navody/jak-zacit-hrat-v-online-casinu.html', 'img/1.png', 'Začátečníci', 'Začátečník', array['Registrace','Bonusy','Začátečník'], 6, 14680, true, true, '2026-06-19'),
  ('jak-vybrat-vyhru-z-casina', 'Jak vybrat výhru z online casina', 'KYC ověření, čas zpracování a nejčastější důvody zdržení výplaty.', 'navody/jak-vybrat-vyhru-z-casina.html', 'img/2.png', 'Vklady a výběry', 'Začátečník', array['Platby','KYC','Výběr'], 7, 11320, true, true, '2026-06-19'),
  ('jak-funguji-free-spiny', 'Jak fungují free spiny', 'Kdy jsou free spiny opravdu výhodné a jak správně číst podmínky protočení.', 'navody/jak-funguji-free-spiny.html', 'img/3.png', 'Bonusy', 'Začátečník', array['Free Spiny','Bonus bez vkladu','Automaty'], 5, 12590, true, true, '2026-06-19'),
  ('jak-poznat-legalni-casino-v-cr', 'Jak poznat legální online casino v ČR', 'Licence MFČR, podmínky provozovatele a bezpečnostní signály, které je dobré zkontrolovat.', 'navody/jak-poznat-legalni-casino-v-cr.html', 'img/vyhledavani.png', 'Legislativa', 'Začátečník', array['Licence','Bezpečnost','Legislativa'], 8, 10910, true, true, '2026-06-19'),
  ('jak-funguje-rtp-automatu', 'Jak funguje RTP automatů', 'RTP v praxi: co přesně znamená návratnost a proč nejde o garanci výhry.', 'navody/jak-funguje-rtp-automatu.html', 'img/automaty1.png', 'Casino hry', 'Pokročilý', array['RTP','Automaty','Strategie'], 6, 9720, false, true, '2026-06-19'),
  ('nejcastejsi-chyby-hracu-v-online-casinu', 'Nejčastější chyby hráčů v online casinu', 'Na kterých chybách hráči nejčastěji ztrácejí bonus i bankroll.', 'navody/nejcastejsi-chyby-hracu-v-online-casinu.html', 'img/sazky1.png', 'Bezpečnost', 'Začátečník', array['Bezpečnost','Strategie','Bonusy'], 9, 11840, false, true, '2026-06-19')
on conflict (slug) do nothing;
