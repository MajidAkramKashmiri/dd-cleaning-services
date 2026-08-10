#!/usr/bin/env node
/**
 * Static site generator.
 *
 * Run `node tools/build.js` and every .html file in the project root and
 * /areas is rewritten from these definitions, along with sitemap.xml,
 * robots.txt and site.webmanifest. The output is plain static HTML with no
 * runtime dependency on this script — deploy the folder as-is.
 */

const fs = require('fs');
const path = require('path');

const { BUSINESS, REGIONS, SERVICES, CITIES, REASONS, FAQS, REVIEWS } = require('./data');
const { head, header, footer, ctaBand, rel, esc, ICONS } = require('./layout');
const C = require('./components');

const ROOT = path.join(__dirname, '..');

/* --------------------------------------------------------------------------
   Schema helpers
   -------------------------------------------------------------------------- */

const DESCRIPTION =
    'Commercial and residential cleaning across Carol Stream, Wheaton and Burr Ridge in Illinois and Glen Allen and ' +
    'Woodbridge in Virginia. Office cleaning, carpet extraction, detail sanitization, hard floor care and home cleaning.';

/**
 * Core LocalBusiness node.
 * Deliberately no aggregateRating — there are no verified review scores yet,
 * and marking up scores a business does not hold risks a manual action.
 */
function localBusiness(extra = {}) {
    return {
        '@type': ['LocalBusiness', 'CleaningService', 'HomeAndConstructionBusiness'],
        '@id': BUSINESS.domain + '/#business',
        name: BUSINESS.name,
        description: DESCRIPTION,
        url: BUSINESS.domain + '/',
        telephone: BUSINESS.phoneDigits,
        email: BUSINESS.email,
        image: BUSINESS.domain + '/assets/img/brand/og-image.png',
        logo: BUSINESS.domain + '/assets/img/brand/logo.svg',
        foundingDate: String(BUSINESS.founded),
        priceRange: '$$',
        currenciesAccepted: 'USD',
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '07:00',
                closes: '19:00'
            }
        ],
        areaServed: REGIONS.map((r) => ({ '@type': 'State', name: r.name })).concat(
            CITIES.map((city) => ({ '@type': 'City', name: city.name + ', ' + city.region }))
        ),
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Cleaning services',
            itemListElement: SERVICES.map((service) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: service.title, description: service.short }
            }))
        },
        ...extra
    };
}

function breadcrumbs(trail) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: BUSINESS.domain + item.path
        }))
    };
}

function graph(nodes) {
    return { '@context': 'https://schema.org', '@graph': nodes };
}

function geoMeta(region, place) {
    return `<meta name="geo.region" content="US-${region}">
<meta name="geo.placename" content="${esc(place)}">`;
}

/* --------------------------------------------------------------------------
   Small shared blocks
   -------------------------------------------------------------------------- */
function pageHero({ eyebrow, title, lede, crumbs = [], depth = 0 }) {
    const trail = crumbs.length
        ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>
            <li><a href="${rel('/index.html', depth)}">Home</a></li>
            ${crumbs
                .map((c) =>
                    c.path
                        ? `<li><a href="${rel(c.path, depth)}">${esc(c.name)}</a></li>`
                        : `<li aria-current="page">${esc(c.name)}</li>`
                )
                .join('\n            ')}
        </ol></nav>`
        : '';

    return `
<section class="page-hero">
    <span class="aurora" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grain" aria-hidden="true"></span>
    <span class="bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
    <div class="wrap">
        ${trail}
        ${eyebrow ? `<p class="eyebrow eyebrow--light">${ICONS.sparkle} ${esc(eyebrow)}</p>` : ''}
        <h1>${title}</h1>
        ${lede ? `<p class="lede">${esc(lede)}</p>` : ''}
    </div>
</section>`;
}

function guaranteeBlock() {
    return `
<section class="section section--tint" id="guarantee">
    <div class="wrap">
        <div class="guarantee">
            <span class="guarantee__icon" aria-hidden="true">${ICONS.shield}</span>
            <div>
                <p class="eyebrow">${ICONS.sparkle} Our sparkling clean guarantee</p>
                <h2>If it is not right, we come back and redo it — free.</h2>
                <p class="lede">Flag anything that was missed within 24 hours of a visit and the crew returns to put it
                right at no charge. No form to fill in, no invoice, and no argument about what "clean" is supposed to
                mean. That applies to every home, office and commercial clean we do.</p>
            </div>
        </div>
    </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Pages
   -------------------------------------------------------------------------- */
const pages = [];

/* ----- Home ------------------------------------------------------------- */
pages.push({
    path: '/index.html',
    title: 'DD Cleaning Services | Commercial & Home Cleaning in Illinois & Virginia',
    description:
        'Office, commercial and home cleaning, carpet extraction, detail sanitization and hard floor care in Carol Stream, ' +
        'Wheaton, Burr Ridge, Glen Allen and Woodbridge. Insured crews, written scope, free quote.',
    geo: geoMeta('IL', 'Carol Stream, Illinois'),
    schema: graph([
        localBusiness(),
        {
            '@type': 'WebSite',
            '@id': BUSINESS.domain + '/#website',
            url: BUSINESS.domain + '/',
            name: BUSINESS.name,
            publisher: { '@id': BUSINESS.domain + '/#business' }
        }
    ]),
    body: (depth) => `
${C.hero(depth)}
${C.infoStrip(depth)}

<section class="section">
    <div class="wrap">
        <div class="intro">
            <div class="intro__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} Welcome to DD Cleaning Services</p>
                <h2 data-reveal>Good at this, and trained to stay that way.</h2>
                <p class="lede" data-reveal>We train our crews properly and then keep the same team on your building, so
                the people cleaning your space actually know it. Courteous, efficient, and in and out without becoming
                part of your day.</p>
                <p data-reveal>Every job runs off a written scope you sign off before the first visit — room by room,
                task by task, with a frequency against each one. That is what the crew works to and what you can hold us
                to. We bring every product and machine, we favour low-toxicity products as standard, and if something is
                missed you tell us within 24 hours and we come back and redo it for nothing.</p>
                <div class="btn-row" data-reveal>
                    <a class="btn btn--grad btn--lg" href="${rel('/contact.html', depth)}">Get a free quote ${
        ICONS.arrow
    }</a>
                    <a class="btn btn--ghost btn--lg" href="${rel('/about.html', depth)}">About the company</a>
                </div>
            </div>
            <ul class="stat-list" data-reveal>
                <li><strong>2</strong><span>States covered — Illinois and Virginia</span></li>
                <li><strong>6</strong><span>Services, from nightly contracts to one-off deep cleans</span></li>
                <li><strong>24h</strong><span>Window to flag anything missed for a free re-clean</span></li>
                <li><strong>0</strong><span>Out-of-hours premium on commercial contracts</span></li>
            </ul>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Cleaning services',
            title: 'Everything we clean, and how',
            lede:
                'Six services that can be taken on their own or bundled into one contract with a single invoice and a single point of contact.'
        })}
        ${C.serviceCards(depth)}
        <div class="section-foot" data-reveal>
            <a class="btn btn--grad btn--lg" href="${rel('/services.html', depth)}">See all services in detail ${
        ICONS.arrow
    }</a>
        </div>
    </div>
</section>

<section class="band">
    <span class="aurora" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grain" aria-hidden="true"></span>
    <span class="bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <div class="wrap">
        <div class="band__inner">
            <div data-reveal>
                <p class="eyebrow eyebrow--light">${ICONS.sparkle} First impressions do matter</p>
                <h2>A well-kept building is an asset. A tired one costs you work.</h2>
                <p class="lede">Clients, candidates and inspectors all read your space before they read anything you
                have written about yourself. Keeping it right is cheaper than explaining why it is not.</p>
            </div>
            <a class="btn btn--lg btn--white" href="${BUSINESS.phoneHref}" data-reveal>${ICONS.phone} ${esc(
        BUSINESS.phone
    )}</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Why people choose us',
            title: 'Five reasons this works out cheaper than it looks',
            lede:
                'The common objection is that a professional service costs more than doing it in-house. It rarely does once the re-dos, the supplies and the supervision are counted.'
        })}
        ${C.reasons()}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'How it works',
            title: 'Four steps, no surprises',
            lede: 'From first call to a settled routine, usually inside a week.'
        })}
        ${C.process()}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Service areas',
            title: 'Two regions, five towns, four counties',
            lede:
                'We run scheduled routes in each area, which is why adding a site rarely changes the price or the timetable.'
        })}
        ${C.coverage(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Reviews',
            title: 'The highest standards, the happiest customers',
            lede: 'We do not consider a job finished until the person paying for it says it is.'
        })}
        ${C.reviews(depth)}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Questions',
            title: 'The things people ask before booking',
            lede: 'Cost, contracts, keys, insurance and drying times — answered straight.'
        })}
        <div class="faq-wrap">${C.faqList(6)}</div>
        <div class="section-foot" data-reveal>
            <a class="btn btn--ghost btn--lg" href="${rel('/faq.html', depth)}">All ${
        FAQS.length
    } questions ${ICONS.arrow}</a>
        </div>
    </div>
</section>

${guaranteeBlock()}
${ctaBand(depth)}`
});

/* ----- Services --------------------------------------------------------- */
pages.push({
    path: '/services.html',
    title: 'Cleaning Services | Commercial, Office, Carpet, Floor & Home | DD Cleaning',
    description:
        'Commercial cleaning, office cleaning, professional carpet cleaning, detail sanitization, floor cleaning and home ' +
        'cleaning across Illinois and Virginia. Written scope, fixed price per visit, insured crews.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services.html' }
        ]),
        {
            '@type': 'ItemList',
            name: 'Cleaning services',
            itemListElement: SERVICES.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                item: {
                    '@type': 'Service',
                    name: s.title,
                    description: s.blurb,
                    serviceType: s.title,
                    provider: { '@id': BUSINESS.domain + '/#business' },
                    areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name + ', ' + c.region })),
                    url: BUSINESS.domain + '/services.html#' + s.slug
                }
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Our services',
    title: 'Six services. One crew. One invoice.',
    lede:
        'Take one of these on its own or bundle the lot into a single contract. Either way you get a written scope, a fixed price per visit, and the same team every time.',
    crumbs: [{ name: 'Services' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.serviceCards(depth)}
    </div>
</section>

<div class="section section--tint">
    <div class="wrap s-details">
        ${C.serviceDetails(depth)}
    </div>
</div>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'How it works',
            title: 'What happens after you call',
            lede: 'No pressure and no sales visit dressed up as a survey.'
        })}
        ${C.process()}
    </div>
</section>

${guaranteeBlock()}
${ctaBand(depth, {
    heading: 'Not sure which of these you need?',
    body:
        'Describe the space and we will tell you what it actually needs — including the bits you do not need to pay for yet.'
})}`
});

/* ----- About ------------------------------------------------------------ */
pages.push({
    path: '/about.html',
    title: 'About DD Cleaning Services | Insured, Vetted Cleaning Crews',
    description:
        'Who we are, how we train and vet our crews, the products we use and the guarantee behind every clean. Serving ' +
        'DuPage County, Illinois and Henrico and Prince William counties, Virginia.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about.html' }
        ]),
        {
            '@type': 'AboutPage',
            name: 'About DD Cleaning Services',
            description: DESCRIPTION,
            url: BUSINESS.domain + '/about.html'
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Our company',
    title: 'A professional cleaning company, run like one.',
    lede:
        'DD Cleaning Services covers commercial and residential work across two regions with the same crews, the same checklists and the same guarantee behind both.',
    crumbs: [{ name: 'About' }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="intro">
            <div class="intro__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} What we actually do</p>
                <h2 data-reveal>We eliminate germs one square foot at a time.</h2>
                <p class="lede" data-reveal>Half our work is commercial contracts — offices, retail units, warehouses
                and clinical suites cleaned nightly or weekly. The other half is homes, from regular housekeeping to
                deep cleans and end-of-tenancy resets.</p>
                <p data-reveal>The two halves are not run differently. A house gets the same room-by-room checklist
                discipline as a 40,000 square foot warehouse, the same vetted staff, and the same guarantee. The only
                thing that changes is the scope.</p>
                <p data-reveal>We are deliberately not the cheapest quote you will get. What we are is the quote where
                the price still means the same thing in month six — because the scope is written down, the crew is
                assigned, and nobody is quietly cutting the frequency to protect a margin.</p>
            </div>
            <div class="fact-card" data-reveal>
                <h3>${ICONS.shield} At a glance</h3>
                <dl>
                    <div><dt>Founded</dt><dd>${BUSINESS.founded}</dd></div>
                    <div><dt>Regions</dt><dd>Illinois &amp; Virginia</dd></div>
                    <div><dt>Towns served</dt><dd>${CITIES.length} across ${
        new Set(CITIES.map((c) => c.county)).size
    } counties</dd></div>
                    <div><dt>Services</dt><dd>${SERVICES.length}</dd></div>
                    <div><dt>Hours</dt><dd>${esc(BUSINESS.hours)}</dd></div>
                    <div><dt>Out of hours</dt><dd>${esc(BUSINESS.hoursNote)}</dd></div>
                    <div><dt>Insurance</dt><dd>Public liability, certificates on request</dd></div>
                    <div><dt>Staff</dt><dd>Background-checked before site access</dd></div>
                </dl>
                <a class="btn btn--grad btn--block" href="${rel('/contact.html', depth)}">Request a free quote</a>
            </div>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Our features',
            title: 'Reasons people stay with us',
            lede: 'None of these are difficult. They are just rarely all true at once.'
        })}
        ${C.reasons()}
    </div>
</section>

<section class="band">
    <span class="aurora" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="grain" aria-hidden="true"></span>
    <span class="bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <div class="wrap">
        <div class="band__inner">
            <div data-reveal>
                <p class="eyebrow eyebrow--light">${ICONS.sparkle} A higher standard of clean</p>
                <h2>Relax — hand-picked cleaners do the job.</h2>
                <p class="lede">We hire for reliability and attention, not availability. They bring every supply and
                machine needed for the visit at no extra cost, and they are the best cleaners you will never have to
                meet.</p>
            </div>
            <a class="btn btn--lg btn--white" href="${BUSINESS.phoneHref}" data-reveal>${ICONS.phone} ${esc(
        BUSINESS.phone
    )}</a>
        </div>
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'How it works',
            title: 'From first call to settled routine',
            lede: 'Usually inside a week for commercial sites, next day for one-off home cleans.'
        })}
        ${C.process()}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Where we work',
            title: 'Two regions, run as two local operations',
            lede:
                'Each region has its own dispatch number and its own crews. Nothing is subcontracted out to whoever is free that night.'
        })}
        ${C.coverage(depth)}
    </div>
</section>

${guaranteeBlock()}
${ctaBand(depth)}`
});

/* ----- Service areas ---------------------------------------------------- */
pages.push({
    path: '/service-areas.html',
    title: 'Service Areas | Cleaning in Illinois & Virginia | DD Cleaning Services',
    description:
        'Cleaning services in Carol Stream, Wheaton and Burr Ridge, Illinois, and Glen Allen and Woodbridge, Virginia. ' +
        'Scheduled routes in every area, with local dispatch numbers.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Service areas', path: '/service-areas.html' }
        ]),
        {
            '@type': 'ItemList',
            name: 'Service areas',
            itemListElement: CITIES.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name + ', ' + c.region,
                url: BUSINESS.domain + '/areas/' + c.slug + '.html'
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Service areas',
    title: 'Where DD Cleaning Services works',
    lede:
        'Five towns across two states, each on a scheduled route. If you are just outside one of them, call anyway — routes flex more often than people expect.',
    crumbs: [{ name: 'Service areas' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.coverage(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Town by town',
            title: 'Pick your town',
            lede: 'Each page covers what we typically clean there, the neighbourhoods we cover and how fast we can start.'
        })}
        <div class="card-grid card-grid--3">
            ${CITIES.map(
                (city) => `<article class="area-card" data-reveal>
                <span class="area-card__badge">${esc(city.region)}</span>
                <h3><a href="${rel('/areas/' + city.slug + '.html', depth)}">${esc(city.name)}</a></h3>
                <p class="area-card__county">${ICONS.pin} ${esc(city.county)}</p>
                <p>${esc(city.intro)}</p>
                <p class="area-card__response">${ICONS.clock} ${esc(city.response)}</p>
                <span class="s-card__more">${esc(city.name)} cleaning services ${ICONS.arrow}</span>
            </article>`
            ).join('\n            ')}
        </div>
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Services',
            title: 'Available in every area we cover',
            lede: 'The full list runs in both regions — nothing is Illinois-only or Virginia-only.'
        })}
        ${C.serviceCards(depth)}
    </div>
</section>

${ctaBand(depth, {
    heading: 'Not on the list?',
    body:
        'We add towns to a route when there is enough work to justify it. Tell us where you are and what you need, and we will tell you honestly whether we can cover it well.'
})}`
});

/* ----- Reviews ---------------------------------------------------------- */
pages.push({
    path: '/reviews.html',
    title: 'Reviews | DD Cleaning Services',
    description:
        'Customer reviews for DD Cleaning Services. We publish only genuine, sourced reviews — no invented testimonials.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Reviews', path: '/reviews.html' }
        ])
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Reviews',
    title: 'What our customers say',
    lede:
        'Only reviews we can point at a live listing for get published here. If a cleaning company shows you five glowing quotes with no source, assume it wrote them.',
    crumbs: [{ name: 'Reviews' }],
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.reviews(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Why this page looks like this',
            title: 'We would rather be trusted than quoted',
            lede:
                'Publishing testimonials a business wrote about itself is against FTC rules on endorsements, and every customer has seen enough of them to discount the lot. Real ones appear here as they arrive.'
        })}
        ${C.reasons()}
    </div>
</section>

${ctaBand(depth)}`
});

/* ----- FAQ -------------------------------------------------------------- */
pages.push({
    path: '/faq.html',
    title: 'FAQ | Cleaning Prices, Contracts, Insurance & Access | DD Cleaning',
    description:
        'Answers on pricing, contracts, insurance, keys and access, carpet drying times, sanitization and cancellation ' +
        'for DD Cleaning Services in Illinois and Virginia.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq.html' }
        ]),
        {
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Questions',
    title: 'Frequently asked questions',
    lede: 'Everything people ask before they book, answered without the sales gloss.',
    crumbs: [{ name: 'FAQ' }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="faq-wrap">${C.faqList()}</div>
    </div>
</section>

${guaranteeBlock()}
${ctaBand(depth, {
    heading: 'Still not answered?',
    body: 'Call and ask. You will get a person who knows the answer rather than a form that promises one.'
})}`
});

/* ----- Contact ---------------------------------------------------------- */
pages.push({
    path: '/contact.html',
    title: 'Get a Free Cleaning Quote | DD Cleaning Services',
    description:
        'Request a free, no-obligation cleaning quote for your office, commercial site or home in Illinois or Virginia. ' +
        'Written scope and a fixed price per visit.',
    schema: graph([
        localBusiness(),
        breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact.html' }
        ]),
        {
            '@type': 'ContactPage',
            name: 'Contact DD Cleaning Services',
            url: BUSINESS.domain + '/contact.html'
        }
    ]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Get in touch',
    title: 'Book a trusted cleaner',
    lede:
        'Tell us the space, the frequency and the town. You get a written scope and a fixed price per visit — no obligation and no sales visit dressed up as a survey.',
    crumbs: [{ name: 'Contact' }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="contact-grid">
            <div class="contact-form-wrap" data-reveal>
                <h2>Request a free quote</h2>
                <p class="faint">Fields marked <span aria-hidden="true">*</span> are required.</p>
                ${C.quoteForm(depth)}
            </div>

            <aside class="contact-side">
                <div class="contact-card" data-reveal>
                    <h3>${ICONS.phone} Call the right crew</h3>
                    <p class="faint">Each region has its own dispatch line.</p>
                    <ul class="contact-list">
                        ${REGIONS.map(
                            (r) =>
                                `<li><span class="contact-list__label">${esc(r.name)}</span>
                        <a href="${r.phoneHref}">${esc(r.phone)}</a>
                        <span class="faint">${esc(r.area)}</span></li>`
                        ).join('\n                        ')}
                    </ul>
                </div>

                <div class="contact-card" data-reveal>
                    <h3>${ICONS.mail} Prefer to write?</h3>
                    <p><a href="mailto:${esc(BUSINESS.email)}">${esc(BUSINESS.email)}</a></p>
                    <p class="faint">Replies within one working day. Attach a floor plan or a photo of the problem area
                    and the quote comes back faster.</p>
                </div>

                <div class="contact-card" data-reveal>
                    <h3>${ICONS.clock} Hours</h3>
                    <p>${esc(BUSINESS.hours)}</p>
                    <p class="faint">${esc(BUSINESS.hoursNote)}</p>
                </div>

                <div class="contact-card contact-card--grad" data-reveal>
                    <h3>${ICONS.shield} Our guarantee</h3>
                    <p>${esc(BUSINESS.guarantee)}. Tell us within 24 hours and the crew comes back — no charge, no
                    argument.</p>
                </div>
            </aside>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Service areas',
            title: 'Check we cover you',
            lede: 'Five towns on scheduled routes across Illinois and Virginia.'
        })}
        ${C.coverage(depth)}
    </div>
</section>`
});

/* ----- City pages ------------------------------------------------------- */
CITIES.forEach((city) => {
    const region = REGIONS.find((r) => r.slug === city.regionSlug);
    const others = CITIES.filter((c) => c.slug !== city.slug);

    pages.push({
        path: '/areas/' + city.slug + '.html',
        depth: 1,
        title: `Cleaning Services in ${city.name}, ${city.region} | DD Cleaning Services`,
        description:
            `Commercial, office and home cleaning in ${city.name}, ${city.region} — carpet extraction, detail ` +
            `sanitization and hard floor care across ${city.county}. Free quote, insured crews.`,
        geo: geoMeta(city.region, `${city.name}, ${region.name}`),
        schema: graph([
            localBusiness(),
            breadcrumbs([
                { name: 'Home', path: '/' },
                { name: 'Service areas', path: '/service-areas.html' },
                { name: city.name, path: '/areas/' + city.slug + '.html' }
            ]),
            {
                '@type': 'Service',
                name: `Cleaning services in ${city.name}, ${city.region}`,
                description: city.intro,
                serviceType: 'Cleaning service',
                provider: { '@id': BUSINESS.domain + '/#business' },
                areaServed: {
                    '@type': 'City',
                    name: city.name,
                    containedInPlace: { '@type': 'AdministrativeArea', name: city.county }
                },
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: `Cleaning services in ${city.name}`,
                    itemListElement: SERVICES.map((s) => ({
                        '@type': 'Offer',
                        itemOffered: { '@type': 'Service', name: `${s.title} in ${city.name}` }
                    }))
                }
            }
        ]),
        body: (depth) => `
${pageHero({
    eyebrow: `${city.county} · ${region.name}`,
    title: `Cleaning services in <em>${esc(city.name)}</em>`,
    lede: city.intro,
    crumbs: [{ name: 'Service areas', path: '/service-areas.html' }, { name: city.name }],
    depth
})}

<section class="section">
    <div class="wrap">
        <div class="intro">
            <div class="intro__text">
                <p class="eyebrow" data-reveal>${ICONS.sparkle} On our ${esc(region.name)} route</p>
                <h2 data-reveal>What we clean in ${esc(city.name)}</h2>
                <p class="lede" data-reveal>${esc(city.detail)}</p>
                <p data-reveal>Whatever the space, the arrangement is the same: a site walk, a written scope, a fixed
                price per visit and the same assigned crew every time. Commercial work runs out of hours at no premium,
                and anything missed gets redone free if you flag it within 24 hours.</p>
                <div class="btn-row" data-reveal>
                    <a class="btn btn--grad btn--lg" href="${rel('/contact.html', depth)}">Get a ${esc(
            city.name
        )} quote ${ICONS.arrow}</a>
                    <a class="btn btn--ghost btn--lg" href="${region.phoneHref}">${ICONS.phone} ${esc(region.phone)}</a>
                </div>
            </div>
            <div class="fact-card" data-reveal>
                <h3>${ICONS.pin} ${esc(city.name)} at a glance</h3>
                <dl>
                    <div><dt>County</dt><dd>${esc(city.county)}</dd></div>
                    <div><dt>State</dt><dd>${esc(region.name)}</dd></div>
                    <div><dt>Dispatch</dt><dd><a href="${region.phoneHref}">${esc(region.phone)}</a></dd></div>
                    <div><dt>Lead time</dt><dd>${esc(city.response)}</dd></div>
                    <div><dt>Hours</dt><dd>${esc(BUSINESS.hours)}</dd></div>
                </dl>
                <p class="fact-card__label">Also nearby</p>
                <p class="chips">${city.nearby.map((n) => `<span>${esc(n)}</span>`).join('')}</p>
                <a class="btn btn--grad btn--block" href="${rel('/contact.html', depth)}">Request a free quote</a>
            </div>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: `${esc(city.name)} coverage`,
            title: `Areas of ${esc(city.name)} we cover`,
            lede: 'If your street or estate is not listed, it is almost certainly still on the route — call and check.'
        })}
        <ul class="chip-grid" data-reveal>
            ${city.neighbourhoods.map((n) => `<li>${ICONS.pin}<span>${esc(n)}</span></li>`).join('\n            ')}
        </ul>
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Services',
            title: `All six services available in ${esc(city.name)}`,
            lede: 'Take one, or bundle them into a single contract with one invoice.'
        })}
        ${C.serviceCards(depth)}
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Why us',
            title: `Why ${esc(city.name)} businesses and households stay`,
            lede: 'The same five things, whether you are a 40-person office or a three-bed semi.'
        })}
        ${C.reasons()}
    </div>
</section>

<section class="section">
    <div class="wrap">
        ${C.heading({
            eyebrow: 'Nearby',
            title: 'Other towns we cover',
            lede: 'Multi-site clients get one contract and one invoice across both regions.'
        })}
        <div class="card-grid card-grid--4">
            ${others
                .map(
                    (o) => `<article class="area-card area-card--sm" data-reveal>
                <span class="area-card__badge">${esc(o.region)}</span>
                <h3><a href="${rel('/areas/' + o.slug + '.html', depth)}">${esc(o.name)}</a></h3>
                <p class="area-card__county">${ICONS.pin} ${esc(o.county)}</p>
                <span class="s-card__more">Cleaning in ${esc(o.name)} ${ICONS.arrow}</span>
            </article>`
                )
                .join('\n            ')}
        </div>
    </div>
</section>

${guaranteeBlock()}
${ctaBand(depth, {
    heading: `Book a cleaner in ${city.name}`,
    body: `Call the ${region.name} dispatch line on ${region.phone}, or send the details and we will come back with a written scope and a fixed price.`
})}`
    });
});

/* ----- 404 -------------------------------------------------------------- */
pages.push({
    path: '/404.html',
    noindex: true,
    title: 'Page not found | DD Cleaning Services',
    description: 'That page does not exist. Here is everything else on the site.',
    schema: graph([localBusiness()]),
    body: (depth) => `
${pageHero({
    eyebrow: 'Error 404',
    title: 'We cleaned this page right off the site.',
    lede: 'The link is broken or the page has moved. Everything that does exist is below.',
    depth
})}

<section class="section">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Services', title: 'What you were probably looking for' })}
        ${C.serviceCards(depth)}
        <div class="section-foot">
            <a class="btn btn--grad btn--lg" href="${rel('/index.html', depth)}">Back to the homepage ${ICONS.arrow}</a>
            <a class="btn btn--ghost btn--lg" href="${BUSINESS.phoneHref}">${ICONS.phone} ${esc(BUSINESS.phone)}</a>
        </div>
    </div>
</section>

<section class="section section--tint">
    <div class="wrap">
        ${C.heading({ eyebrow: 'Service areas', title: 'Or pick your town' })}
        ${C.coverage(depth)}
    </div>
</section>`
});

/* --------------------------------------------------------------------------
   Render
   -------------------------------------------------------------------------- */
function render(page) {
    const depth = page.depth || 0;
    return head(page, depth) + header(page, depth) + page.body(depth) + footer(depth);
}

console.log('\nBuilding ' + BUSINESS.name + '…\n');

let written = 0;
pages.forEach((page) => {
    const outPath = path.join(ROOT, page.path);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, render(page).replace(/\n{3,}/g, '\n\n'), 'utf8');
    written += 1;
    console.log('  ✓ ' + page.path);
});

/* ----- sitemap.xml ------------------------------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = pages
    .filter((page) => !page.noindex)
    .map((page) => {
        const loc = BUSINESS.domain + (page.path === '/index.html' ? '/' : page.path);
        const priority = page.path === '/index.html' ? '1.0' : page.path.startsWith('/areas/') ? '0.7' : '0.8';
        return `    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${priority}</priority>
    </url>`;
    })
    .join('\n');

fs.writeFileSync(
    path.join(ROOT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`,
    'utf8'
);
console.log('  ✓ /sitemap.xml');

/* ----- robots.txt ------------------------------------------------------- */
fs.writeFileSync(
    path.join(ROOT, 'robots.txt'),
    `User-agent: *
Allow: /

Sitemap: ${BUSINESS.domain}/sitemap.xml
`,
    'utf8'
);
console.log('  ✓ /robots.txt');

/* ----- site.webmanifest ------------------------------------------------- */
fs.writeFileSync(
    path.join(ROOT, 'site.webmanifest'),
    JSON.stringify(
        {
            name: BUSINESS.name,
            short_name: BUSINESS.shortName,
            description: 'Commercial and residential cleaning across Illinois and Virginia.',
            start_url: '/',
            display: 'standalone',
            background_color: '#ffffff',
            theme_color: '#6D28D9',
            icons: [
                { src: '/assets/img/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
                { src: '/assets/img/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
                { src: '/assets/img/brand/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        },
        null,
        2
    ) + '\n',
    'utf8'
);
console.log('  ✓ /site.webmanifest');

console.log(`\nBuilt ${written} pages, ${SERVICES.length} services, ${CITIES.length} city pages.`);
if (REVIEWS.length === 0) {
    console.log('  note: REVIEWS is empty — the reviews section renders its honest empty state.');
}
console.log('');
