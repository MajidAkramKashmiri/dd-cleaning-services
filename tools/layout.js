/**
 * Shared page chrome. Every page is assembled from these pieces so the nav,
 * footer, schema and meta tags can never drift apart across the site.
 *
 * Paths are written root-relative ("/services.html") in page data and rewritten
 * here relative to the page's own depth, so the site also works when opened
 * straight off disk or served from a subfolder.
 */

const { BUSINESS, NAV, CITIES, REGIONS, SERVICES } = require('./data');

/** Rewrite a root-relative path for a page nested `depth` folders deep. */
function rel(path, depth) {
    if (!path.startsWith('/')) {
        return path;
    }
    const trimmed = path.slice(1);
    return depth === 0 ? trimmed : '../'.repeat(depth) + trimmed;
}

function esc(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* --------------------------------------------------------------------------
   Icons — inline so there is no sprite request and they inherit currentColor
   -------------------------------------------------------------------------- */
const S = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const ICONS = {
    phone: `<svg viewBox="0 0 24 24" ${S}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" ${S}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M3 6.5l9 6 9-6"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" ${S}><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" ${S}><path d="M12 2l8 3.5v6c0 4.8-3.4 9.2-8 10.5-4.6-1.3-8-5.7-8-10.5v-6z"/><path d="M9 12l2 2 4-4"/></svg>`,
    spray: `<svg viewBox="0 0 24 24" ${S}><path d="M8.5 9h4.2A2.3 2.3 0 0 1 15 11.3v8.4a2.3 2.3 0 0 1-2.3 2.3H8.5a2.3 2.3 0 0 1-2.3-2.3v-8.4A2.3 2.3 0 0 1 8.5 9z"/><path d="M9.4 9V5.6h3.1"/><path d="M12.5 5.6h3.2"/><path d="M17.6 3.4l2.1.9M17.6 7.8l2.1-.9M18.6 5.6h2.1"/><path d="M6.2 13.6h8.8"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5.5 5.5L20 7"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    chevron: `<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M1 1l5 5 5-5"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.6.9-4.8 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.5 9.3l6.6-.9z"/></svg>`,
    quote: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.5 5C6.5 6.4 4.6 9.2 4.6 12.6V19h6.6v-6.6H7.9c0-2 .8-3.6 2.6-4.7zm9.9 0c-3 1.4-4.9 4.2-4.9 7.6V19h6.6v-6.6h-3.3c0-2 .8-3.6 2.6-4.7z"/></svg>`,
    users: `<svg viewBox="0 0 24 24" ${S}><circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.3a6.2 6.2 0 0 1 3.7 5.7"/></svg>`,
    leaf: `<svg viewBox="0 0 24 24" ${S}><path d="M4 20c0-8 5-13 16-14 0 10-4.5 15-11 15a5 5 0 0 1-5-1z"/><path d="M9 15c2.5-3 5.3-5 8.5-6.5"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M18.5 15l.8 2.6 2.7.9-2.7.9-.8 2.6-.8-2.6-2.7-.9 2.7-.9z" opacity=".7"/></svg>`,
    building: `<svg viewBox="0 0 24 24" ${S}><path d="M3 21h18"/><path d="M5 21V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V21"/><path d="M14 10h3.5A1.5 1.5 0 0 1 19 11.5V21"/><path d="M8 8h3M8 12h3M8 16h3M16.5 14h1M16.5 17.5h1"/></svg>`,
    desk: `<svg viewBox="0 0 24 24" ${S}><rect x="2.5" y="4.5" width="14" height="9.5" rx="1.6"/><path d="M6.5 18h6M9.5 14v4"/><path d="M18.5 20V9.5h3V20"/></svg>`,
    carpet: `<svg viewBox="0 0 24 24" ${S}><rect x="2.5" y="6.5" width="19" height="12" rx="2"/><path d="M2.5 10h19M2.5 15h19"/><path d="M8 6.5v12M15 6.5v12"/></svg>`,
    floor: `<svg viewBox="0 0 24 24" ${S}><path d="M2.5 20.5h19"/><path d="M6 20.5l2.6-8M18 20.5l-2.6-8M12 20.5v-8"/><path d="M8.3 12.5h7.4"/><path d="M9.4 16.5h5.2"/></svg>`,
    home: `<svg viewBox="0 0 24 24" ${S}><path d="M3.5 10.5L12 3.5l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5.5h4V20"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9V7.2c0-.8.2-1.2 1.4-1.2H17V3h-2.6C11.3 3 10.2 4.6 10.2 7v2H8v3h2.2v9H14v-9h2.6l.4-3z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>`,
    google: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"/><path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z"/></svg>`
};

/* --------------------------------------------------------------------------
   Head
   -------------------------------------------------------------------------- */
function head(page, depth) {
    const canonical = BUSINESS.domain + (page.path === '/index.html' ? '/' : page.path);
    const ogImage = BUSINESS.domain + '/assets/img/brand/og-image.png';

    return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}">
<meta name="theme-color" content="#6D28D9">
${page.geo || ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BUSINESS.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${esc(ogImage)}">

<link rel="icon" href="${rel('/assets/img/brand/favicon.svg', depth)}" type="image/svg+xml">
<link rel="icon" href="${rel('/assets/img/brand/favicon-64.png', depth)}" sizes="64x64" type="image/png">
<link rel="apple-touch-icon" href="${rel('/assets/img/brand/apple-touch-icon.png', depth)}">
<link rel="manifest" href="${rel('/site.webmanifest', depth)}">

<link rel="preload" as="font" type="font/woff2" href="${rel('/assets/fonts/montserrat-latin-var.woff2', depth)}" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${rel('/assets/fonts/inter-latin-var.woff2', depth)}" crossorigin>
<link rel="stylesheet" href="${rel('/assets/css/main.css', depth)}">
<script>document.documentElement.className+=' js';</script>
<script type="application/ld+json">
${JSON.stringify(page.schema, null, 2)}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>`;
}

/* --------------------------------------------------------------------------
   Header
   -------------------------------------------------------------------------- */
function header(page, depth) {
    const navLinks = NAV.map((item) => {
        const current = item.href === page.path ? ' aria-current="page"' : '';
        return `<a class="nav__link" href="${rel(item.href, depth)}"${current}>${esc(item.label)}</a>`;
    }).join('\n            ');

    const serviceLinks = SERVICES.map(
        (s) =>
            `<a href="${rel('/services.html#' + s.slug, depth)}"><span class="nav__ico">${ICONS[s.icon]}</span><span>${esc(
                s.title
            )}<span>${esc(s.kicker)}</span></span></a>`
    ).join('\n                    ');

    const cityLinks = REGIONS.map((region) => {
        const cities = CITIES.filter((c) => c.regionSlug === region.slug)
            .map(
                (city) =>
                    // Wrapped in an outer span so the county picks up the
                    // small secondary-line styling, same as the services panel.
                    `<a href="${rel('/areas/' + city.slug + '.html', depth)}"><span>${esc(
                        city.name
                    )}<span>${esc(city.county)}</span></span></a>`
            )
            .join('\n                        ');
        return `<div class="nav__group"><p class="nav__group-title">${esc(region.name)}</p>
                        ${cities}</div>`;
    }).join('\n                    ');

    const servicesOpen = page.path === '/services.html';
    const areasOpen = page.path.startsWith('/areas/') || page.path === '/service-areas.html';

    return `
<div class="topbar">
    <div class="wrap">
        <p class="topbar__item">${ICONS.clock}<span>${esc(BUSINESS.hours)}</span></p>
        <p class="topbar__item topbar__item--hide"> ${ICONS.shield}<span>${esc(BUSINESS.guarantee)}</span></p>
        <a class="topbar__item" href="mailto:${esc(BUSINESS.email)}">${ICONS.mail}<span>${esc(BUSINESS.email)}</span></a>
    </div>
</div>

<header class="site-header">
    <div class="wrap">
        <a class="brand" href="${rel('/index.html', depth)}">
            <img src="${rel('/assets/img/brand/logo.svg', depth)}" alt="" width="48" height="48" loading="eager">
            <span>
                <span class="brand__name">DD Cleaning</span>
                <span class="brand__tag">Services</span>
            </span>
        </a>

        <nav class="nav" id="site-nav" aria-label="Main">
            <a class="nav__link" href="${rel('/index.html', depth)}"${
                page.path === '/index.html' ? ' aria-current="page"' : ''
            }>Home</a>

            <span class="nav__item${servicesOpen ? ' is-current' : ''}">
                <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-haspopup="true"${
                    servicesOpen ? ' aria-current="page"' : ''
                }>Services ${ICONS.chevron}</button>
                <span class="nav__panel nav__panel--wide">
                    <a href="${rel('/services.html', depth)}"><span class="nav__ico">${
        ICONS.sparkle
    }</span><span>All services<span>Everything we do</span></span></a>
                    ${serviceLinks}
                </span>
            </span>

            <span class="nav__item${areasOpen ? ' is-current' : ''}">
                <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-haspopup="true"${
                    areasOpen ? ' aria-current="page"' : ''
                }>Service Areas ${ICONS.chevron}</button>
                <span class="nav__panel nav__panel--cols">
                    ${cityLinks}
                    <div class="nav__group nav__group--all">
                        <a href="${rel(
                            '/service-areas.html',
                            depth
                        )}"><span>All areas<span>Illinois &amp; Virginia</span></span></a>
                    </div>
                </span>
            </span>

            <a class="nav__link" href="${rel('/about.html', depth)}"${
        page.path === '/about.html' ? ' aria-current="page"' : ''
    }>About</a>
            <a class="nav__link" href="${rel('/reviews.html', depth)}"${
        page.path === '/reviews.html' ? ' aria-current="page"' : ''
    }>Reviews</a>
            <a class="nav__link" href="${rel('/faq.html', depth)}"${
        page.path === '/faq.html' ? ' aria-current="page"' : ''
    }>FAQ</a>
            <a class="nav__link" href="${rel('/contact.html', depth)}"${
        page.path === '/contact.html' ? ' aria-current="page"' : ''
    }>Contact</a>
        </nav>

        <div class="header-cta">
            <a class="header-phone" href="${BUSINESS.phoneHref}" data-cta="header-call">
                ${ICONS.phone}
                <span><span>Call us now</span><strong>${esc(BUSINESS.phone)}</strong></span>
            </a>
            <a class="btn btn--grad" href="${rel('/contact.html', depth)}" data-cta="header-quote">Free Quote</a>
            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">
                <span></span>
            </button>
        </div>
    </div>
</header>

<div class="call-bar">
    <a class="btn btn--grad" href="${BUSINESS.phoneHref}" data-cta="mobile-call">${ICONS.phone} Call Now</a>
    <a class="btn btn--ghost" href="${rel('/contact.html', depth)}" data-cta="mobile-quote">Free Quote ${ICONS.arrow}</a>
</div>

<main id="main">`;
}

/* --------------------------------------------------------------------------
   CTA band
   -------------------------------------------------------------------------- */
function ctaBand(depth, options = {}) {
    const heading = options.heading || 'Book a trusted cleaner';
    const body =
        options.body ||
        'Tell us the square footage and how often you need us. You get a written scope and a fixed price per visit — not a number invented over the phone.';

    return `
<section class="cta-band">
    <span class="bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    <div class="wrap">
        <p class="eyebrow eyebrow--light" data-reveal>${ICONS.sparkle} ${esc(BUSINESS.guarantee)}</p>
        <h2 data-reveal>${esc(heading)}</h2>
        <p class="lede" data-reveal>${esc(body)}</p>
        <div class="btn-row" data-reveal>
            <a class="btn btn--lg btn--white" href="${BUSINESS.phoneHref}" data-cta="cta-call">${ICONS.phone} ${esc(
        BUSINESS.phone
    )}</a>
            <a class="btn btn--lg btn--outline-white" href="${rel('/contact.html', depth)}" data-cta="cta-quote">Request a free quote ${
        ICONS.arrow
    }</a>
        </div>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
function footer(depth) {
    const serviceLinks = SERVICES.map(
        (s) => `<li><a href="${rel('/services.html#' + s.slug, depth)}">${esc(s.title)}</a></li>`
    ).join('\n                    ');

    const cityLinks = CITIES.map(
        (city) =>
            `<li><a href="${rel('/areas/' + city.slug + '.html', depth)}">Cleaning in ${esc(city.name)}, ${esc(
                city.region
            )}</a></li>`
    ).join('\n                    ');

    const socials = Object.entries(BUSINESS.social)
        .filter(([, url]) => url)
        .map(
            ([key, url]) =>
                `<a href="${esc(url)}" rel="noopener noreferrer" target="_blank" aria-label="${
                    key[0].toUpperCase() + key.slice(1)
                }">${ICONS[key]}</a>`
        )
        .join('\n                    ');

    return `
</main>

<footer class="site-footer">
    <div class="wrap">
        <div class="footer-grid">
            <div class="footer-brand">
                <a class="brand brand--footer" href="${rel('/index.html', depth)}">
                    <img src="${rel('/assets/img/brand/logo.svg', depth)}" alt="" width="52" height="52" loading="lazy">
                    <span>
                        <span class="brand__name">DD Cleaning</span>
                        <span class="brand__tag">Services</span>
                    </span>
                </a>
                <p>Commercial and residential cleaning across DuPage County, Illinois and Henrico and Prince William
                counties, Virginia. Insured, background-checked crews working to a written scope you sign off.</p>
                ${socials ? `<div class="socials">\n                    ${socials}\n                </div>` : ''}
            </div>

            <div class="footer-col">
                <h4>Our Services</h4>
                <ul>
                    ${serviceLinks}
                </ul>
            </div>

            <div class="footer-col">
                <h4>Where We Clean</h4>
                <ul>
                    ${cityLinks}
                    <li><a href="${rel('/service-areas.html', depth)}">All service areas</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Get In Touch</h4>
                <ul class="footer-contact">
                    ${REGIONS.map(
                        (r) =>
                            `<li>${ICONS.pin}<span><strong>${esc(r.name)}</strong><a href="${r.phoneHref}">${esc(
                                r.phone
                            )}</a></span></li>`
                    ).join('\n                    ')}
                    <li>${ICONS.mail}<span><a href="mailto:${esc(BUSINESS.email)}">${esc(BUSINESS.email)}</a></span></li>
                    <li>${ICONS.clock}<span>${esc(BUSINESS.hours)}<br><span class="faint">${esc(
        BUSINESS.hoursNote
    )}</span></span></li>
                </ul>
                <a class="btn btn--grad btn--block" href="${rel('/contact.html', depth)}">Request a free quote</a>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <span data-year>2026</span> ${esc(BUSINESS.name)}. All rights reserved.</p>
            <nav aria-label="Footer">
                <a href="${rel('/index.html', depth)}">Home</a>
                <a href="${rel('/services.html', depth)}">Services</a>
                <a href="${rel('/about.html', depth)}">About</a>
                <a href="${rel('/faq.html', depth)}">FAQ</a>
                <a href="${rel('/contact.html', depth)}">Contact</a>
            </nav>
        </div>
    </div>
</footer>

<script src="${rel('/assets/js/main.js', depth)}" defer></script>
</body>
</html>`;
}

module.exports = { head, header, footer, ctaBand, rel, esc, ICONS };
