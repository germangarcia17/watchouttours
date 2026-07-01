-- WatchOut! Sensory Tours — Supabase initial migration
-- Run this in the Supabase SQL Editor

-- ─── BLOG POSTS ─────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text not null,
  content          text not null,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  reading_time     integer,
  meta_title       text,
  meta_description text,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table blog_posts enable row level security;

-- Public can read published posts
create policy "Public can read published posts"
  on blog_posts for select
  using (status = 'published' and published_at <= now());

-- Authenticated users can do everything
create policy "Authenticated users can manage posts"
  on blog_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── RESEÑAS ────────────────────────────────────────────────────────────────
create table if not exists resenas (
  id             uuid primary key default gen_random_uuid(),
  author_name    text not null,
  author_context text,
  content        text not null,
  published      boolean not null default false,
  featured       boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table resenas enable row level security;

create policy "Public can read published resenas"
  on resenas for select
  using (published = true);

create policy "Authenticated users can manage resenas"
  on resenas for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── SITE IMAGES ────────────────────────────────────────────────────────────
create table if not exists site_images (
  id        uuid primary key default gen_random_uuid(),
  section   text not null,
  key       text not null,
  src       text,
  image_alt text,
  unique (section, key)
);

alter table site_images enable row level security;

create policy "Public can read site images"
  on site_images for select
  using (true);

create policy "Authenticated users can manage site images"
  on site_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ─── CONTACT SUBMISSIONS ────────────────────────────────────────────────────
create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  email      text not null,
  telefono   text,
  mensaje    text not null,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;

-- Anyone can insert (contact form)
create policy "Anyone can submit contact form"
  on contact_submissions for insert
  with check (true);

-- Only authenticated users can read submissions
create policy "Authenticated users can read submissions"
  on contact_submissions for select
  using (auth.role() = 'authenticated');

-- ─── AUTO-UPDATE updated_at ─────────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function handle_updated_at();
