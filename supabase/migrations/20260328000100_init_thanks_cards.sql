create extension if not exists pgcrypto;

create table if not exists public.thanks_cards (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  title varchar(50) not null,
  photo_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_thanks_cards_created_at
  on public.thanks_cards (created_at desc);

alter table public.thanks_cards enable row level security;

drop policy if exists "Anyone can view thanks cards" on public.thanks_cards;
create policy "Anyone can view thanks cards"
  on public.thanks_cards
  for select
  using (true);

drop policy if exists "Anyone can create thanks cards" on public.thanks_cards;
create policy "Anyone can create thanks cards"
  on public.thanks_cards
  for insert
  with check (true);

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Anyone can upload photos" on storage.objects;
create policy "Anyone can upload photos"
  on storage.objects
  for insert
  with check (bucket_id = 'photos');

drop policy if exists "Anyone can view photos" on storage.objects;
create policy "Anyone can view photos"
  on storage.objects
  for select
  using (bucket_id = 'photos');
