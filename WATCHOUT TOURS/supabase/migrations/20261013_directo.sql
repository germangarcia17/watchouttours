-- WatchOut! · Directos online: eventos, inscripciones y lista de novedades
-- Ejecutar una vez en Supabase → SQL Editor.

create extension if not exists pgcrypto;

-- 1. Eventos (una fila por directo). El enlace de Teams vive aquí, nunca en el código público.
create table if not exists public.live_events (
  slug             text primary key,
  title            text not null,
  starts_at        timestamptz not null,
  duration_minutes integer not null default 60,
  teams_url        text not null,
  is_open          boolean not null default true,
  created_at       timestamptz not null default now()
);

-- 2. Inscripciones a cada directo. Un email solo puede inscribirse una vez por directo.
create table if not exists public.live_event_registrations (
  id                     uuid primary key default gen_random_uuid(),
  event_slug             text not null references public.live_events(slug) on delete cascade,
  name                   text not null,
  email                  text not null,
  email_normalized       text not null,
  created_at             timestamptz not null default now(),
  confirmation_status    text not null default 'pending',
  confirmation_sent_at   timestamptz,
  confirmation_attempts  integer not null default 0,
  reminder_24h_status    text not null default 'pending',
  reminder_24h_sent_at   timestamptz,
  reminder_24h_attempts  integer not null default 0,
  reminder_2h_status     text not null default 'pending',
  reminder_2h_sent_at    timestamptz,
  reminder_2h_attempts   integer not null default 0,
  last_error             text,
  constraint live_event_registrations_unique_email unique (event_slug, email_normalized),
  constraint chk_status check (
    confirmation_status in ('pending','sending','sent','failed') and
    reminder_24h_status in ('pending','sending','sent','skipped','failed') and
    reminder_2h_status  in ('pending','sending','sent','skipped','failed')
  )
);

-- 3. Lista de novedades: separada de las inscripciones. Solo entra quien marca la casilla.
create table if not exists public.newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  name             text,
  email            text not null,
  email_normalized text not null unique,
  source           text,
  consent_text     text not null,
  consented_at     timestamptz not null default now(),
  unsubscribed_at  timestamptz
);

-- Seguridad: RLS activado y sin políticas = nadie puede leer ni escribir desde el navegador.
-- Solo las funciones de Netlify, con la service role key (secreta), acceden a estas tablas.
alter table public.live_events              enable row level security;
alter table public.live_event_registrations enable row level security;
alter table public.newsletter_subscribers   enable row level security;

-- 4. Crear el directo. RELLENAR con los datos reales antes de ejecutar este bloque.
--    La hora se escribe en hora de Nueva Zelanda (Pacific/Auckland).
-- insert into public.live_events (slug, title, starts_at, duration_minutes, teams_url)
-- values (
--   'nz-octubre-2026',
--   'Descubre Nueva Zelanda con todos los sentidos',
--   'AAAA-MM-DD HH:MM Pacific/Auckland',
--   60,
--   'PEGAR_AQUI_ENLACE_TEAMS'
-- );
