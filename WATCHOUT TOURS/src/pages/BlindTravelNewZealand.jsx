import { Helmet } from 'react-helmet-async'
import { Seo } from '../components/Seo'
import { L } from '../i18n/routing'
import { SITE_URL } from '../lib/site'
import heroFarmImg from '../images/blind-travel-hero-farm.webp'
import heroFarmOgImg from '../images/blind-travel-hero-farm-og.jpg'
import redwoodsImg from '../images/blind-travel-redwoods.webp'
import maoriCarvingImg from '../images/blind-travel-maori-carving.webp'
import groupGeyserImg from '../images/blind-travel-group-geyser.webp'
import '../styles/pagestyle/Estaticas.css'
import '../styles/pagestyle/BlindTravelNewZealand.css'

/* Fotografías reales del primer viaje piloto. Los .webp son para uso en la
 * propia página; el .jpg del hero es un recorte 1200x630 sin deformar,
 * pensado solo para Article.image / og:image / twitter:image (formato JPEG
 * por compatibilidad amplia con crawlers sociales). */
const HERO_OG_URL = `${SITE_URL}${heroFarmOgImg}`

/* JSON-LD de esta página: WebPage + Article + BreadcrumbList en un único
 * @graph, dentro de un <Helmet> (mismo patrón que ya usa BlogPost.jsx, el
 * único otro sitio del proyecto con Schema).
 *
 * Organization/WebSite globales: index.html define TravelAgency (@id
 * .../#organization) y WebSite (@id .../#website) para todo el sitio.
 * Aquí solo los referenciamos por @id — no se duplican sus datos. */
const PAGE_URL = `${SITE_URL}/en/blind-travel-new-zealand`
const ORGANIZATION_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Blind Travel in New Zealand: A Practical Guide for Blind and Low-Vision Travellers',
      description: 'A practical guide to blind travel in New Zealand, based on 23 days travelling with blind travellers. Accessibility, independence and sensory travel.',
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': `${PAGE_URL}#article` },
      breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
    },
    {
      '@type': 'Article',
      '@id': `${PAGE_URL}#article`,
      headline: 'Blind Travel in New Zealand: A Practical Guide for Blind and Low-Vision Travellers',
      description: 'What 23 days on the road with blind travellers taught us about accessibility, independence and experiencing New Zealand beyond sight.',
      image: [HERO_OG_URL],
      inLanguage: 'en',
      isPartOf: { '@id': WEBSITE_ID },
      mainEntityOfPage: { '@id': `${PAGE_URL}#webpage` },
      author: { '@id': ORGANIZATION_ID },
      publisher: { '@id': ORGANIZATION_ID },
      about: [
        { '@type': 'Thing', name: 'Blind travel' },
        { '@type': 'Thing', name: 'Low vision travel' },
        { '@type': 'Thing', name: 'Accessible tourism' },
        { '@type': 'Thing', name: 'New Zealand travel' },
        { '@type': 'Thing', name: 'Sensory travel' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/en` },
        { '@type': 'ListItem', position: 2, name: 'Blind Travel in New Zealand', item: PAGE_URL },
      ],
    },
  ],
}

/* ────────────────────────────────────────────────────────────────────────
 * Guía pilar "Blind Travel in New Zealand" (solo en inglés, sin equivalente
 * en español). Contenido editorial basado en el primer viaje piloto de
 * Watchout Tours. No tiene FAQPage Schema todavía (a propósito) y no está
 * enlazada desde la navegación.
 * ──────────────────────────────────────────────────────────────────────── */
export default function BlindTravelNewZealand() {
  return (
    <>
      {/* pageType editable desde /admin/seo (fila 'blind-travel-new-zealand');
          estos son los valores de respaldo mientras no haya fila guardada. */}
      <Seo
        pageType="blind-travel-new-zealand"
        title="Blind Travel in New Zealand | Blind & Low-Vision Guide"
        description="A practical guide to blind travel in New Zealand, based on 23 days travelling with blind travellers. Accessibility, independence and sensory travel."
        ogTitle="Blind Travel in New Zealand: A Practical Guide"
        ogDescription="What 23 days on the road with blind travellers taught us about accessibility, independence and experiencing New Zealand beyond sight."
        image={HERO_OG_URL}
        robots="index, follow"
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(pageJsonLd)}</script>
      </Helmet>

      <section className="static-hero">
        <div className="wrap btnz-hero-grid">
          <div className="static-hero-inner">
            <h1 className="static-titulo">
              Blind Travel in New Zealand: A Practical Guide for Blind and Low-Vision Travellers
            </h1>
            <p className="static-intro">
              What 23 days on the road with blind travellers taught us about accessibility, independence and experiencing New Zealand beyond sight.
            </p>
            <p className="btnz-byline">
              By Watchout Tours — First-hand travel insights from our New Zealand pilot journey. Last reviewed: <time dateTime="2026-08">August 2026</time>.
            </p>
          </div>
          <figure className="btnz-hero-photo">
            <img
              src={heroFarmImg}
              alt="A man holds an audio recorder with a foam windscreen beside a woman holding a white cane, both standing at a wooden farm fence with sheep leaning over the rail."
              width="1200"
              height="1600"
              fetchpriority="high"
            />
          </figure>
        </div>
      </section>

      <div className="static-body btnz-body">
        <div className="wrap">

          {/* ── Introducción (sin H2 propio en el contenido maestro) ──── */}
          <div className="btnz-lead">
            <p>Can you travel around New Zealand if you are blind or have low vision?</p>
            <p>Absolutely.</p>
            <p>But after travelling across New Zealand for 23 days alongside blind travellers, we learned that this question has a much more interesting answer than simply yes.</p>
            <p>Many of New Zealand’s extraordinary experiences are possible without sight.</p>
            <p>You can feel the power of a waterfall before touching its water. You can walk barefoot beneath giant redwoods. You can hear the ocean before reaching it. You can experience Māori culture through voice, rhythm, movement and vibration. You can jet boat, cruise through extraordinary landscapes, discover food, wildlife and places that feel completely different from one another.</p>
            <p>But we also learned something important:</p>
            <p>Being able to participate in an activity doesn’t necessarily mean that the experience has been designed with a blind traveller in mind.</p>
            <p>And often, the difference isn’t expensive infrastructure.</p>
            <p>It’s information.</p>
            <p>Time.</p>
            <p>Orientation.</p>
            <p>Communication.</p>
            <p>Permission to touch.</p>
            <p>Someone knowing when to help — and when not to.</p>
            <p>This guide is based on what we learned travelling through New Zealand with blind travellers during our first Watchout Tours journey.</p>
            <p>It isn’t intended to describe every blind person’s experience. Blindness and low vision are different for everyone.</p>
            <p>It’s simply what the road taught us.</p>
          </div>

          {/* ── Procedencia editorial: de dónde viene este contenido ──── */}
          <aside className="btnz-provenance" aria-label="Editorial provenance">
            <p>Based on the first Watchout Tours journey across New Zealand: 23 days travelling alongside blind travellers, learning directly from what worked, what didn’t, and what we would design differently next time.</p>
          </aside>

          <section aria-labelledby="btnz-yes-heading">
            <h2 id="btnz-yes-heading">Yes, blind people can travel around New Zealand</h2>
            <p>One of the biggest misconceptions about accessible travel is that accessibility means somebody doing things for you.</p>
            <p>Our experience taught us almost the opposite.</p>
            <p>Our travellers could use bathrooms independently.</p>
            <p>They could order and pay for their own food.</p>
            <p>They could shop.</p>
            <p>They packed their own belongings.</p>
            <p>They got in and out of the van.</p>
            <p>They could move independently around hotels once they understood the space.</p>
            <p>The challenge often wasn’t doing the thing.</p>
            <p>It was getting enough information about an unfamiliar environment to be able to do it independently.</p>
            <p>And that distinction changed the way we thought about accessible travel.</p>
          </section>

          <section aria-labelledby="btnz-orientation-heading">
            <h2 id="btnz-orientation-heading">Orientation changes everything</h2>
            <p>Think about walking into a hotel room.</p>
            <p>A sighted traveller can usually understand the room within seconds.</p>
            <p>Bed.</p>
            <p>Bathroom.</p>
            <p>Door.</p>
            <p>Sockets.</p>
            <p>Lights.</p>
            <p>Wardrobe.</p>
            <p>For somebody who can’t obtain all of that information visually, that mental map may need to be built differently.</p>
            <p>So whenever we arrived at a new accommodation, we would orient our travellers.</p>
            <p>We would show them the room, bathroom, sockets and important features.</p>
            <p>Then we might walk the route from the room to the lift, reception, restaurant or exit.</p>
            <p>And something interesting happened.</p>
            <p>Once the environment became familiar, our involvement could decrease.</p>
            <p>That’s an important distinction.</p>
            <p>Good support shouldn’t necessarily make someone need you more.</p>
            <p>Sometimes the best support gives someone enough information that they don’t need you anymore.</p>
            <blockquote className="btnz-quote">
              <p>Orient first. Step back afterwards.</p>
            </blockquote>
          </section>

          <section aria-labelledby="btnz-independence-heading">
            <h2 id="btnz-independence-heading">Independence isn’t the same as being left alone</h2>
            <p>During our first journey, we also discovered how easy it is for guides to help too much.</p>
            <p>It comes from a good place.</p>
            <p>You want everything to be easy.</p>
            <p>So you guide someone there.</p>
            <p>Find something for them.</p>
            <p>Bring something to them.</p>
            <p>Explain everything.</p>
            <p>Solve the problem.</p>
            <p>And when help is permanently available, it can slowly become the default solution.</p>
            <p>We began asking ourselves a different question:</p>
            <p>Does this person actually need our help right now, or do they simply need information?</p>
            <p>That question has become fundamental to the way we’re developing Watchout.</p>
            <p>For us, independence doesn’t mean leaving somebody alone to figure everything out.</p>
            <p>It means providing enough orientation, information and choice for the traveller to decide what they want to do themselves.</p>
            <p>Because there is no single correct level of independence.</p>
            <p>Some blind travellers navigate unfamiliar places regularly.</p>
            <p>Others don’t.</p>
            <p>Some want assistance.</p>
            <p>Others don’t.</p>
            <p>Some will happily explore a city independently.</p>
            <p>Others feel more comfortable once they’ve been oriented to the area.</p>
            <p>There is no single “blind traveller”.</p>
          </section>

          <section aria-labelledby="btnz-time-heading">
            <h2 id="btnz-time-heading">New Zealand takes time</h2>
            <p>This was one of our biggest lessons.</p>
            <p>Our original timings simply didn’t work.</p>
            <p>During our first journey, many everyday transitions took considerably longer than we had anticipated.</p>
            <p>Getting ready.</p>
            <p>Breakfast.</p>
            <p>Finding belongings.</p>
            <p>Leaving a restaurant.</p>
            <p>Packing.</p>
            <p>Checking a hotel room before departure.</p>
            <p>Orienting to a new location.</p>
            <p>Moving from the van into an activity.</p>
            <p>None of these things was necessarily difficult.</p>
            <p>They simply required time.</p>
            <p>We eventually realised that an accessible itinerary cannot always be created by taking a conventional tour and adding accessibility on top.</p>
            <p>The rhythm itself needs to be designed differently.</p>
            <p>And perhaps that’s not a disadvantage.</p>
            <p>New Zealand is a country worth experiencing slowly.</p>
            <p>Standing beside a waterfall long enough to really hear it.</p>
            <p>Taking your shoes off in a forest.</p>
            <p>Stopping beside the ocean.</p>
            <p>Touching something rather than simply being told what it looks like.</p>
            <p>Allowing an experience to settle before rushing to the next one.</p>
            <p>So we stopped asking:</p>
            <p>How much can we fit into today?</p>
            <p>And started asking:</p>
            <p>How much can we experience well today?</p>
          </section>

          <section aria-labelledby="btnz-beyond-sight-heading">
            <h2 id="btnz-beyond-sight-heading">Experiencing New Zealand beyond sight</h2>
            <figure className="btnz-inline-photo">
              <img
                src={redwoodsImg}
                alt="Three people stand beneath tall redwood trees, arms raised to touch a low branch as light filters through the canopy."
                width="844"
                height="1125"
                loading="lazy"
              />
            </figure>
            <p>This is where travelling with blind people changed the way we experienced New Zealand too.</p>
            <p>As sighted people, our instinct was often to describe what we could see.</p>
            <p>But description isn’t always the best way to experience a place.</p>
            <p>Imagine standing beside a waterfall.</p>
            <p>We could immediately begin describing its height, the rocks, the vegetation and everything around it.</p>
            <p>Or…</p>
            <p>We could stop talking.</p>
            <p>Listen to the water.</p>
            <p>Move closer.</p>
            <p>Feel the moisture.</p>
            <p>Touch the water where it is safe to do so.</p>
            <p>Notice the temperature.</p>
            <p>Feel whether the environment is enclosed or wide open.</p>
            <p>Notice the air.</p>
            <p>And then describe what adds meaning.</p>
            <p>The same happened in forests.</p>
            <p>At times we walked barefoot.</p>
            <p>The ground, temperature, smell, sound and scale of the environment became part of understanding where we were.</p>
            <p>At the coast, there was wind, salt, water, sand, temperature and sound.</p>
            <p>We weren’t trying to recreate sight.</p>
            <p>We were discovering what the place already offered.</p>
            <blockquote className="btnz-quote">
              <p>We don’t want to tell you how New Zealand looks. We want to help you discover how New Zealand feels.</p>
            </blockquote>
          </section>

          <section aria-labelledby="btnz-not-described-heading">
            <h2 id="btnz-not-described-heading">Not everything needs to be described</h2>
            <p>We learned this the hard way too.</p>
            <p>Some experiences are extraordinarily difficult to translate into words while they’re happening.</p>
            <p>A haka is a perfect example.</p>
            <p>There is voice and rhythm that can be heard.</p>
            <p>But there are also facial expressions, eyes, tongue movements, body positions, gestures, coordination and movement through space.</p>
            <p>Trying to describe every visual detail while the performance is happening could mean talking over the very experience the traveller is trying to hear.</p>
            <p>So we’ve begun developing a different approach:</p>

            <h3>Before</h3>
            <p>Provide context.</p>
            <p>Explain the environment and important visual information before the experience begins.</p>

            <h3>During</h3>
            <p>Describe selectively.</p>
            <p>Give information when it genuinely adds something, but leave space for the traveller to listen and experience.</p>

            <h3>After</h3>
            <p>Fill in the gaps.</p>
            <p>Talk about movements, expressions and visual moments that couldn’t reasonably be communicated while they were happening.</p>

            <p>We are still learning.</p>
            <p>But one thing became clear:</p>
            <p>More description does not automatically mean more accessibility.</p>
            <p>Sometimes accessibility means knowing when to stop talking.</p>
          </section>

          <section aria-labelledby="btnz-touch-heading">
            <h2 id="btnz-touch-heading">Touch can completely change an experience</h2>
            <figure className="btnz-inline-photo">
              <img
                src={maoriCarvingImg}
                alt="A woman rests her hand on a carved Māori figure while a companion beside her gestures as he describes it."
                width="1000"
                height="1333"
                loading="lazy"
              />
            </figure>
            <p>One of the recurring challenges during our journey was the phrase:</p>
            <p>Please do not touch.</p>
            <p>For a sighted visitor, an object behind a barrier can still be observed.</p>
            <p>For a blind traveller, touch may be one of the most meaningful ways of understanding that same object.</p>
            <p>That meant we often found ourselves asking:</p>
            <p>Would it be possible for our blind travellers to touch this?</p>
            <p>Sometimes the answer was yes.</p>
            <p>Sometimes it was no.</p>
            <p>And sometimes something much better happened:</p>
            <p>someone looked for an alternative.</p>
            <p>One of our strongest examples came during our experience at Wētā Workshop Unleashed in Auckland.</p>
            <p>Some valuable objects couldn’t simply be handled.</p>
            <p>Instead of ending the conversation there, a member of the team found pieces that our blind travellers could explore through touch.</p>
            <p>During the experience, he made sure they were positioned where they could participate, described what was happening and incorporated tactile elements whenever possible.</p>
            <p>For a while, something unusual happened:</p>
            <p>we weren’t needed.</p>
            <p>And that was brilliant.</p>
            <p>Because the accessibility was happening directly between the experience provider and the traveller.</p>
          </section>

          <section aria-labelledby="btnz-good-accessibility-heading">
            <h2 id="btnz-good-accessibility-heading">What good accessibility can look like</h2>
            <p>That experience taught us something fundamental.</p>
            <p>The ideal relationship isn’t always:</p>
            <p>Experience provider → sighted guide → blind traveller.</p>
            <p>Whenever possible, it should simply be:</p>
            <p>Experience provider → traveller.</p>
            <p>We experienced similarly thoughtful support during our time in Milford Sound / Piopiotahi.</p>
            <p>Small operational decisions can make an enormous difference.</p>
            <p>Allowing a blind group to enter slightly earlier, for example, can give people time to orient themselves and choose an appropriate position before a crowd arrives.</p>
            <p>Clear verbal instructions help.</p>
            <p>Speaking directly to the blind traveller helps.</p>
            <p>Asking before assisting helps.</p>
            <p>Finding something safe to touch helps.</p>
            <p>None of these necessarily requires rebuilding an attraction.</p>
            <p>Sometimes accessibility starts with people being willing to think differently.</p>
          </section>

          <section aria-labelledby="btnz-possible-not-accessible-heading">
            <h2 id="btnz-possible-not-accessible-heading">An activity can be possible without being accessible</h2>
            <p>We encountered the opposite too.</p>
            <p>There were activities our travellers could absolutely participate in, but where staff weren’t necessarily experienced in supporting blind visitors.</p>
            <p>The activity itself wasn’t inaccessible.</p>
            <p>The transitions around it were.</p>
            <p>Getting to the correct place.</p>
            <p>Boarding.</p>
            <p>Finding the seat.</p>
            <p>Understanding where to move.</p>
            <p>Getting off afterwards.</p>
            <p>At times, we as guides provided most of that support.</p>
            <p>That taught us another important lesson:</p>
            <blockquote className="btnz-quote">
              <p>“Can a blind person do this?” and “Is this experience prepared for a blind person?” are two different questions.</p>
            </blockquote>
            <p>That’s why preparation with tourism operators has become an increasingly important part of how we think about future Watchout journeys.</p>
          </section>

          <section aria-labelledby="btnz-ordering-lunch-heading">
            <h2 id="btnz-ordering-lunch-heading">Even ordering lunch taught us something</h2>
            <p>Restaurants sound simple.</p>
            <p>Until you arrive as a group.</p>
            <p>In many New Zealand cafés and casual restaurants, customers order and pay at the counter rather than having everything handled at the table.</p>
            <p>During our first trip, we quickly discovered how chaotic this could become.</p>
            <p>First everybody needed to know the menu.</p>
            <p>Then hear it again.</p>
            <p>And sometimes again.</p>
            <p>Questions followed.</p>
            <p>Decisions changed.</p>
            <p>Then someone needed to find the counter, order and pay.</p>
            <p>Our initial solution required far too much involvement from the guides.</p>
            <p>But the problem wasn’t that our travellers couldn’t order.</p>
            <p>They absolutely could.</p>
            <p>Once at the counter, they could speak directly with staff, order and pay.</p>
            <p>The real challenge was getting the information and organising the group.</p>
            <p>And that taught us another principle:</p>
            <blockquote className="btnz-quote">
              <p>Before adding assistance, improve the system.</p>
            </blockquote>
            <p>Accessible menus available beforehand, clear organisation and a predictable process can sometimes provide more independence than another person helping.</p>
          </section>

          <section aria-labelledby="btnz-free-time-heading">
            <h2 id="btnz-free-time-heading">Free time isn’t automatically freedom</h2>
            <p>This surprised us.</p>
            <p>A sighted traveller who gets two free hours in a town can walk outside, look around, find a café, discover a shop and explore.</p>
            <p>But if you don’t yet understand what’s outside the hotel, being told:</p>
            <p>“You have two hours of free time”</p>
            <p>doesn’t necessarily create many meaningful choices.</p>
            <p>During our first journey, we noticed that unfamiliar surroundings could make independent exploration feel difficult for some travellers.</p>
            <p>That doesn’t mean filling every free moment with another organised activity.</p>
            <p>Quite the opposite.</p>
            <p>It means thinking about orientation beyond the hotel.</p>
            <p>What’s nearby?</p>
            <p>How could somebody reach it?</p>
            <p>What useful landmarks or information could help them return?</p>
            <p>Is there a simple route to a café or waterfront?</p>
            <p>And then the traveller decides.</p>
            <p>Explore.</p>
            <p>Stay in.</p>
            <p>Work on their computer.</p>
            <p>Sleep.</p>
            <p>Have coffee.</p>
            <p>Do absolutely nothing.</p>
            <p>Because independence isn’t forcing someone to explore either.</p>
            <p>It’s having a genuine choice.</p>
          </section>

          <section aria-labelledby="btnz-rest-heading">
            <h2 id="btnz-rest-heading">Rest matters too</h2>
            <figure className="btnz-inline-photo">
              <img
                src={groupGeyserImg}
                alt="Seven travellers and guides gather on a boardwalk with steam from the Pōhutu Geyser rising behind them."
                width="1000"
                height="1333"
                loading="lazy"
              />
            </figure>
            <p>New Zealand is exciting.</p>
            <p>Our travellers often finished days tired, highly stimulated and still wanting to do more.</p>
            <p>We understood the feeling.</p>
            <p>But we also learned that a good itinerary needs space where nobody has to learn, orient, process, participate or achieve anything.</p>
            <p>Rest isn’t wasted travel time.</p>
            <p>It is part of the journey.</p>
            <p>That lesson applies to travellers.</p>
            <p>And it applies to guides too.</p>
            <p>Accessible travel cannot depend on guides being available every minute of every day.</p>
            <p>A sustainable journey needs boundaries, systems and moments where everyone can simply be.</p>
          </section>

          <section aria-labelledby="btnz-expect-heading">
            <h2 id="btnz-expect-heading">So, what should a blind traveller expect?</h2>
            <p>If you’re considering travelling around New Zealand blind or with low vision, we believe it’s worth asking a tour provider more than simply:</p>
            <p>“Is this accessible?”</p>
            <p>Ask:</p>
            <p>How will you orient me in unfamiliar environments?</p>
            <p>How much assistance will I receive?</p>
            <p>Can I choose when I want help?</p>
            <p>How are visual experiences described?</p>
            <p>Will I have opportunities to touch and physically experience things?</p>
            <p>Do the activity providers know blind travellers are coming?</p>
            <p>What happens during free time?</p>
            <p>How much downtime is built into the itinerary?</p>
            <p>How are meals organised?</p>
            <p>Can I travel without bringing my own sighted companion?</p>
            <p>And perhaps most importantly:</p>
            <p>Will I be treated as a traveller first?</p>
          </section>

          <section aria-labelledby="btnz-method-heading">
            <h2 id="btnz-method-heading">How Watchout is learning to travel differently</h2>
            <p>Watchout Tours was born in New Zealand from a simple idea:</p>
            <p>This country doesn’t have to be seen to be extraordinary.</p>
            <p>But our first journey taught us that creating a genuinely meaningful blind travel experience requires much more than choosing accessible activities.</p>
            <p>It requires designing the whole journey differently.</p>
            <p>Today, the method we’re developing is built around six ideas:</p>

            <h3>Anticipate.</h3>
            <p>Give useful information before it’s needed.</p>

            <h3>Orient.</h3>
            <p>Help travellers understand unfamiliar environments.</p>

            <h3>Experience.</h3>
            <p>Use sound, touch, smell, movement, temperature and emotion — not simply visual description.</p>

            <h3>Translate.</h3>
            <p>Provide visual context when it genuinely adds meaning.</p>

            <h3>Facilitate.</h3>
            <p>Prepare the environment and tourism providers so the guide doesn’t always have to be the intermediary.</p>

            <h3>Slow.</h3>
            <p>Create enough time for the experience to actually happen.</p>

            <p>And through all of them:</p>
            <p>Choice.</p>
            <p>Because we don’t believe there’s one correct way to travel blind.</p>
            <p>Read more <L to="/sobre-nosotras">about Watchout Tours and how we started</L>.</p>
          </section>

          <section aria-labelledby="btnz-not-for-you-heading">
            <h2 id="btnz-not-for-you-heading">We don’t want to travel New Zealand for you</h2>
            <p>We want to create the conditions for you to experience it.</p>
            <p>Sometimes that means guiding.</p>
            <p>Sometimes describing.</p>
            <p>Sometimes asking an operator to do something differently.</p>
            <p>Sometimes helping you build a mental map of a new place.</p>
            <p>Sometimes finding something you can touch.</p>
            <p>And sometimes it means getting out of the way.</p>
            <p>We’re still learning.</p>
            <p>Every traveller will teach us something new.</p>
            <p>Every journey will change the way we do the next one.</p>
            <p>And perhaps that’s exactly how accessible travel should evolve.</p>
            <p>Not by assuming what people need.</p>
            <p>By travelling together, asking, listening and designing better.</p>
            <p>This guide is about our travel experience; for details on how this website itself is built to be accessible, see our <L to="/accesibilidad">website accessibility statement</L>.</p>
          </section>

          {/* ── FAQ (preparado para GEO/AEO) ─────────────────────────── */}
          <section aria-labelledby="btnz-faq-heading">
            <h2 id="btnz-faq-heading">Frequently Asked Questions</h2>

            <div className="btnz-faq-item">
              <h3>Can I travel to New Zealand without a sighted companion?</h3>
              <p>Potentially, yes. The appropriate level of support depends on the traveller, itinerary and type of trip. A specialist guided trip can provide orientation and assistance without requiring you to bring your own companion.</p>
            </div>

            <div className="btnz-faq-item">
              <h3>How independent do I need to be?</h3>
              <p>There isn’t one universal level of independence for blind travellers. Before travelling, it’s important to discuss mobility, orientation, communication, personal care and the type of assistance you normally use so expectations are clear on both sides.</p>
            </div>

            <div className="btnz-faq-item">
              <h3>Can blind travellers participate in adventure activities in New Zealand?</h3>
              <p>Many activities may be possible, but accessibility varies considerably between providers and individuals. Eligibility and safety requirements should always be confirmed directly for the specific traveller and activity.</p>
            </div>

            <div className="btnz-faq-item">
              <h3>How can a blind traveller experience New Zealand’s landscapes?</h3>
              <p>Landscape isn’t only visual. Sound, water, wind, temperature, texture, smell, movement and spatial awareness can all contribute to understanding a place. Visual description can then provide additional context where useful.</p>
            </div>

            <div className="btnz-faq-item">
              <h3>Will everything be described to me?</h3>
              <p>That’s something travellers and guides should agree on. Our experience has taught us that continuous description isn’t always desirable. Sometimes context before an experience and conversation afterwards allow the traveller to enjoy the sounds and sensations while it is happening.</p>
            </div>

            <div className="btnz-faq-item">
              <h3>Is New Zealand completely accessible for blind travellers?</h3>
              <p>No destination is uniformly accessible. Experiences vary between transport providers, accommodation, attractions and individual locations. Preparation and direct communication with providers can make a substantial difference.</p>
            </div>
          </section>

          {/* ── CTA discreto ─────────────────────────────────────────── */}
          <div className="btnz-cta">
            <p className="btnz-cta-lead">Thinking about experiencing New Zealand beyond sight?</p>
            <p>Explore how Watchout is designing small-group journeys for blind and low-vision travellers.</p>
            <div className="cta-row">
              <L to="/productos" className="btn btn-solid">Explore Watchout journeys</L>
            </div>
          </div>

          {/* ── Recursos externos: sección claramente secundaria ─────── */}
          <section aria-labelledby="btnz-sources-heading" className="btnz-sources">
            <h2 id="btnz-sources-heading">Useful New Zealand accessibility resources</h2>
            <p>These external resources are provided for general trip planning and are not part of our pilot journey account:</p>
            <ul>
              <li>
                <a href="https://www.nzta.govt.nz/travelling-on-our-roads/public-transport/travelling-with-a-disability/" target="_blank" rel="noopener noreferrer">
                  New Zealand Transport Agency (Waka Kotahi): travelling with a disability
                </a>
              </li>
              <li>
                <a href="https://www.airnewzealand.com/special-assistance-blind-and-visually-impaired" target="_blank" rel="noopener noreferrer">
                  Air New Zealand — assistance for blind and visually impaired passengers
                </a>
              </li>
              <li>
                <a href="https://blindlowvision.org.nz/" target="_blank" rel="noopener noreferrer">
                  Blind Low Vision NZ
                </a>
              </li>
              <li>
                <a href="https://www.msd.govt.nz/about-msd-and-our-work/work-programmes/accessibility/quick-reference-guides/disability-etiquette.html" target="_blank" rel="noopener noreferrer">
                  New Zealand Ministry of Social Development: disability etiquette guide
                </a>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </>
  )
}
