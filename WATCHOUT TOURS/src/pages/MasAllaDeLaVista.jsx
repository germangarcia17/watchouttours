import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { variantes } from '../components/ImagenHueco'
import { CREDITOS_VISTA } from '../lib/creditos'
import { ResenasDestacadas, AudioClips } from '../components/home/BloquesHome'
import { Texto, Etiqueta, FotoHueco, dos } from '../components/editorial/Editorial'
import { Portada, Columnas, ProximaSalidaGrupo, CierreFormulario } from '../components/editorial/Colecciones'
import ciegos600 from '../images/home/viaje-ciegos-600.webp'
import ciegos1200 from '../images/home/viaje-ciegos-1200.webp'
import imgHaka from '../images/haka-cultura-maori.jpg'
import videoParapente from '../images/parapente-teaser.mp4'
import imgParapentePoster from '../images/parapente-poster.jpg'

/* Huecos de imagen (sección "mas-alla-de-la-vista" en /admin/imagenes) y su
   foto por defecto. Todas son propias, sin crédito. Texto alternativo por
   defecto en masAlla.huecos.<clave>. */
const IMG = {
  'vista-portada': variantes([{ src: ciegos600, w: 600, h: 800 }, { src: ciegos1200, w: 1200, h: 1600 }]),
  cultura: variantes([{ src: imgHaka, w: 1129, h: 2000 }]),
}

function useFoto(clave) {
  const { t } = useTranslation()
  return {
    seccion: 'mas-alla-de-la-vista', clave, defecto: IMG[clave],
    alt: t(`masAlla.huecos.${clave}`), credito: CREDITOS_VISTA[clave] ?? '',
  }
}

/* ── 2. Manifiesto ───────────────────────────────────────────────────── */
function Manifiesto() {
  const { t } = useTranslation()
  return (
    <section className="hn-sec hn-col-manifiesto" aria-labelledby="ma-manifiesto-titulo">
      <Etiqueta>{t('masAlla.manifiesto.etiqueta')}</Etiqueta>
      <h2 id="ma-manifiesto-titulo" className="hn-h2"><Texto k="masAlla.manifiesto.titulo" /></h2>
      <div className="hn-col-manifiesto__texto">
        <p className="hn-body hn-body--primero">{t('masAlla.manifiesto.p1')}</p>
        <p className="hn-body">{t('masAlla.manifiesto.p2')}</p>
        <p className="hn-frase">{t('masAlla.manifiesto.cierre')}</p>
      </div>
    </section>
  )
}

/* ── 5. Lo que vivirás: tres pilares y la foto con su pie debajo ────── */
function LoQueViviras() {
  const { t } = useTranslation()
  const items = t('masAlla.explorar.items', { returnObjects: true })
  const foto = useFoto('cultura')
  return (
    <section className="hn-sec hn-blanca hn-col-vivir" aria-labelledby="ma-vivir-titulo">
      <div className="hn-col-vivir__texto">
        <Etiqueta>{t('masAlla.explorar.etiqueta')}</Etiqueta>
        <h2 id="ma-vivir-titulo" className="hn-h2"><Texto k="masAlla.explorar.titulo" /></h2>
        <p className="hn-body hn-body--primero">{t('masAlla.explorar.sub')}</p>
        <ol className="hn-col-vivir__lista" role="list">
          {items.map((p, i) => (
            <li key={p.titulo}>
              <span className="hn-col-vivir__num" aria-hidden="true">{dos(i + 1)}</span>
              <div>
                <h3 className="hn-columnas__titulo">{p.titulo}</h3>
                <p>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figure className="hn-col-vivir__figura">
        <FotoHueco {...foto} sizes="(min-width: 901px) 40vw, 100vw" className="hn-col-vivir__foto" sinCredito />
        <figcaption className="hn-cap">{t('masAlla.explorar.pie')}</figcaption>
      </figure>
    </section>
  )
}

/* ── 6. Parapente: el vídeo de siempre y su texto ───────────────────── */
function Parapente() {
  const { t } = useTranslation()
  return (
    <section id="parapente" className="hn-sec hn-col-reel" aria-labelledby="ma-reel-titulo">
      <div className="reel-frame">
        <video
          src={videoParapente}
          poster={imgParapentePoster}
          controls
          playsInline
          preload="metadata"
          aria-label={t('masAlla.reel.videoAria')}
        />
      </div>
      <div>
        <Etiqueta>{t('masAlla.reel.etiqueta')}</Etiqueta>
        <h2 id="ma-reel-titulo" className="hn-h2"><Texto k="masAlla.reel.titulo" /></h2>
        <p className="hn-body hn-body--primero">{t('masAlla.reel.p1')}</p>
        <p className="hn-body">{t('masAlla.reel.p2')}</p>
        <a className="hn-lnk hn-lnk--verde" href="https://www.instagram.com/watchouttours/" target="_blank" rel="noopener noreferrer">
          {t('masAlla.reel.instagram')}<span className="sr-only"> {t('common.newTab')}</span>
        </a>
      </div>
    </section>
  )
}

/* ── 8. Dos maneras de viajar: dos tarjetas ─────────────────────────── */
function DosManeras({ setViaje }) {
  const { t } = useTranslation()
  const tarjeta = (id, boton) => (
    <article className="hn-col-manera" aria-labelledby={`ma-manera-${id}`}>
      <p className="hn-col-manera__etiqueta">{t(`masAlla.maneras.${id}.etiqueta`)}</p>
      <h3 id={`ma-manera-${id}`} className="hn-h3">{t(`masAlla.maneras.${id}.titulo`)}</h3>
      <p className="hn-col-manera__texto">{t(`masAlla.maneras.${id}.texto`)}</p>
      {boton}
    </article>
  )
  return (
    <section id="maneras" className="hn-sec" aria-labelledby="ma-maneras-titulo">
      <Etiqueta>{t('masAlla.maneras.etiqueta')}</Etiqueta>
      <h2 id="ma-maneras-titulo" className="hn-h2"><Texto k="masAlla.maneras.titulo" /></h2>
      <div className="hn-col-maneras">
        {/* El viaje en grupo lleva al formulario del final con este viaje
            ya elegido; el privado, a la página de los viajes privados */}
        {tarjeta('grupo', (
          <a href="#itinerario" className="hn-btn" onClick={() => setViaje('personas-ciegas')}>{t('masAlla.maneras.grupo.boton')}</a>
        ))}
        {tarjeta('privado', (
          <L to="/productos" className="hn-btn hn-btn--tinta">{t('masAlla.maneras.privado.boton')}</L>
        ))}
      </div>
    </section>
  )
}

/* ── Más allá de la vista (/mas-alla-de-la-vista ↔ /en/beyond-sight) ────
 * Viajes para personas ciegas y con baja visión. Portada → manifiesto →
 * lo que lo hace único (#descubre) → todo incluido en el viaje en grupo →
 * lo que vivirás → parapente (vídeo) → audios → dos maneras de viajar →
 * reseña de Nuria con vídeo → próxima salida → cierre con el formulario
 * del itinerario (sin foto: la página termina en el formulario).
 * ──────────────────────────────────────────────────────────────────────── */
export default function MasAllaDeLaVista() {
  const { t } = useTranslation()
  const [viaje, setViaje] = useState('personas-ciegas')
  const portada = useFoto('vista-portada')

  return (
    <div className="hn hn-col">
      {/* pageType editable desde /admin/seo (fila 'mas-alla-de-la-vista');
          estos son los valores de respaldo mientras no haya fila guardada. */}
      <Seo pageType="mas-alla-de-la-vista" title={t('masAlla.seo.title')} description={t('masAlla.seo.description')} />
      <Portada ns="masAlla" foto={portada} />
      <Manifiesto />
      <Columnas id="descubre" ns="masAlla.unico" className="hn-blanca" />
      <Columnas ns="masAlla.incluye" rejilla />
      <LoQueViviras />
      <Parapente />
      <AudioClips id="audios" titulo={t('masAlla.audios.titulo')} className="hn-sec hn-blanca hn-col-audios" />
      <DosManeras setViaje={setViaje} />
      <ResenasDestacadas variante="home" autor="Nuria" id="resena" antetitulo={t('masAlla.resena.etiqueta')} className="hn-blanca" />
      <ProximaSalidaGrupo />
      <CierreFormulario ns="masAlla" viaje={viaje} setViaje={setViaje} />
    </div>
  )
}
