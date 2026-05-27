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
          <h1>Rejser efter god kaffe</h1>
          <p className="lead">
            Her samler vi historier fra farme, risterier og vejen hjem til skuden.
            Mere indhold kommer løbende.
          </p>
          <div className="subpage-hero__actions">
            <a className="ghost" href="#rejser">
              Læs videre
            </a>
            <a className="cta" href="#instagram">
              Se billeder
            </a>
          </div>
        </div>
      </header>

      <div className="journeys-intro shell" id="rejser">
        <p className="eyebrow">Fra farm til kop</p>
        <h2>Sådan finder vi bønnerne</h2>
        <p>
          Det er ikke én stor mission. Det er en række små besøg, smagninger og
          samtaler - skrevet ned her, som de kommer.
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
          <h2>Klar til en kop?</h2>
          <p>Book os til jeres næste event - eller skriv, hvis I vil høre mere om bønnerne.</p>
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
