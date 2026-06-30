/**
 * Clip square logo sources to a circle (e.g. Facebook OG badge on black canvas).
 */

function sampleLum(pixels, x, y, width, channels) {
  const o = (y * width + x) * channels
  const r = pixels[o]
  const g = pixels[o + 1]
  const b = pixels[o + 2]
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/** True when corner pixels are dark (black matte outside a circular badge). */
export function isBlackMatteSource(pixels, width, height, channels = 4) {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ]
  let dark = 0
  for (const [x, y] of corners) {
    if (sampleLum(pixels, x, y, width, channels) < 42) dark++
  }
  return dark >= 3
}

export function applyCircularMaskTransparency(pixels, width, height, channels = 4) {
  const cx = (width - 1) / 2
  const cy = (height - 1) / 2
  const radius = Math.min(width, height) / 2 - 0.5
  const feather = 1.25

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * channels
      const dist = Math.hypot(x - cx, y - cy)

      if (dist > radius + feather) {
        pixels[o + 3] = 0
        continue
      }

      if (dist > radius - feather) {
        const t = (radius + feather - dist) / (2 * feather)
        pixels[o + 3] = Math.round(255 * Math.max(0, Math.min(1, t)))
      }
    }
  }
}
