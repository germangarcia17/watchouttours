import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import '../styles/pagestyle/SinPrisa.css'
// TODO(imagen): todavía no hay fotos propias de Viajes +60 (puerto, barco,
// Hobbiton, grupos de más de 60 años). De momento se usan las del
// proyecto; cada hueco se cambia sin tocar código desde /admin/imagenes,
// sección "sin-prisa" (las claves están junto a cada useSiteImage).
import imgHero from '../images/hero-home.webp'
import imgParaQuien from '../images/blind-travel-redwoods.webp'
import imgPrivado from '../images/haka-cultura-maori.jpg'
import imgSolo from '../images/blind-travel-maori-carving.webp'
import imgFamilia from '../images/sobre-nosotras.webp'
import imgRotorua from '../images/blind-travel-group-geyser.webp'
import imgKaikoura from '../images/kayak-kaikoura.jpg'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { Icono } from '../components/Icono'
import { L } from '../i18n/routing'
import { SolicitudRuta } from '../components/SolicitudRuta'
import { BotonVideollamada } from '../components/Videollamada'
import { HeroFoto, ResenasDestacadas, CtaFinal, AvisoProximaSalida } from '../components/home/BloquesHome'

const ICONOS_INCLUYE = ['guias', 'hotel', 'comida', 'privado', 'transporte', 'asistencia']

/* Galería: imagen por defecto de cada lugar. Hobbiton, Milford Sound y
   Tekapo aún no tienen foto en el proyecto: no se muestran hasta que se
   suban desde /admin/imagenes (sección "sin-prisa", clave
   "galeria-<lugar>"). */
const GALERIA_POR_DEFECTO = {
  rotorua: imgRotorua,
  kaikoura: imgKaikoura,
}

/* Fila de texto + foto. `invertida` pone la foto a la izquierda; en móvil
   la foto va siempre arriba. */
function Fila({ id, clave, imgDefecto, ns, parrafos, invertida = false }) {
  const { t } = useTranslation()
  const img = useSiteImage('sin-prisa', clave, imgDefecto, t(`${ns}.imgAlt`))
  return (
    <div className={`fila${invertida ? ' fila--invertida' : ''}`}>
      <figure className="fila__foto foto-marco">
        <img src={img.src} alt={img.alt} lang={img.lang} loading="lazy" />
      </figure>
      <div className="fila__texto prosa">
        <h2 id={id} className="sec-title">{t(`${ns}.title`)}</h2>
        {parrafos.map(k => <p key={k}>{t(`${ns}.${k}`)}</p>)}
      </div>
    </div>
  )
}

function FotoGaleria({ id, lugar, alt }) {
  const img = useSiteImage('sin-prisa', `galeria-${id}`, GALERIA_POR_DEFECTO[id] ?? null, alt)
  if (!img.src) return null
  return (
    <li className="galeria__item">
      <figure>
        <img src={img.src} alt={img.alt} lang={img.lang} loading="lazy" />
        <figcaption>{lugar}</figcaption>
      </figure>
    </li>
  )
}

/* ── Viajes +60 ──────────────────────────────────────────────────────────
 * Viajes tranquilos en grupos de máximo 6 personas
 * (/sin-prisa ↔ /en/unhurried). Orden: hero → filas en zigzag (para quién,
 * casi todo solo para vosotros, si viajas por tu cuenta, para tu familia)
 * → qué incluye → la ruta en PDF → lo que te llevarás y
 * galería → reseñas → preguntas frecuentes → CTA. Sin precios ni plazas.
 * ──────────────────────────────────────────────────────────────────────── */
export default function SinPrisa() {
  const { t } = useTranslation()
  const incluye = t('sinPrisa.incluye.items', { returnObjects: true })
  const galeria = t('sinPrisa.galeria.items', { returnObjects: true })
  const faq = t('sinPrisa.faq.items', { returnObjects: true })

  const heroImg = useSiteImage('sin-prisa', 'hero', imgHero, t('sinPrisa.heroImgAlt'))

  return (
    <>
      {/* pageType editable desde /admin/seo (fila 'sin-prisa'); estos son
          los valores de respaldo mientras no haya fila guardada. */}
      <Seo
        pageType="sin-prisa"
        title={t('sinPrisa.seo.title')}
        description={t('sinPrisa.seo.description')}
      />

      <HeroFoto
        imagen={heroImg}
        antetitulo={t('sinPrisa.hero.eyebrow')}
        titulo={t('sinPrisa.hero.h1')}
        subtitulo={t('sinPrisa.hero.sub')}
      >
        <L to="/contacto" className="btn btn-solid">{t('sinPrisa.hero.cta')}</L>
        <BotonVideollamada className="btn btn-outline" />
      </HeroFoto>

      {/* ── Filas en zigzag ───────────────────────────── */}
      <section className="filas">
        <div className="wrap filas__lista">
          <Fila id="sp-para-quien" clave="para-quien" imgDefecto={imgParaQuien} ns="sinPrisa.paraQuien" parrafos={['p1', 'p2']} />
          <Fila id="sp-privado" clave="privado" imgDefecto={imgPrivado} ns="sinPrisa.privado" parrafos={['p']} invertida />
          <Fila id="sp-solo" clave="solo" imgDefecto={imgSolo} ns="sinPrisa.solo" parrafos={['p']} />
          <Fila id="sp-familia" clave="familia" imgDefecto={imgFamilia} ns="sinPrisa.familia" parrafos={['p']} invertida />
        </div>
      </section>

      {/* ── Qué incluye: cuadrícula 3×2 ───────────────── */}
      <section className="band-cream" aria-labelledby="sp-incluye">
        <div className="wrap">
          <h2 id="sp-incluye" className="sec-title">{t('sinPrisa.incluye.title')}</h2>
          <ul className="incluye">
            {incluye.map((item, i) => (
              <li key={item} className="incluye__item">
                <span className="icono-circulo"><Icono nombre={ICONOS_INCLUYE[i]} /></span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
          {/* La próxima salida en grupo es El Gran Viaje: solo se enlaza */}
          <AvisoProximaSalida />
        </div>
      </section>

      {/* ── La ruta: se pide en PDF (no se enseña en la web) ── */}
      {/* Fondo blanco: va entre dos bandas crema */}
      <SolicitudRuta viaje="viajes-60" className="" />

      {/* ── Lo que te llevarás + galería ──────────────── */}
      <section className="band-cream" aria-labelledby="sp-llevaras">
        <div className="wrap">
          <div className="llevaras">
            <h2 id="sp-llevaras" className="sec-title">{t('sinPrisa.llevaras.title')}</h2>
            <p className="llevaras__texto">{t('sinPrisa.llevaras.p')}</p>
          </div>
          <ul className="galeria" aria-label={t('sinPrisa.galeria.aria')}>
            {galeria.map(item => <FotoGaleria key={item.id} {...item} />)}
          </ul>
        </div>
      </section>

      {/* ── Reseñas: primero las que no se centran en la ceguera ── */}
      <ResenasDestacadas tono="night" modo="sinCeguera" />

      {/* ── Preguntas frecuentes ──────────────────────── */}
      <section aria-labelledby="sp-faq">
        <div className="wrap faq-grid">
          <h2 id="sp-faq" className="sec-title">{t('sinPrisa.faq.title')}</h2>
          <div className="sp-faq">
            {faq.map(({ q, a }) => (
              <details key={q} className="sp-faq__item">
                <summary>{q}<span className="sp-faq__signo" aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal
        titulo={t('sinPrisa.finalCta.title')}
        parrafos={[t('sinPrisa.finalCta.p')]}
        cta={t('sinPrisa.finalCta.ctaPrimary')}
      />
    </>
  )
}
