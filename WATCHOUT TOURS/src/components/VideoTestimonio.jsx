import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/routing'
import { pickLocalized, fieldLangAttr } from '../i18n/content'
import { Desplegable } from './Desplegable'

/* ── Testimonio en vídeo, visible y accesible ────────────────────────────
 * Reproductor nativo con controles, sin reproducción automática, con
 * imagen de portada y subtítulos (.vtt) si la reseña los tiene, y la
 * transcripción completa debajo en un desplegable. Portada, subtítulos y
 * transcripción se añaden desde /admin/resenas (columnas video_poster_url,
 * video_vtt_url, video_transcript y video_transcript_en; migración 012).
 * ──────────────────────────────────────────────────────────────────────── */
export function VideoTestimonio({ resena }) {
  const { t } = useTranslation()
  const lang = useLang()
  const transcripcion = pickLocalized(resena, 'video_transcript', lang)
  const parrafos = (transcripcion ?? '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  const nombre = resena.author_name

  return (
    <div className="testi-video testi-video--visible">
      <video
        src={resena.video_url}
        poster={resena.video_poster_url || undefined}
        controls
        playsInline
        preload="metadata"
        // Los subtítulos están en otro dominio (Supabase): hace falta CORS
        crossOrigin={resena.video_vtt_url ? 'anonymous' : undefined}
        aria-label={t('home.testi.videoAria', { name: nombre })}
      >
        {resena.video_vtt_url && (
          <track kind="captions" src={resena.video_vtt_url} srcLang="es" label={t('home.testi.subtitulos')} default />
        )}
      </video>
      {parrafos.length > 0 && (
        <Desplegable
          id={`transcripcion-${resena.id}`}
          className="testi-transcripcion"
          boton={<>{t('home.testi.transcripcion')}<span className="sr-only"> ({nombre})</span></>}
        >
          <div lang={fieldLangAttr(resena, 'video_transcript', lang)}>
            {parrafos.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Desplegable>
      )}
    </div>
  )
}
