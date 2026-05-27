import { galleryGrid, galleryLead } from '../content/gallery'
import { PictureImage } from '../PictureImage'
import './PhotoGallery.css'

export function PhotoGallery() {
  return (
    <div className="photo-gallery">
      <figure className="photo-gallery__lead">
        <PictureImage
          src={galleryLead.src}
          alt={galleryLead.alt}
          className="photo-gallery__img"
          style={galleryLead.focal ? { objectPosition: galleryLead.focal } : undefined}
          loading="eager"
        />
      </figure>
      <ul className="photo-gallery__grid">
        {galleryGrid.map((photo) => (
          <li key={photo.id}>
            <figure className="photo-gallery__cell">
              <PictureImage
                src={photo.src}
                alt={photo.alt}
                className="photo-gallery__img"
                style={photo.focal ? { objectPosition: photo.focal } : undefined}
              />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
