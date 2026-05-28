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
          <h2 id="eventtyper-heading">Hvor vi ofte ender</h2>
          <p className="event-section__intro">
            Fra morgenmøde til marked. Passer jeres dag ikke i en boks, skriv
            alligevel - det plejer vi at finde ud af. Kaffemaskinen tager vi med.
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
            Fortæl om jeres dag
          </PageLink>
        </p>
      </div>
    </section>
  )
}
