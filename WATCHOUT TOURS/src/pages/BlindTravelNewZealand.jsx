import { Seo } from '../components/Seo'
import '../styles/pagestyle/Estaticas.css'
import '../styles/pagestyle/BlindTravelNewZealand.css'

/* ────────────────────────────────────────────────────────────────────────
 * ESTRUCTURA ÚNICAMENTE — sin contenido editorial todavía.
 *
 * Esta página es la futura guía pilar "Blind Travel in New Zealand", en
 * inglés únicamente (no tiene equivalente en español, a diferencia del
 * resto de páginas públicas del sitio). Todo el texto entre corchetes
 * [placeholder] es un marcador de posición estructural, NO contenido
 * definitivo: no debe publicarse ni indexarse tal cual. El H1 es el único
 * texto final, indicado explícitamente por encargo.
 *
 * Reutiliza el sistema visual existente:
 * - .static-hero / .static-titulo / .static-intro / .static-body (Estaticas.css)
 * - .sec-eyebrow (theme.css)
 * - patrón de cita con borde jade (igual que .sn-quote en SobreNosotras.css)
 * Solo añade BlindTravelNewZealand.css para lo que esas hojas no cubren
 * (citas y FAQ), sin tocar CSS global.
 * ──────────────────────────────────────────────────────────────────────── */
export default function BlindTravelNewZealand() {
  return (
    <>
      {/* pageType nuevo: no está aún en PAGE_TYPES de /admin/seo, así que
          hoy no es editable desde el panel; usa el H1 como <title> temporal
          hasta que haya copy de SEO definitivo. */}
      <Seo
        pageType="blind-travel-new-zealand"
        title="Blind Travel in New Zealand: A Practical Guide for Blind and Low-Vision Travellers"
      />

      <section className="static-hero">
        <div className="wrap static-hero-inner">
          <span className="sec-eyebrow">[Eyebrow — pending]</span>
          <h1 className="static-titulo">
            Blind Travel in New Zealand: A Practical Guide for Blind and Low-Vision Travellers
          </h1>
          {/* <p className="static-intro">[Intro paragraph — pending]</p> */}
        </div>
      </section>

      <div className="static-body btnz-body">
        <div className="wrap">

          <section aria-labelledby="btnz-section-1-heading">
            <h2 id="btnz-section-1-heading">[H2 — Section 1 heading pending]</h2>
            <p>[Paragraph — editorial content pending]</p>
            <p>[Paragraph — editorial content pending]</p>
          </section>

          <section aria-labelledby="btnz-section-2-heading">
            <h2 id="btnz-section-2-heading">[H2 — Section 2 heading pending]</h2>
            <p>[Paragraph — editorial content pending]</p>
            <p>[Paragraph — editorial content pending]</p>
          </section>

          {/* Cita real del primer viaje piloto — pendiente de aportar */}
          <section aria-labelledby="btnz-section-3-heading">
            <h2 id="btnz-section-3-heading">[H2 — Section 3 heading pending]</h2>
            <p>[Paragraph — editorial content pending]</p>
            <blockquote className="btnz-quote">
              <p>[Quote from the pilot trip — pending]</p>
              <cite>[Attribution — pending]</cite>
            </blockquote>
            <p>[Paragraph — editorial content pending]</p>
          </section>

          <section aria-labelledby="btnz-section-4-heading">
            <h2 id="btnz-section-4-heading">[H2 — Section 4 heading pending]</h2>
            <p>[Paragraph — editorial content pending]</p>
            <p>[Paragraph — editorial content pending]</p>
          </section>

          <section aria-labelledby="btnz-section-5-heading">
            <h2 id="btnz-section-5-heading">[H2 — Section 5 heading pending]</h2>
            <p>[Paragraph — editorial content pending]</p>
            <p>[Paragraph — editorial content pending]</p>
          </section>

          {/* ── FAQ (preparado para GEO/AEO) ─────────────────────────── */}
          <section aria-labelledby="btnz-faq-heading">
            <h2 id="btnz-faq-heading">[H2 — FAQ heading pending]</h2>

            <div className="btnz-faq-item">
              <h3>[FAQ question 1 — pending]</h3>
              <p>[FAQ answer 1 — pending]</p>
            </div>

            <div className="btnz-faq-item">
              <h3>[FAQ question 2 — pending]</h3>
              <p>[FAQ answer 2 — pending]</p>
            </div>

            <div className="btnz-faq-item">
              <h3>[FAQ question 3 — pending]</h3>
              <p>[FAQ answer 3 — pending]</p>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
