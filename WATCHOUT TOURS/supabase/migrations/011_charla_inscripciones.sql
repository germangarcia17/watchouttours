-- WatchOut! Sensory Tours — Inscripciones a la charla online
-- «Descubre Nueva Zelanda a través de los sentidos».
-- Ejecutar en el SQL Editor de Supabase.
--
-- Las inscripciones solo se escriben desde la Netlify Function
-- charla-inscripcion (con la clave service_role, que se salta RLS). El
-- público (anon) no puede leer ni escribir esta tabla; el panel de admin
-- (usuario autenticado) solo puede leerla.

create table if not exists charla_inscripciones (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  nombre                  text not null check (char_length(nombre) between 2 and 100),
  email                   text not null check (char_length(email) <= 254),
  sesion                  text not null check (sesion in ('2026-10-24', '2026-11-07')),
  pregunta                text check (char_length(pregunta) <= 1000),
  acepta_noticias         boolean not null default false,
  idioma                  text not null default 'es' check (idioma in ('es', 'en')),
  confirmacion_enviada_at timestamptz,
  recordatorio_24h_at     timestamptz,
  recordatorio_1h_at      timestamptz,
  seguimiento_at          timestamptz,
  -- Una persona (email) puede inscribirse a las dos sesiones, pero solo una
  -- vez a cada una: si repite, se actualizan sus datos y se le reenvía la
  -- confirmación.
  unique (email, sesion)
);

create index if not exists charla_inscripciones_sesion_idx
  on charla_inscripciones (sesion, created_at);

alter table charla_inscripciones enable row level security;

drop policy if exists "Authenticated can read charla inscripciones" on charla_inscripciones;
create policy "Authenticated can read charla inscripciones"
  on charla_inscripciones for select
  to authenticated
  using (true);

-- Sin políticas de insert/update/delete: solo la service_role escribe.
revoke all on charla_inscripciones from anon;
grant select on charla_inscripciones to authenticated;
