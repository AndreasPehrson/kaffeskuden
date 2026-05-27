import type { JourneyChapter } from '../content/journeys'
import { PictureImage } from '../PictureImage'

type JourneySplitProps = {
  chapter: JourneyChapter
  reverse?: boolean
}

export function JourneySplit({ chapter, reverse = false }: JourneySplitProps) {
  return (
    <article
      id={chapter.id}
      className={`journey-split shell${reverse ? ' journey-split--reverse' : ''}`}
    >
      <div className="journey-split__media">
        <PictureImage
          src={chapter.image}
          alt={chapter.imageAlt}
          className="journey-split__image"
        />
      </div>
      <div className="journey-split__content">
        <p className="eyebrow">{chapter.step}</p>
        <h2>{chapter.title}</h2>
        <p className="journey-split__lead">{chapter.lead}</p>
        <p>{chapter.body}</p>
      </div>
    </article>
  )
}
