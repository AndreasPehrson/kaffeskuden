# Instagram on the site

We show a live **Instagram wall** on **Vores rejser** via [RSS.app](https://rss.app/).

## Embed

The wall ID is in `src/content/instagram.ts` (`mHpktXDGwxwACyOr`). To use another wall, set in `.env`:

```env
VITE_RSSAPP_WALL_ID=your_wall_id_here
```

Restart the dev server after changing `.env`.

## Production (GitHub Pages)

No secret is required unless you override the wall ID. To do that, add repository secret `VITE_RSSAPP_WALL_ID` — the deploy workflow passes it into the build.

In the RSS.app dashboard, allow your domain if the widget asks for it:

- `kaffeskuden.dk`
- `www.kaffeskuden.dk`

## Styling

The site wraps the wall in a framed section and injects light theme CSS into the widget shadow root (responsive grid, square images, no duplicate caption body).

For the cleanest result, also tune the wall in **RSS.app**:

- Prefer a **grid** or **wall** layout (not a long single-column feed)
- Limit post count (e.g. 6–9) so the section stays scannable
- Turn off long descriptions in the card template if the dashboard offers it

Captions still come from Instagram; phrases like “Vi kaffes ved” can only be removed by editing or deleting those posts on Instagram.

## Alternative: self-hosted fetch (optional)

`npm run fetch-instagram` + `INSTAGRAM_ACCESS_TOKEN` still exists if you later want images in `public/` without a third-party widget. The live section uses RSS.app only.
