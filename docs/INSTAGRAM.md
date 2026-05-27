# Instagram on the site

The **Vores rejser** page shows a native photo grid (no third-party widget). Posts come from `src/content/instagram-feed.json` and images in `public/images/instagram/`.

## Live feed (recommended)

1. Use a **Instagram Business or Creator** account for @kaffeskuden.
2. Create a Meta app and a long-lived **Instagram Graph API** access token.
3. Add to `.env` (see `.env.example`):

   ```env
   INSTAGRAM_ACCESS_TOKEN=your_token
   ```

4. Run:

   ```bash
   npm run fetch-instagram
   npm run optimize-images
   ```

5. Commit the updated `instagram-feed.json` and downloaded JPEGs under `public/images/instagram/`.

The build shows up to **6** recent posts. Re-run fetch when you want the site grid refreshed (locally or in CI with `INSTAGRAM_ACCESS_TOKEN` as a GitHub secret).

## Before the first fetch

If the manifest has no posts, the section shows a **curated teaser grid** (site photos linking to the Instagram profile). After a successful fetch, copy and dates come from Instagram automatically.

## CI (optional)

To refresh on deploy, add repository secret `INSTAGRAM_ACCESS_TOKEN` and run `npm run fetch-instagram` before `npm run build` in `.github/workflows/deploy.yml`. Tokens expire — refreshing in CI only works if you renew the secret when Meta expires it.

## Captions

Captions are trimmed in the fetch script (280 characters). Edit posts on Instagram if you need shorter text on the site.
