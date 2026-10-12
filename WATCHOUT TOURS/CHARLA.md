# Charla online «Descubre Nueva Zelanda a través de los sentidos»

Página: `/charla-nueva-zelanda` (español) y `/en/charla-nueva-zelanda` (inglés).
La charla es en español en las dos versiones.

## Cómo funciona

| Parte | Dónde |
|---|---|
| Fechas, horas, duración, contacto, interruptor de grabación | `src/config/charla.js` (lo usan la web y los emails) |
| Página pública | `src/pages/CharlaNuevaZelanda.jsx`, textos en `src/i18n/locales/{es,en}.json` → `charla` |
| Inscripción: guarda en Supabase y envía la confirmación (.ics adjunto) | `netlify/functions/charla-inscripcion.js` |
| Recordatorios 24 h y 1 h antes y email de seguimiento (cada 10 min) | `netlify/functions/charla-envios.js` (programada en `netlify.toml`) |
| Textos de los emails (ES/EN) | `netlify/lib/charla/emails.js` |
| Tabla de inscripciones | `supabase/migrations/011_charla_inscripciones.sql` |
| Listado y CSV de inscritos | Panel `/admin/charla` |

La página solo muestra la confirmación cuando la inscripción se ha guardado **y**
el email se ha enviado. Los recordatorios y el seguimiento se envían solo a
los inscritos de cada sesión cuya confirmación salió bien, y cada envío queda
marcado para no repetirse.

## Puesta en marcha (en este orden)

1. **Supabase** → SQL Editor: ejecutar `supabase/migrations/011_charla_inscripciones.sql`.
2. **Resend**: verificar el dominio del remitente (por defecto `info@watchouttours.nz`,
   dominio `watchouttours.nz`) añadiendo sus registros DNS.
3. **Netlify** → Site configuration → Environment variables:

   | Variable | Valor |
   |---|---|
   | `SUPABASE_URL` | URL del proyecto (si no, se usa `VITE_SUPABASE_URL`) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` (secreta) |
   | `RESEND_API_KEY` | Clave de la API de Resend |
   | `CHARLA_EMAIL_FROM` | Opcional. Remitente, p. ej. `WatchOut! Sensory Tours <info@watchouttours.nz>` |
   | `CONTACT_EMAIL` | Opcional. Buzón que recibe un aviso por cada inscripción (con la pregunta) |
   | `CHARLA_TEAMS_URL_2026_10_24` | Enlace de Teams de la sesión del 24 de octubre |
   | `CHARLA_TEAMS_URL_2026_11_07` | Enlace de Teams de la sesión del 7 de noviembre |
   | `CHARLA_URL_RESERVA_LLAMADA` | Opcional. Enlace para reservar la llamada de 15 min (Calendly, Bookings…). Sin él, el seguimiento invita a responder o escribir por WhatsApp |
   | `VITE_CHARLA_PUBLICADA` | `true` **solo cuando todo lo anterior esté listo** |

   Los enlaces de Teams no van en el código: así solo los reciben las personas inscritas.
   Sin el enlace de una sesión, esa sesión no admite inscripciones ni envía recordatorios.
4. Lanzar un nuevo deploy. Con `VITE_CHARLA_PUBLICADA=true` aparecen la página,
   su entrada en el sitemap, el aviso de la portada y el apartado de la charla
   en la política de privacidad.
5. Hacer una inscripción real de prueba con un email propio en cada fecha y
   comprobar que llega la confirmación.

## Grabación

En `src/config/charla.js`, `GRABACION_ACTIVADA = true` (y deploy) activa el aviso
en la página, en los emails y en la política de privacidad. El seguimiento de
cada sesión espera hasta que exista `CHARLA_GRABACION_URL_2026_10_24` /
`CHARLA_GRABACION_URL_2026_11_07` (hasta 7 días después de la charla).

## Envíos programados

- Recordatorio 24 h antes (a quien se inscribió antes de ese momento).
- Recordatorio 1 h antes.
- Seguimiento: día siguiente a las 9:00, hora de España peninsular.

Se pueden ver en Netlify → Logs → Functions → `charla-envios`.

## Revisar o enviar los emails a mano

```
npm run charla:emails
```

genera en `charla-emails/` todos los emails (por sesión e idioma) en HTML y
texto. Si algún envío automático fallara, el panel `/admin/charla` permite
descargar el CSV de inscritos de cada sesión para enviarlo desde vuestro correo.

## Tests

```
npm test
```
