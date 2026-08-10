# DD Cleaning Services — website

Static marketing site for DD Cleaning Services — commercial and residential
cleaning across Illinois (Carol Stream, Wheaton, Burr Ridge) and Virginia
(Glen Allen, Woodbridge).

Plain HTML, CSS and JavaScript. No framework, no runtime dependencies, nothing
to install on the server — upload the folder and it works.

---

## Before it goes live — 4 things to fix

These are the only known blockers. Everything else is finished.

### 1. Replace the placeholder contact details

Every phone number on the site is currently in the **555-01xx range, which is
reserved for fiction** — deliberately, so a placeholder can never dial a real
person. They are obviously fake and must be replaced.

Open `tools/data.js` and set:

| Value | Where | Currently |
|---|---|---|
| `BUSINESS.phone` / `phoneHref` / `smsHref` / `phoneDigits` | main number, used sitewide | `(630) 555-0142` |
| `BUSINESS.email` | header, footer, contact page | `hello@ddcleaningservices.com` |
| `REGIONS[0].phone` / `phoneHref` | Illinois dispatch | `(630) 555-0142` |
| `REGIONS[1].phone` / `phoneHref` | Virginia dispatch | `(804) 555-0119` |
| `BUSINESS.founded` | About page, schema | `2018` — confirm the real year |

Then run `node tools/build.js`.

If there is only one number for both regions, set both `REGIONS[*].phone`
entries to it — the layout is identical either way.

### 2. Set the real domain

`tools/data.js` → `BUSINESS.domain` is currently a guess:

```js
domain: 'https://ddcleaningservices.com',
```

This value builds every canonical URL, every Open Graph tag and `sitemap.xml`.
If it is wrong when the site is indexed, the SEO work is wasted. Set it to the
real domain and rebuild before launch.

### 3. Connect the quote form

The form is fully built and validated but not wired to an inbox. Connect it in
about two minutes:

1. Go to [web3forms.com](https://web3forms.com), enter the owner's email, get a
   free access key.
2. In `tools/components.js`, find `REPLACE_WITH_WEB3FORMS_ACCESS_KEY` and paste
   the key in.
3. Run `node tools/build.js`.

Until that is done the form does not fail silently — it validates as normal,
then tells the visitor it is not connected yet and gives them the phone number
instead.

Any endpoint that accepts a `POST` of `FormData` and returns `{"success":true}`
works; Formspree and Basin are drop-in alternatives.

### 4. Add real reviews

`tools/data.js` → `REVIEWS` is an **empty array on purpose**, and the reviews
section renders an honest "nothing here yet" note rather than filler.

The reference site prints four testimonials with no verifiable source.
Publishing invented testimonials for a real business breaks the FTC rule on
fake endorsements (16 CFR Part 465), so none of it was copied.

To add genuine ones, paste them into `REVIEWS` and rebuild:

```js
const REVIEWS = [
    {
        name: 'First name L.',
        location: 'Wheaton, IL',
        source: 'Google',
        stars: 5,
        body: 'Their actual words, copied from the live listing.'
    }
];
```

`RATINGS` is empty for the same reason — fill it in once there are live Google
or Facebook listings to link to.

---

## Editing content

**All copy, services, towns, FAQs and reviews live in `tools/data.js`.**
Edit that one file, then rebuild:

```bash
node tools/build.js
```

That regenerates all 13 HTML pages plus `sitemap.xml`, `robots.txt` and
`site.webmanifest`. Never hand-edit the generated `.html` files — the next build
overwrites them.

| File | What it holds |
|---|---|
| `tools/data.js` | Business details, regions, services, towns, reasons, FAQs, reviews |
| `tools/layout.js` | Shared `<head>`, top bar, header, nav, footer, CTA band, icons |
| `tools/components.js` | Reusable blocks — hero, cards, coverage, quote form, FAQ |
| `tools/build.js` | Page definitions, structured data, file writer |
| `assets/css/main.css` | All styling |
| `assets/js/main.js` | All behaviour |

Node is only needed to *rebuild*. The published site does not use it.

### Adding a service

Append an object to `SERVICES` in `tools/data.js`. It automatically appears in
the nav dropdown, the homepage grid, the services page, the footer, every town
page, the contact form's service picker and the `OfferCatalog` structured data.

`icon` must be a key in the `ICONS` map in `tools/layout.js`; `gradient` is one
of `a`–`f` (defined at the bottom of the service-cards block in `main.css`).

### Adding a town

Append an object to `CITIES` with a `regionSlug` of `illinois` or `virginia`.
A full landing page is generated for it, and it is linked from the nav, the
footer, the coverage blocks and every other town page.

---

## Local preview

```bash
cd dd-cleaning-services
python3 -m http.server 8912
# open http://127.0.0.1:8912
```

Use a server rather than opening the files directly — the fonts need proper
HTTP headers.

---

## Deploying

The folder is the site. Upload everything except `tools/` and `README.md`.

- **GitHub Pages** — push and serve from the repo root. `.nojekyll` is already
  present so asset folders are served verbatim.
- **Netlify / Vercel / Cloudflare Pages** — drag the folder in. No build command,
  publish directory `.`. `404.html` is picked up automatically.
- **Traditional host (cPanel, Hostinger, GoDaddy)** — upload to `public_html/`.

After deploying, submit `https://yourdomain.com/sitemap.xml` in Google Search
Console, and make sure the Google Business Profile lists the same phone number
and the new domain.

---

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, services, why us, process, coverage, reviews, FAQ |
| `services.html` | All six services in detail |
| `about.html` | The company, features, process, coverage |
| `reviews.html` | Reviews (honest empty state until real ones exist) |
| `faq.html` | 12 questions with `FAQPage` structured data |
| `service-areas.html` | Both regions and all five towns |
| `contact.html` | Quote request form with validation |
| `areas/*.html` | Five town landing pages |
| `404.html` | Not found |

The five town pages are what compete for searches like *"office cleaning
Wheaton"* or *"carpet cleaning Glen Allen"*. Each has its own copy,
neighbourhood list, lead time and `Service` + `BreadcrumbList` structured data —
they are not clones with the town name swapped.

---

## Design

Purple and pink throughout, per the brief. The palette is defined once as custom
properties at the top of `main.css` (`--violet-*`, `--pink-*`, `--grad`) — change
those and the whole site follows, including the six per-service card gradients.

Structure follows the reference site (scs.org.pk): rotating hero, overlapping
info strip, welcome block, services grid, full-width CTA bands, "why choose us",
testimonials, booking form and a link-dense footer.

### Imagery

Seven photographs in `assets/img/work/`, one per service plus a hero backdrop.
Each is served at two sizes (`-700.jpg` and full) via `srcset`, lazy-loaded
below the fold, and carries a brand gradient tint so six photos of different
colour temperature still read as one set. Total weight is about 1.6 MB.

**Licensing.** Every photo is **CC0 / public domain**, sourced from StockSnap
via the Openverse API. CC0 permits commercial use and modification with no
attribution required, so nothing on the page needs a credit line. The
provenance is recorded in `tools/photo-credits.json` in case you ever need to
evidence it.

**These are stand-ins, and you should replace them.** They show clean spaces
and one mop; none of them are your crews, your vans or your finished jobs.
Photographs of your own work will lift this site more than any other single
change, and they cost nothing but a phone camera.

To swap one, drop a new file into `assets/img/work/` using the same base name
(e.g. `carpet-cleaning.jpg` plus a 700px-wide `carpet-cleaning-700.jpg`) and
rebuild. To resize a photo to match:

```bash
sips -s format jpeg -s formatOptions 72 -Z 1400 source.jpg --out carpet-cleaning.jpg
sips -s format jpeg -s formatOptions 68 -Z 700  source.jpg --out carpet-cleaning-700.jpg
```

Update the `alt` text in `tools/data.js` at the same time — it describes the
photo for screen readers and for search engines.

If a service has no `image` key in `tools/data.js`, the layout falls back to
the original gradient-and-icon panel on its own, so nothing breaks while you
are part-way through replacing them.

### Motion

The coloured bands are not still. Each carries three blurred colour blobs
drifting on long offset cycles (the "aurora"), a fixed grain texture, floating
bubbles on three different motion paths, and — on the hero — a slow diagonal
light sweep and a very gradual Ken Burns push on the background photo. The
light sections carry a much fainter version of the same colour drift.

The grain does more work than it looks like it should: a pure CSS gradient is
mathematically smooth, and that smoothness is most of what makes a page read as
machine-made. A little noise breaks it.

All of it is disabled under `prefers-reduced-motion`, which keeps the aurora
and grain as static colour but stops every animation and hides the bubbles.

Brand assets in `assets/img/brand/` are generated from `logo.svg` — if you change
the logo, re-export `favicon-64.png`, `apple-touch-icon.png`, `icon-512.png` and
`og-image.png` to match.

---

## Notes on the build

- Fonts (Montserrat + Inter) are **self-hosted**, 84 KB total. No Google Fonts
  request, so first paint never waits on a third-party server and there is no
  third-party cookie or GDPR question.
- Structured data deliberately omits `aggregateRating`. Google's policy does not
  allow a business to mark up review scores it collected from third-party sites
  as its own — doing it risks a manual action.
- Content is visible without JavaScript. Scroll animations are gated behind a
  `js` class set in `<head>`, so if a script is blocked the page still reads, and
  a timeout reveals everything if the observer never fires.
- Accessibility: skip link, focus-visible rings, keyboard-operable dropdowns and
  accordion, `aria-expanded` on all toggles, `aria-current` on the active nav
  item and slider dot, and a `prefers-reduced-motion` block that disables every
  animation and the floating bubbles.
- The quote form has a honeypot field, client-side validation with per-field
  error messages, and never reports success it did not get.
