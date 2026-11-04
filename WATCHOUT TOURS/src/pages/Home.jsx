import { useTranslation } from 'react-i18next'
import '../styles/pagestyle/Home.css'
import imgHero from '../images/hero-home.webp'
import imgTarjeta60 from '../images/blind-travel-group-geyser.webp'
import imgTarjetaCiegas from '../images/blind-travel-maori-carving.webp'
import { useSiteImage } from '../lib/siteImages'
import { Seo } from '../components/Seo'
import { Icono } from '../components/Icono'
import { L } from '../i18n/routing'
import {
  HeroFoto,
  ResenasDestacadas,
  AudioClips,
  NuestraHistoria,
  BlogPreview,
  CtaFinal,
} from '../components/home/BloquesHome'

/* Iconos de la franja de confianza y de "Así viajamos", en el mismo orden
   que los textos de los locales. */
const ICONOS_CONFIANZA = ['grupo', 'guias', 'privado', 'casa']
const ICONOS_ASI_VIAJAMOS = ['grupo', 'privado', 'guias', 'idioma', 'resuelto']

/* Imagen de cada tarjeta de "Dos viajes", editable desde /admin/imagenes
   (sección "home"). */
const IMAGENES_TARJETAS = {
  'sin-prisa': { clave: 'tarjeta-viajes-60', src: imgTarjeta60 },
  'mas-alla':  { clave: 'tarjeta-personas-ciegas', src: imgTarjetaCiegas },
}

function TarjetaViaje({ id, to, titulo, texto, cta, imgAlt }) {
  const { clave, src } = IMAGENES_TARJETAS[id]
  const img = useSiteImage('home', clave, src, imgAlt)
  return (
    <article className="tarjeta tarjeta--enlace viaje-tarjeta" aria-labelledby={`${id}-heading`}>
      <figure className="tarjeta__media">
        <img src={img.src} alt={img.alt} lang={img.lang} loading="lazy" />
      </figure>
      <div className="tarjeta__cuerpo">
        <h3 id={`${id}-heading`} className="tarjeta__titulo">{titulo}</h3>
        <p className="tarjeta__texto">{texto}</p>
        <div className="tarjeta__pie">
          {/* Único enlace de la tarjeta; se estira sobre toda ella. */}
          <L to={to} className="btn btn-solid tarjeta__enlace">{cta}<span aria-hidden="true"> →</span></L>
        </div>
      </div>
    </article>
  )
}

/* ── Home de marca ───────────────────────────────────────────────────────
 * Presenta Watchout Tours como marca madre y reparte hacia sus dos líneas.
 * Orden: Hero → franja de confianza → Así viajamos → Dos viajes →
 * Reseñas → Audios → Nuestra historia → Blog → CTA final.
 * Fondos alternos: blanco, crema y azul noche (reseñas y CTA).
 * ──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const { t } = useTranslation()
  const confianza = t('home.confianza.items', { returnObjects: true })
  const puntos = t('home.asiViajamos.puntos', { returnObjects: true })
  const tarjetas = t('home.dosViajes.tarjetas', { returnObjects: true })

  const heroImg = useSiteImage('home', 'hero', imgHero, t('home.heroImgAlt'))

  return (
    <>
      <Seo
        pageType="home"
        title={t('home.seo.title')}
        description={t('home.seo.description')}
      />

      <HeroFoto
        imagen={heroImg}
        antetitulo={t('home.hero.eyebrow')}
        titulo={t('home.hero.h1')}
        subtitulo={t('home.hero.sub')}
      >
        <L to="/sin-prisa" className="btn btn-solid">{t('home.hero.ctaSinPrisa')}</L>
        <L to="/mas-alla-de-la-vista" className="btn btn-outline">{t('home.hero.ctaMasAlla')}</L>
      </HeroFoto>

      {/* ── Franja de confianza ───────────────────────── */}
      <section className="confianza band-cream" aria-labelledby="confianza-titulo">
        <div className="wrap">
          <h2 id="confianza-titulo" className="sr-only">{t('home.confianza.titulo')}</h2>
          <ul className="confianza__lista">
            {confianza.map((texto, i) => (
              <li key={texto} className="confianza__item">
                <Icono nombre={ICONOS_CONFIANZA[i]} />
                <span>{texto}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Así viajamos ──────────────────────────────── */}
      <section id="asi-viajamos" aria-labelledby="asi-viajamos-heading">
        <div className="wrap">
          <h2 id="asi-viajamos-heading" className="sec-title">{t('home.asiViajamos.title')}</h2>
          <ul className="asi-viajamos">
            {puntos.map(({ titulo, texto }, i) => (
              <li key={titulo} className="asi-viajamos__item">
                <span className="icono-circulo"><Icono nombre={ICONOS_ASI_VIAJAMOS[i]} /></span>
                <h3 className="asi-viajamos__titulo">{titulo}</h3>
                <p className="asi-viajamos__texto">{texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Dos viajes, un mismo método ───────────────── */}
      <section id="dos-viajes" className="band-cream" aria-labelledby="dos-viajes-heading">
        <div className="wrap">
          <h2 id="dos-viajes-heading" className="sec-title">{t('home.dosViajes.title')}</h2>
          <div className="dos-viajes">
            {tarjetas.map(tarjeta => <TarjetaViaje key={tarjeta.id} {...tarjeta} />)}
          </div>
        </div>
      </section>

      <ResenasDestacadas tono="night" />
      <AudioClips />
      <NuestraHistoria />
      <BlogPreview />

      <CtaFinal
        titulo={t('home.finalCta.title')}
        parrafos={[t('home.finalCta.p')]}
        cta={t('home.finalCta.ctaPrimary')}
      />
    </>
  )
}
