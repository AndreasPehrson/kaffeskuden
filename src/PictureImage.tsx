import type { CSSProperties } from 'react'
import { imagesWithWebp } from './content/assets'

type PictureImageProps = {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/** JPEG in src; WebP sibling only when listed in `imagesWithWebp`. */
export function PictureImage({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  fetchPriority,
}: PictureImageProps) {
  const img = (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
    />
  )

  if (!imagesWithWebp.has(src)) {
    return img
  }

  const webpSrc = src.replace(/\.jpe?g$/i, '.webp')

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      {img}
    </picture>
  )
}
