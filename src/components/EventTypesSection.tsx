import { eventTypes } from '../content/events'
import { PageLink } from './PageLink'

export function EventTypesSection() {
  return (
    <section
      id="eventtyper"
      className="section event-section"
      aria-labelledby="eventtyper-heading"
    >
      <div className="shell event-section__inner">
        <header className="event-section__head section-head">
          <p className="eyebrow">Eventtyper</p>
          <h2 id="eventtyper-heading">Det meste kan vi klare</h2>
          <p className="event-section__intro">
            Vi ruller ud til mange slags dage. Her er dem, vi oftest bliver spurgt om -
            men tøv ikke med at skrive, hvis jeres idé ikke står på listen.
          </p>
        </header>

        <ul className="event-cards">
          {eventTypes.map((event) => (
            <li key={event.id}>
              <article className="event-card">
                <span className="event-card__label">{event.label}</span>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </article>
            </li>
          ))}
        </ul>

        <p className="event-section__foot">
          <PageLink className="event-section__link" to="/#kontakt">
            Fortæl os om jeres dag
          </PageLink>
        </p>
      </div>
    </section>
  )
}
