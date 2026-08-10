/**
 * Reusable page blocks. Each returns an HTML string and takes `depth` so links
 * inside it resolve correctly from /areas/ pages as well as the root.
 */

const { BUSINESS, REGIONS, SERVICES, CITIES, REASONS, PROCESS, REVIEWS, FAQS } = require('./data');
const { rel, esc, ICONS } = require('./layout');

/* --------------------------------------------------------------------------
   Section heading
   -------------------------------------------------------------------------- */
function heading({ eyebrow, title, lede, align = 'center' }) {
    return `<div class="section-head${align === 'left' ? ' section-head--left' : ''}">
        ${eyebrow ? `<p class="eyebrow" data-reveal>${ICONS.sparkle} ${esc(eyebrow)}</p>` : ''}
        <h2 data-reveal>${title}</h2>
        ${lede ? `<p class="lede" data-reveal>${lede}</p>` : ''}
    </div>`;
}

/* --------------------------------------------------------------------------
   Hero — rotating headlines, same idea as the reference site's slider
   -------------------------------------------------------------------------- */
const HERO_SLIDES = [
    {
        kicker: 'Commercial & residential',
        title: 'A spotless space is the <em>bare minimum</em>.',
        sub: 'We are here to keep the people in it safe.',
        body:
            'Insured, background-checked crews cleaning offices, retail units and homes across Illinois and Virginia — to a written scope you sign off, not a vague promise.'
    },
    {
        kicker: 'Out of hours, no premium',
        title: 'We clean while you <em>sleep</em>.',
        sub: 'So nobody works around a mop bucket.',
        body:
            'Overnight, early-morning and weekend crews for offices and commercial sites. Your team walks in to a building that has already been dealt with.'
    },
    {
        kicker: 'Carpet, floors, sanitization',
        title: 'The dirt you <em>cannot</em> see.',
        sub: 'Extraction, hard floor care and detail sanitization.',
        body:
            'Vacuuming lifts the loose soil. We take what is bonded into the fibre and the grout, then disinfect every surface a hand actually touches.'
    }
];

function hero(depth) {
    const slides = HERO_SLIDES.map(
        (slide, i) => `
            <article class="hero__slide${i === 0 ? ' is-active' : ''}" ${
            i === 0 ? '' : 'aria-hidden="true" '
        }data-slide="${i}">
                <p class="hero__kicker">${ICONS.sparkle} ${esc(slide.kicker)}</p>
                <h1>${slide.title}</h1>
                <p class="hero__sub">${esc(slide.sub)}</p>
                <p class="hero__body">${esc(slide.body)}</p>
            </article>`
    ).join('');

    const dots = HERO_SLIDES.map(
        (slide, i) =>
            `<button type="button" class="hero__dot${i === 0 ? ' is-active' : ''}" data-goto="${i}" aria-label="Slide ${
                i + 1
            }"${i === 0 ? ' aria-current="true"' : ''}></button>`
    ).join('');

    return `
<section class="hero" data-hero>
    <img class="hero__photo" src="${rel('/assets/img/work/hero.jpg', depth)}" alt="" aria-hidden="true"
         fetchpriority="high" decoding="async" width="960" height="640">
    <span class="aurora" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grain" aria-hidden="true"></span>
    <span class="bubbles bubbles--hero" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <div class="wrap hero__wrap">
        <div class="hero__text">
            ${slides}
            <div class="btn-row hero__actions">
                <a class="btn btn--lg btn--white" href="${rel('/contact.html', depth)}" data-cta="hero-quote">
                    Book a trusted cleaner ${ICONS.arrow}
                </a>
                <a class="btn btn--lg btn--outline-white" href="${BUSINESS.phoneHref}" data-cta="hero-call">
                    ${ICONS.phone} ${esc(BUSINESS.phone)}
                </a>
            </div>
            <div class="hero__dots" role="tablist" aria-label="Highlights">${dots}</div>
        </div>

        <aside class="hero__card" aria-label="What we clean">
            <p class="hero__card-title">${ICONS.sparkle} What we clean</p>
            <ul>
                ${SERVICES.map(
                    (s) =>
                        `<li><a href="${rel('/services.html#' + s.slug, depth)}"><span>${ICONS[s.icon]}</span>${esc(
                            s.title
                        )}${ICONS.arrow}</a></li>`
                ).join('\n                ')}
            </ul>
            <p class="hero__card-foot">${ICONS.shield} ${esc(BUSINESS.guarantee)}</p>
        </aside>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Info strip — the four cards that overlap the hero, as on the reference
   -------------------------------------------------------------------------- */
function infoStrip(depth) {
    const items = [
        {
            icon: 'phone',
            label: 'Call us direct',
            value: BUSINESS.phone,
            href: BUSINESS.phoneHref,
            note: BUSINESS.hours
        },
        {
            icon: 'mail',
            label: 'Ask a question',
            value: BUSINESS.email,
            href: 'mailto:' + BUSINESS.email,
            note: 'Replies within one working day',
            small: true
        },
        {
            icon: 'shield',
            label: 'Our guarantee',
            value: 'Re-cleaned free',
            href: rel('/about.html#guarantee', depth),
            note: 'Flag it within 24 hours and we return'
        },
        {
            icon: 'pin',
            label: 'Where we work',
            value: 'Illinois & Virginia',
            href: rel('/service-areas.html', depth),
            note: '5 towns across 4 counties'
        }
    ];

    return `
<section class="info-strip">
    <div class="wrap">
        <div class="info-grid">
            ${items
                .map(
                    (item) => `<a class="info-card${item.small ? ' info-card--sm' : ''}" href="${esc(
                        item.href
                    )}" data-reveal>
                <span class="info-card__icon">${ICONS[item.icon]}</span>
                <span class="info-card__text">
                    <span class="info-card__label">${esc(item.label)}</span>
                    <strong>${esc(item.value)}</strong>
                    <span class="info-card__note">${esc(item.note)}</span>
                </span>
            </a>`
                )
                .join('\n            ')}
        </div>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Service cards
   -------------------------------------------------------------------------- */
function serviceCards(depth, { limit } = {}) {
    const list = limit ? SERVICES.slice(0, limit) : SERVICES;

    const media = (s) => {
        if (!s.image) {
            return '';
        }
        const base = rel('/assets/img/work/' + s.image, depth);
        return `<span class="s-card__media">
                <img src="${base}.jpg" srcset="${base}-480.jpg 480w, ${base}.jpg 960w"
                     sizes="(max-width: 600px) 92vw, (max-width: 1000px) 46vw, 31vw"
                     alt="${esc(s.alt || '')}" loading="lazy" decoding="async" width="960" height="640">
                <span class="s-card__tint"></span>
                <span class="s-card__num">${esc(s.num)}</span>
            </span>`;
    };

    return `<div class="card-grid">
        ${list
            .map(
                (s) => `<article class="s-card s-card--${s.gradient}${s.image ? ' s-card--photo' : ''}" data-reveal>
            ${media(s)}
            <span class="s-card__icon">${ICONS[s.icon]}</span>
            <div class="s-card__body">
                <h3><a href="${rel('/services.html#' + s.slug, depth)}">${esc(s.title)}</a></h3>
                <p class="s-card__kicker">${esc(s.kicker)}</p>
                <p>${esc(s.short)}</p>
                <span class="s-card__more">Read more ${ICONS.arrow}</span>
            </div>
        </article>`
            )
            .join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Full service detail blocks (services.html)
   -------------------------------------------------------------------------- */
/** Responsive <img> for a service photo. Falls back to the gradient panel
 *  automatically: if `image` is absent from data.js, no <img> is emitted and
 *  the tinted panel behind it shows through on its own. */
function serviceMedia(s, depth) {
    if (!s.image) {
        return `<span class="s-detail__icon">${ICONS[s.icon]}</span>`;
    }
    const base = rel('/assets/img/work/' + s.image, depth);
    // 960px is the largest the source offers — the descriptors say so rather
    // than advertising a width the file does not have.
    return `<img class="s-detail__img"
             src="${base}.jpg"
             srcset="${base}-480.jpg 480w, ${base}.jpg 960w"
             sizes="(max-width: 860px) 92vw, 44vw"
             alt="${esc(s.alt || '')}" loading="lazy" decoding="async" width="960" height="640">`;
}

function serviceDetails(depth) {
    return SERVICES.map(
        (s, i) => `
<article class="s-detail${i % 2 ? ' s-detail--flip' : ''}" id="${s.slug}">
    <figure class="s-detail__art s-card--${s.gradient}" data-reveal>
        <span class="s-detail__clip">
            ${serviceMedia(s, depth)}
            <span class="s-detail__tint" aria-hidden="true"></span>
            <span class="s-detail__num" aria-hidden="true">${esc(s.num)}</span>
            <span class="s-detail__chip" aria-hidden="true">${ICONS[s.icon]}</span>
        </span>
    </figure>
    <div class="s-detail__text">
        <p class="eyebrow" data-reveal>${ICONS.sparkle} ${esc(s.kicker)}</p>
        <h2 data-reveal>${esc(s.title)}</h2>
        <p class="lede" data-reveal>${esc(s.blurb)}</p>
        <ul class="ticks" data-reveal>
            ${s.points.map((p) => `<li>${ICONS.check}<span>${esc(p)}</span></li>`).join('\n            ')}
        </ul>
        <div class="btn-row" data-reveal>
            <a class="btn btn--grad" href="${rel('/contact.html?service=' + s.slug, depth)}">Get a price for ${esc(
            s.title.toLowerCase()
        )} ${ICONS.arrow}</a>
            <a class="btn btn--ghost" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
        </div>
    </div>
</article>`
    ).join('\n');
}

/* --------------------------------------------------------------------------
   Animated background layers
   Two stacked pieces used on every coloured band: a slow-drifting "aurora" of
   blurred colour blobs, and a static grain texture. The grain is what stops
   the gradients reading as flat synthetic colour.
   -------------------------------------------------------------------------- */
function aurora(bubbles = 5) {
    const b = new Array(bubbles).fill('<i></i>').join('');
    return `<span class="aurora" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grain" aria-hidden="true"></span>
    <span class="bubbles" aria-hidden="true">${b}</span>`;
}

/* --------------------------------------------------------------------------
   Reasons / features
   -------------------------------------------------------------------------- */
function reasons() {
    return `<div class="reason-grid">
        ${REASONS.map(
            (r) => `<article class="reason" data-reveal>
            <span class="reason__icon">${ICONS[r.icon]}</span>
            <h3>${esc(r.title)}</h3>
            <p>${esc(r.body)}</p>
        </article>`
        ).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Process
   -------------------------------------------------------------------------- */
function process() {
    return `<ol class="process">
        ${PROCESS.map(
            (step) => `<li data-reveal>
            <span class="process__num">${esc(step.num)}</span>
            <h3>${esc(step.title)}</h3>
            <p>${esc(step.body)}</p>
        </li>`
        ).join('\n        ')}
    </ol>`;
}

/* --------------------------------------------------------------------------
   Coverage — the two regions and their towns
   -------------------------------------------------------------------------- */
function coverage(depth) {
    return `<div class="coverage">
        ${REGIONS.map((region) => {
            const cities = CITIES.filter((c) => c.regionSlug === region.slug);
            return `<article class="coverage__region" data-reveal>
            <header>
                <span class="coverage__badge">${esc(region.region)}</span>
                <div>
                    <h3>${esc(region.name)}</h3>
                    <p>${esc(region.area)}</p>
                </div>
            </header>
            <p>${esc(region.blurb)}</p>
            <ul class="coverage__cities">
                ${cities
                    .map(
                        (city) =>
                            `<li><a href="${rel('/areas/' + city.slug + '.html', depth)}">${ICONS.pin}<span><strong>${esc(
                                city.name
                            )}</strong>${esc(city.county)}</span>${ICONS.arrow}</a></li>`
                    )
                    .join('\n                ')}
            </ul>
            <a class="coverage__call" href="${region.phoneHref}">${ICONS.phone} ${esc(region.name)} dispatch — ${esc(
                region.phone
            )}</a>
        </article>`;
        }).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Reviews — honest empty state until real ones are pasted into data.js
   -------------------------------------------------------------------------- */
function reviews(depth) {
    if (!REVIEWS.length) {
        return `<div class="empty-state" data-reveal>
        <span class="empty-state__icon">${ICONS.quote}</span>
        <h3>No reviews published yet</h3>
        <p>We would rather show you nothing than show you testimonials we wrote ourselves. Real customer reviews go
        here as soon as there are live listings to link them to.</p>
        <p class="faint">If we have cleaned for you, a review helps more than you would think.</p>
        <div class="btn-row">
            <a class="btn btn--grad" href="${rel('/contact.html', depth)}">Get a quote ${ICONS.arrow}</a>
            <a class="btn btn--ghost" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
        </div>
    </div>`;
    }

    return `<div class="review-grid">
        ${REVIEWS.map(
            (r) => `<figure class="review" data-reveal>
            <span class="review__quote">${ICONS.quote}</span>
            <span class="stars" aria-label="${r.stars} out of 5">${ICONS.star.repeat(r.stars)}</span>
            <blockquote><p>${esc(r.body)}</p></blockquote>
            <figcaption><strong>${esc(r.name)}</strong><span>${esc(r.location)} · via ${esc(r.source)}</span></figcaption>
        </figure>`
        ).join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
function faqList(limit) {
    const list = limit ? FAQS.slice(0, limit) : FAQS;
    return `<div class="faq">
        ${list
            .map(
                (item, i) => `<div class="faq__item" data-reveal>
            <h3>
                <button type="button" class="faq__q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
                    <span>${esc(item.q)}</span>${ICONS.chevron}
                </button>
            </h3>
            <div class="faq__a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
                <p>${esc(item.a)}</p>
            </div>
        </div>`
            )
            .join('\n        ')}
    </div>`;
}

/* --------------------------------------------------------------------------
   Quote form
   Posts to Web3Forms. Until the access key is set the form does not fail
   silently — it tells the visitor and hands them the phone number instead.
   -------------------------------------------------------------------------- */
const WEB3FORMS_KEY = 'REPLACE_WITH_WEB3FORMS_ACCESS_KEY';

function quoteForm(depth) {
    const options = SERVICES.map((s) => `<option value="${esc(s.title)}">${esc(s.title)}</option>`).join(
        '\n                            '
    );
    const towns = CITIES.map((c) => `<option value="${esc(c.name)}, ${esc(c.region)}">`).join(
        '\n                        '
    );

    return `
<form class="quote-form" id="quote-form" method="POST" action="https://api.web3forms.com/submit"
      data-access-key="${WEB3FORMS_KEY}" novalidate>
    <input type="hidden" name="access_key" value="${WEB3FORMS_KEY}">
    <input type="hidden" name="subject" value="New quote request — ${esc(BUSINESS.name)} website">
    <input type="hidden" name="from_name" value="${esc(BUSINESS.name)} website">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">

    <div class="form-grid">
        <p class="field">
            <label for="qf-name">Full name <span aria-hidden="true">*</span></label>
            <input id="qf-name" name="name" type="text" autocomplete="name" required
                   placeholder="Jane Doe" maxlength="80">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-phone">Phone number <span aria-hidden="true">*</span></label>
            <input id="qf-phone" name="phone" type="tel" autocomplete="tel" required
                   placeholder="(630) 555-0142" maxlength="24">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-email">Email address</label>
            <input id="qf-email" name="email" type="email" autocomplete="email"
                   placeholder="you@example.com" maxlength="120">
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-service">Service needed <span aria-hidden="true">*</span></label>
            <span class="select">
                <select id="qf-service" name="service" required>
                    <option value="">Select a service…</option>
                    ${options}
                    <option value="Several / not sure">Several — or not sure yet</option>
                </select>
                ${ICONS.chevron}
            </span>
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-property">Property type</label>
            <span class="select">
                <select id="qf-property" name="property_type">
                    <option value="">Select…</option>
                    <option>Office</option>
                    <option>Retail unit</option>
                    <option>Warehouse / industrial</option>
                    <option>Medical / clinical</option>
                    <option>House</option>
                    <option>Apartment / townhome</option>
                    <option>Other</option>
                </select>
                ${ICONS.chevron}
            </span>
        </p>

        <p class="field">
            <label for="qf-frequency">How often?</label>
            <span class="select">
                <select id="qf-frequency" name="frequency">
                    <option value="">Select…</option>
                    <option>One-off clean</option>
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                    <option>Nightly (commercial contract)</option>
                </select>
                ${ICONS.chevron}
            </span>
        </p>

        <p class="field">
            <label for="qf-town">Town or city <span aria-hidden="true">*</span></label>
            <input id="qf-town" name="location" type="text" list="qf-towns" required
                   placeholder="Wheaton, IL" maxlength="80" autocomplete="address-level2">
            <datalist id="qf-towns">
                        ${towns}
            </datalist>
            <span class="field__error" data-error></span>
        </p>

        <p class="field">
            <label for="qf-date">Preferred start date</label>
            <input id="qf-date" name="preferred_date" type="date">
        </p>

        <p class="field field--full">
            <label for="qf-notes">Anything we should know?</label>
            <textarea id="qf-notes" name="notes" rows="4" maxlength="1200"
                      placeholder="Square footage, floor types, access arrangements, out-of-hours requirements…"></textarea>
        </p>
    </div>

    <div class="form-foot">
        <button class="btn btn--grad btn--lg" type="submit">Send my request ${ICONS.arrow}</button>
        <p class="faint">No obligation. We reply within one working day — or call
            <a href="${BUSINESS.phoneHref}">${esc(BUSINESS.phone)}</a> for an answer now.</p>
    </div>

    <p class="form-status" data-form-status role="status" aria-live="polite"></p>
</form>`;
}

module.exports = {
    heading,
    hero,
    infoStrip,
    serviceCards,
    serviceDetails,
    reasons,
    process,
    coverage,
    reviews,
    faqList,
    quoteForm
};
