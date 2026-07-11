import DOMPurify from 'dompurify'

/* Asegura que los vídeos y audios insertados en los artículos sean
   reproducibles aunque el autor solo pegue <video src="…">:
   añade los controles y una carga ligera de metadatos. */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
    node.setAttribute('controls', '')
    if (!node.hasAttribute('preload')) node.setAttribute('preload', 'metadata')
    node.setAttribute('playsinline', '')
  }
})

/* Limpia HTML de la base de datos antes de renderizarlo (evita XSS). */
export function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(dirty ?? '', {
    ADD_TAGS: ['video', 'audio', 'source', 'track'],
    ADD_ATTR: ['controls', 'controlslist', 'poster', 'preload', 'playsinline', 'muted', 'loop', 'type', 'src'],
  })
}
