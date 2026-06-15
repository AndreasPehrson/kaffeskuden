/**
 * Remove only the outer white JPEG matte by flood-filling from image edges.
 * White inside the logo (text, steam, highlights) stays opaque.
 */

function pixelLumChroma(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const chroma = Math.max(r, g, b) - Math.min(r, g, b)
  return { lum, chroma }
}

/** Solid black ring / logo ink - flood cannot pass through. */
function isLogoBarrier(r, g, b) {
  const { lum, chroma } = pixelLumChroma(r, g, b)
  return lum < 88 || (lum < 115 && chroma < 28)
}

/** White JPEG matte reachable from image edges. */
export function isOuterMattePixel(r, g, b) {
  const { lum, chroma } = pixelLumChroma(r, g, b)
  return lum >= 232 && chroma < 22
}

/** Light neutral areas outside the logo (matte, gray or white JPEG halo). */
function isOutsideBackground(r, g, b) {
  const { lum, chroma } = pixelLumChroma(r, g, b)
  return lum >= 105 && chroma < 42
}

function floodExterior(pixels, width, height, channels) {
  const n = width * height
  const exterior = new Uint8Array(n)
  const queue = new Int32Array(n)
  let head = 0
  let tail = 0

  const tryPush = (x, y) => {
    const p = y * width + x
    if (exterior[p]) return
    const o = p * channels
    const r = pixels[o]
    const g = pixels[o + 1]
    const b = pixels[o + 2]
    if (isLogoBarrier(r, g, b)) return
    if (!isOutsideBackground(r, g, b)) return
    exterior[p] = 1
    queue[tail++] = p
  }

  for (let x = 0; x < width; x++) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  for (let y = 1; y < height - 1; y++) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  while (head < tail) {
    const p = queue[head++]
    const x = p % width
    const y = (p / width) | 0
    if (x > 0) tryPush(x - 1, y)
    if (x < width - 1) tryPush(x + 1, y)
    if (y > 0) tryPush(x, y - 1)
    if (y < height - 1) tryPush(x, y + 1)
  }

  return exterior
}

function floodLogoArtwork(pixels, width, height, channels) {
  const n = width * height
  const logo = new Uint8Array(n)
  const queue = new Int32Array(n)
  let head = 0
  let tail = 0
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  const coreRadius = Math.min(width, height) * 0.36

  const topCap = Math.round(height * 0.11)

  const tryPush = (x, y) => {
    const p = y * width + x
    if (logo[p]) return
    const dist = Math.hypot(x - cx, y - cy)
    if (y < topCap && dist > coreRadius) return
    const o = p * channels
    if (isLogoBarrier(pixels[o], pixels[o + 1], pixels[o + 2])) return
    logo[p] = 1
    queue[tail++] = p
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.hypot(x - cx, y - cy)
      const inTextBand = y >= 19 && y <= 36 && x >= 42 && x <= 108
      if (dist > coreRadius && !inTextBand) continue
      tryPush(x, y)
    }
  }

  while (head < tail) {
    const p = queue[head++]
    const x = p % width
    const y = (p / width) | 0
    if (x > 0) tryPush(x - 1, y)
    if (x < width - 1) tryPush(x + 1, y)
    if (y > 0) tryPush(x, y - 1)
    if (y < height - 1) tryPush(x, y + 1)
  }

  return logo
}

/** Drop mis-tagged halo pixels on the logo flood boundary. */
function peelLogoSpill(remove, logo, pixels, width, height, channels) {
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  const coreRadius = Math.min(width, height) * 0.36
  for (let pass = 0; pass < 10; pass++) {
    let changed = false
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (remove[p]) continue

        const o = p * channels
        if (isLogoBarrier(pixels[o], pixels[o + 1], pixels[o + 2])) continue
        if (!logo[p] && !isOutsideBackground(pixels[o], pixels[o + 1], pixels[o + 2])) continue

        let touchesRemoved = false
        const neighbors = [
          x > 0 ? p - 1 : -1,
          x < width - 1 ? p + 1 : -1,
          y > 0 ? p - width : -1,
          y < height - 1 ? p + width : -1,
        ]
        for (const np of neighbors) {
          if (np >= 0 && remove[np]) touchesRemoved = true
        }
        if (!touchesRemoved) continue

        const { lum } = pixelLumChroma(pixels[o], pixels[o + 1], pixels[o + 2])
        const dist = Math.hypot(x - cx, y - cy)
        if (isProtectedTextPixel(x, y, lum, width, height)) continue
        if (dist <= coreRadius && lum < 205) continue

        remove[p] = 1
        changed = true
      }
    }
    if (!changed) break
  }
}

function isProtectedTextPixel(x, y, lum, width, height) {
  const textTop = Math.round(height * 0.12)
  const textBottom = Math.round(height * 0.24)
  const textLeft = Math.round(width * 0.28)
  const textRight = Math.round(width * 0.72)
  return (
    y >= textTop &&
    y <= textBottom &&
    x >= textLeft &&
    x <= textRight &&
    lum >= 236
  )
}

/** Trim light pixels outside the core disk that touch transparency. */
function peelOuterDiskFringe(remove, pixels, width, height, channels) {
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  const coreRadius = Math.min(width, height) * 0.36

  for (let pass = 0; pass < 14; pass++) {
    let changed = false
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (remove[p]) continue

        const dist = Math.hypot(x - cx, y - cy)
        if (dist <= coreRadius) continue

        const o = p * channels
        if (isLogoBarrier(pixels[o], pixels[o + 1], pixels[o + 2])) continue

        const { lum, chroma } = pixelLumChroma(pixels[o], pixels[o + 1], pixels[o + 2])
        if (lum < 108 || chroma >= 45) continue
        if (isProtectedTextPixel(x, y, lum, width, height)) continue

        let touchesRemoved = false
        const neighbors = [
          x > 0 ? p - 1 : -1,
          x < width - 1 ? p + 1 : -1,
          y > 0 ? p - width : -1,
          y < height - 1 ? p + width : -1,
        ]
        for (const np of neighbors) {
          if (np >= 0 && remove[np]) touchesRemoved = true
        }
        if (!touchesRemoved) continue

        remove[p] = 1
        changed = true
      }
    }
    if (!changed) break
  }
}

/** Light fringe sitting between removed matte and the black ring. */
function peelEdgeHalo(remove, pixels, width, height, channels) {
  for (let pass = 0; pass < 8; pass++) {
    let changed = false
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const p = y * width + x
        if (remove[p]) continue

        const o = p * channels
        const { lum, chroma } = pixelLumChroma(pixels[o], pixels[o + 1], pixels[o + 2])
        if (lum < 118 || chroma >= 40) continue
        if (isProtectedTextPixel(x, y, lum, width, height)) continue

        let touchesBarrier = false
        let touchesRemoved = false
        const neighbors = [
          x > 0 ? p - 1 : -1,
          x < width - 1 ? p + 1 : -1,
          y > 0 ? p - width : -1,
          y < height - 1 ? p + width : -1,
        ]

        for (const np of neighbors) {
          if (np < 0) continue
          if (remove[np]) touchesRemoved = true
          const no = np * channels
          if (isLogoBarrier(pixels[no], pixels[no + 1], pixels[no + 2])) touchesBarrier = true
        }

        if (touchesBarrier && touchesRemoved) {
          remove[p] = 1
          changed = true
        }
      }
    }
    if (!changed) break
  }
}

export function applyOuterMatteTransparency(pixels, width, height, channels = 4) {
  const n = width * height
  const remove = new Uint8Array(n)
  const exterior = floodExterior(pixels, width, height, channels)
  const logo = floodLogoArtwork(pixels, width, height, channels)

  for (let p = 0; p < n; p++) {
    const o = p * channels
    const r = pixels[o]
    const g = pixels[o + 1]
    const b = pixels[o + 2]

    if (isLogoBarrier(r, g, b)) continue
    if (logo[p]) continue
    if (exterior[p] || isOutsideBackground(r, g, b)) {
      remove[p] = 1
    }
  }

  peelLogoSpill(remove, logo, pixels, width, height, channels)
  peelOuterDiskFringe(remove, pixels, width, height, channels)
  peelEdgeHalo(remove, pixels, width, height, channels)

  for (let p = 0; p < n; p++) {
    pixels[p * channels + 3] = remove[p] ? 0 : 255
  }
}
