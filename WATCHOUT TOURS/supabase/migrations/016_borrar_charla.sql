-- WatchOut Tours — Se retira la charla online y el directo
--
-- La charla (24 de octubre y 7 de noviembre de 2026) ya se celebró y sus
-- páginas redirigen a la home. Se borran sus tablas: las inscripciones y
-- los suscriptores estaban vacíos; solo quedaba la ficha del evento.

drop table if exists public.charla_inscripciones;
drop table if exists public.live_event_registrations;
drop table if exists public.live_events;
drop table if exists public.newsletter_subscribers;
