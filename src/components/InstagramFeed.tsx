import { instagramFeed, instagramProfileUrl } from '../content/instagram'
import { PictureImage } from '../PictureImage'
import './InstagramFeed.css'

function formatUpdated(iso: string | null) {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('da-DK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return null
  }
}

export function InstagramFeed() {
  const updatedLabel = instagramFeed.isLive
    ? formatUpdated(instagramFeed.updatedAt)
    : null

  return (
    <section
      id="instagram"
      className="instagram-feed section"
      aria-labelledby="instagram-feed-heading"
    >
      <header className="shell section-head instagram-feed__head">
        <p className="eyebrow">Instagram</p>
        <h2 id="instagram-feed-heading">Fra @{instagramFeed.username}</h2>
        <p>
          {instagramFeed.isLive
            ? 'Fra livet på hjul - events, små rejser og det, der sker mellem to kopper.'
            : 'Et glimt fra hverdagen på skuden. Følg med på Instagram for det nyeste.'}
        </p>
        {updatedLabel && (
          <p className="instagram-feed__meta">Opdateret {updatedLabel}</p>
        )}
        <a
          className="instagram-feed__cta"
          href={instagramProfileUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          Følg @{instagramFeed.username}
        </a>
      </header>

      <div className="shell instagram-feed__frame">
        <ul className="instagram-feed__grid">
          {instagramFeed.posts.map((post) => (
            <li key={post.id}>
              <a
                className="instagram-feed__card"
                href={post.permalink}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={
                  post.caption
                    ? `Åbn på Instagram: ${post.caption}`
                    : 'Åbn på Instagram'
                }
              >
                <figure className="instagram-feed__figure">
                  <PictureImage
                    src={post.image}
                    alt=""
                    className="instagram-feed__img"
                    loading="lazy"
                  />
                </figure>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
