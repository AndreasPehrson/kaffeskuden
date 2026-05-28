import { journeyChapters } from '../content/journeys'
import { images } from '../content/assets'
import { JourneySplit } from '../components/JourneySplit'
import { PageLink } from '../components/PageLink'
import { InstagramFeed } from '../components/InstagramFeed'
import { PictureImage } from '../PictureImage'
import './journeys.css'

export function VoresRejserPage() {
  return (
    <main id="indhold">
      <header className="subpage-hero">
        <div className="subpage-hero__media" aria-hidden="true">
          <PictureImage
            src={images.beans}
            alt=""
            loading="eager"
            fetchPriority="high"
          />
          <div className="subpage-hero__scrim" />
        </div>
        <div className="shell subpage-hero__copy">
          <PageLink className="link-back" to="/">
            Til forsiden
          </PageLink>
          <p className="tag">Vores rejser</p>
          <h1>Vores rejser</h1>
          <p className="lead">
            Smagninger, farme og folk bag bønnerne – og vejen hjem til skuden. Det
            her er vores notesbog undervejs.
          </p>
          <div className="subpage-hero__actions">
            <a className="cta" href="#instagram">
              Se billeder
            </a>
            <a className="ghost" href="#rejser">
              Læs videre
            </a>
          </div>
        </div>
      </header>

      <div className="journeys-intro shell" id="rejser">
        <p className="eyebrow">Fra farm til kop</p>
        <h2>Sådan vælger vi bønner</h2>
        <p>
          Ingen stor missionsskrift – bare besøg, noter og det, der til sidst ender
          i espressomaskinen.
        </p>
      </div>

      <div className="journey-splits">
        {journeyChapters.map((chapter, index) => (
          <JourneySplit key={chapter.id} chapter={chapter} reverse={index % 2 === 1} />
        ))}
      </div>

      <InstagramFeed />

      <section className="journeys-cta">
        <div className="shell">
          <h2>Skal vi køre forbi?</h2>
          <p>
            Book os til næste event – eller skriv, hvis I vil høre mere om bønnerne
            bag kaffen.
          </p>
          <PageLink className="link-arrow" to="/#kontakt">
            Skriv til os
          </PageLink>
        </div>
      </section>

      <footer className="site-footer site-footer--light">
        <div className="shell">
          <p>© {new Date().getFullYear()} Kaffeskuden - kaffe på hjul i Danmark.</p>
        </div>
      </footer>
    </main>
  )
}
