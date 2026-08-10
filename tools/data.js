/**
 * Single source of truth for everything that appears on more than one page.
 *
 * Edit this file, run `node tools/build.js`, and every HTML page, the sitemap,
 * robots.txt and the web manifest are rewritten from it. Never hand-edit the
 * generated .html files — the next build overwrites them.
 *
 * Anything marked TODO is a placeholder that must be replaced before launch.
 * Phone numbers use the 555-01xx range, which is reserved for fiction, so a
 * placeholder can never dial a real person by accident.
 */

const BUSINESS = {
    name: 'DD Cleaning Services',
    shortName: 'DD Cleaning',
    tagline: 'Commercial & Residential Cleaning',
    founded: 2018, // TODO: confirm the real founding year.

    // TODO: replace all four contact values before launch.
    phone: '(630) 555-0142',
    phoneHref: 'tel:+16305550142',
    smsHref: 'sms:+16305550142',
    phoneDigits: '+1-630-555-0142',
    email: 'hello@ddcleaningservices.com',

    // TODO: set the real domain. This builds every canonical URL, every
    // Open Graph tag and sitemap.xml — wrong values waste the SEO work.
    domain: 'https://ddcleaningservices.com',

    country: 'US',
    hours: 'Mon–Sat, 7:00am – 7:00pm',
    hoursNote: 'After-hours and overnight commercial cleans by arrangement',
    guarantee: '100% satisfaction guarantee — we re-clean free within 24 hours',

    // TODO: add real profile URLs, or delete the keys to hide the icons.
    social: {
        facebook: '',
        instagram: '',
        google: ''
    }
};

/**
 * The two regions served. Each carries its own dispatch phone so a visitor in
 * Virginia never calls the Illinois crew, and vice versa.
 */
const REGIONS = [
    {
        slug: 'illinois',
        name: 'Illinois',
        region: 'IL',
        area: 'Chicago’s western suburbs',
        blurb:
            'DuPage County and the surrounding western suburbs — offices along the Roosevelt Road and Butterfield corridors, medical suites, retail units and family homes.',
        // TODO: replace with the real Illinois dispatch number.
        phone: '(630) 555-0142',
        phoneHref: 'tel:+16305550142',
        lat: 41.9125,
        lng: -88.1348
    },
    {
        slug: 'virginia',
        name: 'Virginia',
        region: 'VA',
        area: 'Greater Richmond & Northern Virginia',
        blurb:
            'Henrico County up through Prince William County — Innsbrook business park suites, I-95 corridor warehouses and offices, townhomes and single-family homes.',
        // TODO: replace with the real Virginia dispatch number.
        phone: '(804) 555-0119',
        phoneHref: 'tel:+18045550119',
        lat: 37.6659,
        lng: -77.5072
    }
];

const NAV = [
    { label: 'Home', href: '/index.html' },
    { label: 'Services', href: '/services.html' },
    { label: 'About', href: '/about.html' },
    { label: 'Reviews', href: '/reviews.html' },
    { label: 'FAQ', href: '/faq.html' }
];

/* --------------------------------------------------------------------------
   Services — the six the client asked for, in the order they appear sitewide
   -------------------------------------------------------------------------- */
const SERVICES = [
    {
        slug: 'commercial-cleaning',
        num: '01',
        icon: 'building',
        kicker: 'Contract or one-off',
        title: 'Commercial Cleaning',
        short: 'Retail floors, warehouses, clinics and multi-tenant buildings on a schedule that fits your trading hours.',
        blurb:
            'Whole-site cleaning for businesses that cannot afford to look tired. We work nightly, weekly or fortnightly, around your trading hours, to a written scope you sign off — so you know exactly what is being cleaned and how often.',
        points: [
            'Nightly, weekly or fortnightly contracts',
            'Retail, warehouse, clinical and industrial units',
            'Written scope of work and a signed-off checklist per visit',
            'Out-of-hours and weekend crews at no premium on contract',
            'Fully insured, background-checked cleaners'
        ],
        gradient: 'a',
        image: 'commercial-cleaning',
        alt:
            'A modern boardroom with glass walls and carpet tiles, cleaned and ready for the day'
    },
    {
        slug: 'office-cleaning',
        num: '02',
        icon: 'desk',
        kicker: 'Before you open, after you close',
        title: 'Office Cleaning',
        short: 'Desks, kitchens, washrooms, glass and communal areas — done before the first person badges in.',
        blurb:
            'A clean office is the cheapest staff benefit you can buy. We handle desks, breakout areas, kitchens, washrooms, internal glass and waste, either overnight or first thing, so your team arrives to a room that has already been dealt with.',
        points: [
            'Desks, meeting rooms, breakout and reception areas',
            'Kitchen and washroom deep-clean with consumables restocked',
            'Internal glass, partitions and high-touch points',
            'Waste and recycling handled to your building’s rules',
            'One point of contact and the same crew each visit'
        ],
        gradient: 'b',
        image: 'office-cleaning',
        alt:
            'A bright, uncluttered office desk with a plant, wiped down before the team arrives'
    },
    {
        slug: 'carpet-cleaning',
        num: '03',
        icon: 'carpet',
        kicker: 'Hot water extraction',
        title: 'Professional Carpet Cleaning',
        short: 'Truck-mount and portable extraction that lifts ground-in soil, traffic lanes and odour — not just the surface.',
        blurb:
            'Vacuuming takes the loose dirt. Extraction takes what is bonded to the fibre. We pre-treat, agitate and hot-water extract, so traffic lanes, spills and pet odour actually leave — and the carpet dries in hours, not days.',
        points: [
            'Pre-treatment, agitation and hot water extraction',
            'Traffic lane, spot and stain treatment',
            'Pet odour and organic soil neutralised at the source',
            'Upholstery, rugs and office chairs by the same method',
            'Low-moisture option for occupied offices — dry in 2–4 hours'
        ],
        gradient: 'c',
        image: 'carpet-cleaning',
        alt:
            'A plush carpet and upholstered bench in a hotel lounge, freshly extracted'
    },
    {
        slug: 'detail-sanitization',
        num: '04',
        icon: 'spray',
        kicker: 'High-touch and clinical',
        title: 'Detail Sanitization',
        short: 'Targeted disinfection of every surface a hand actually touches, with dwell times observed properly.',
        blurb:
            'Disinfectant only works if it stays wet long enough to work. Our sanitization crews clean first, then disinfect every high-touch point — handles, switches, rails, shared equipment, washrooms — and observe the label dwell time on each one.',
        points: [
            'Clean-then-disinfect, never disinfect over dirt',
            'Every high-touch point logged and signed off',
            'EPA-registered products, label dwell times observed',
            'Electrostatic and fogging application for large spaces',
            'Post-incident and move-in deep sanitization'
        ],
        gradient: 'd',
        image: 'detail-sanitization',
        alt:
            'A washroom basin and taps — the high-touch fittings a sanitization pass targets'
    },
    {
        slug: 'floor-cleaning',
        num: '05',
        icon: 'floor',
        kicker: 'Strip, seal, buff, restore',
        title: 'Floor Cleaning',
        short: 'Hard floor care for vinyl, tile, terrazzo, concrete and wood — scrubbed, sealed and brought back up.',
        blurb:
            'Hard floors are the first thing a visitor reads and the last thing anyone maintains. We scrub, strip, seal and burnish vinyl, tile, grout, terrazzo, sealed concrete and wood, then keep them on a maintenance cycle so they never fall that far again.',
        points: [
            'Strip and reseal of VCT and vinyl',
            'Tile and grout deep-scrub and colour restoration',
            'Machine scrubbing for concrete and warehouse floors',
            'Buffing and burnishing to restore gloss',
            'Scheduled maintenance so the finish holds'
        ],
        gradient: 'e',
        image: 'floor-cleaning',
        alt:
            'A flat mop on polished hardwood, part-way through a floor clean'
    },
    {
        slug: 'home-cleaning',
        num: '06',
        icon: 'home',
        kicker: 'Regular, deep or move-out',
        title: 'Home Cleaning',
        short: 'The same crews, the same standard, in your house — weekly, fortnightly, or one deep clean to reset.',
        blurb:
            'Regular housekeeping, a full spring-clean reset, or an end-of-tenancy clean that gets the deposit back. Same vetted crews as our commercial contracts, same checklist discipline, and we bring every product and machine with us.',
        points: [
            'Weekly, fortnightly or monthly housekeeping',
            'Deep cleans — inside cupboards, appliances, skirtings, glass',
            'Move-in and move-out cleans to a landlord checklist',
            'All products and equipment supplied at no extra cost',
            'Pet-safe and fragrance-free products on request'
        ],
        gradient: 'f',
        image: 'home-cleaning',
        alt:
            'A tidy, light-filled family living space seen from the landing above'
    }
];

/* --------------------------------------------------------------------------
   Cities — one landing page each
   -------------------------------------------------------------------------- */
const CITIES = [
    {
        slug: 'carol-stream',
        name: 'Carol Stream',
        region: 'IL',
        regionSlug: 'illinois',
        county: 'DuPage County',
        intro:
            'Carol Stream runs on light industry and small business — the warehouse and flex units off Gary Avenue and North Avenue, the medical and professional suites along Army Trail Road, and the subdivisions between them.',
        detail:
            'We hold nightly and weekly commercial contracts across the village’s industrial parks, and clean homes throughout the neighbourhoods either side of Kuhn Road. Because we already run a Carol Stream route, adding a site here rarely changes the schedule.',
        neighbourhoods: [
            'Gary Avenue industrial and flex units',
            'Army Trail Road business suites',
            'North Avenue retail corridor',
            'Kuhn Road and Lies Road residential',
            'Wheaton and Glendale Heights borders'
        ],
        nearby: ['Wheaton', 'Glendale Heights', 'Bloomingdale', 'Winfield'],
        response: 'Same-week start on most commercial contracts'
    },
    {
        slug: 'wheaton',
        name: 'Wheaton',
        region: 'IL',
        regionSlug: 'illinois',
        county: 'DuPage County',
        intro:
            'As the DuPage County seat, Wheaton carries an unusual density of professional offices, legal and medical practices, and older housing stock — buildings where the carpet and hard floors take a beating and show it.',
        detail:
            'Downtown Wheaton offices book us overnight so nobody works around a mop. Residential clients here lean toward deep cleans and carpet extraction, because the housing is older and the floors have history.',
        neighbourhoods: [
            'Downtown Wheaton professional offices',
            'Roosevelt Road retail and medical',
            'Wheaton College area',
            'Danada and Briarcliffe',
            'Cantigny and Winfield Road corridor'
        ],
        nearby: ['Carol Stream', 'Glen Ellyn', 'Winfield', 'Warrenville'],
        response: 'Overnight office slots available most weeknights'
    },
    {
        slug: 'burr-ridge',
        name: 'Burr Ridge',
        region: 'IL',
        regionSlug: 'illinois',
        county: 'DuPage & Cook County',
        intro:
            'Burr Ridge sits on the DuPage and Cook county line where I-55 meets I-294 — corporate offices in the Burr Ridge Parkway corridor, boutique retail at the Village Center, and large detached homes on generous lots.',
        detail:
            'The mix here is corporate contracts by night and larger residential deep cleans by day. Bigger houses mean more hard flooring and more carpet, so floor care and extraction make up most of what we do in the village.',
        neighbourhoods: [
            'Burr Ridge Parkway corporate offices',
            'Village Center retail and restaurants',
            'County Line Road corridor',
            'Harvester and Elm Street residential',
            'I-55 and I-294 business parks'
        ],
        nearby: ['Hinsdale', 'Willowbrook', 'Darien', 'Western Springs'],
        response: 'Same-week start; next-day for one-off deep cleans'
    },
    {
        slug: 'glen-allen',
        name: 'Glen Allen',
        region: 'VA',
        regionSlug: 'virginia',
        county: 'Henrico County',
        intro:
            'Glen Allen is where a large share of greater Richmond’s office space actually sits — the Innsbrook corporate park, the West Broad Street corridor, and the growing residential build-out around them.',
        detail:
            'Innsbrook suites are our core Virginia work: nightly office cleaning, quarterly carpet extraction and hard-floor maintenance on a fixed cycle. Homes in the surrounding neighbourhoods book regular housekeeping and seasonal deep cleans.',
        neighbourhoods: [
            'Innsbrook corporate park',
            'West Broad Street corridor',
            'Short Pump border and Gayton Road',
            'Nuckols Road and Twin Hickory',
            'Staples Mill and Mountain Road'
        ],
        nearby: ['Short Pump', 'Richmond', 'Henrico', 'Mechanicsville'],
        response: 'Nightly Innsbrook route — new sites slot in within the week'
    },
    {
        slug: 'woodbridge',
        name: 'Woodbridge',
        region: 'VA',
        regionSlug: 'virginia',
        county: 'Prince William County',
        intro:
            'Woodbridge stretches along the I-95 corridor in Prince William County — distribution and flex space, the retail mass around Potomac Mills, and a dense mix of townhomes and single-family neighbourhoods.',
        detail:
            'Retail and warehouse units here need hard-floor machine scrubbing more than anything else, and the townhome market keeps our residential crews busy with move-in and move-out cleans.',
        neighbourhoods: [
            'Potomac Mills retail and surrounds',
            'I-95 corridor warehouse and flex units',
            'Lake Ridge and Occoquan',
            'Dale City and Featherstone',
            'Prince William Parkway business parks'
        ],
        nearby: ['Lake Ridge', 'Dale City', 'Occoquan', 'Dumfries'],
        response: 'Next-day quotes; move-out cleans often booked within 48 hours'
    }
];

/* --------------------------------------------------------------------------
   Why people choose us — five, matching the reference site's structure
   -------------------------------------------------------------------------- */
const REASONS = [
    {
        icon: 'check',
        title: 'A written scope, not a vague promise',
        body:
            'Before the first visit you get a room-by-room scope listing what is cleaned and how often. The crew works that list, signs it off, and you can hold us to it.'
    },
    {
        icon: 'users',
        title: 'The same crew every visit',
        body:
            'You get an assigned team who learn your building — where the keys are, which room is off-limits on a Tuesday, which floor finish is fragile. No stranger with a mop each week.'
    },
    {
        icon: 'shield',
        title: 'Insured and background-checked',
        body:
            'Every cleaner is vetted and DBS/background-checked before they hold a key, and the company carries public liability cover. Certificates on request, no fuss.'
    },
    {
        icon: 'leaf',
        title: 'Products that are safe to be around',
        body:
            'Low-toxicity, low-odour products as the default, with fragrance-free and pet-safe options on request. Safety data sheets for anything we use are yours on request.'
    },
    {
        icon: 'star',
        title: 'Fix-it-free guarantee',
        body:
            'If something was missed, tell us within 24 hours and we come back and redo it at no charge. No argument, no invoice, no negotiating over what "clean" means.'
    }
];

/* --------------------------------------------------------------------------
   Process
   -------------------------------------------------------------------------- */
const PROCESS = [
    {
        num: '01',
        title: 'Walk the site',
        body:
            'We visit, measure and look at your actual floors and surfaces — not a phone estimate off a square-footage guess.'
    },
    {
        num: '02',
        title: 'Agree the scope',
        body:
            'You get a written scope and a fixed price per visit. Nothing is billed that is not on that sheet.'
    },
    {
        num: '03',
        title: 'Clean to the checklist',
        body:
            'The assigned crew works the list every visit and signs it off. You can see what was done and when.'
    },
    {
        num: '04',
        title: 'Review and adjust',
        body:
            'After the first month we review what is working. Frequencies and scope get tuned to how the building is actually used.'
    }
];

/* --------------------------------------------------------------------------
   Reviews
   Deliberately empty. Publishing invented testimonials for a real business
   breaks the FTC rule on fake endorsements (16 CFR Part 465), so the reviews
   section renders an honest empty state until genuine ones are pasted in.
   Format:
     { name: 'First name L.', location: 'Wheaton, IL', source: 'Google',
       stars: 5, body: 'Their actual words, copied from the live listing.' }
   -------------------------------------------------------------------------- */
const REVIEWS = [];

/**
 * Verified rating summaries. Leave empty until there is a live listing to
 * link to — a score with no source is worth less than no score at all.
 */
const RATINGS = [];

/* --------------------------------------------------------------------------
   FAQs
   -------------------------------------------------------------------------- */
const FAQS = [
    {
        q: 'Which areas do you cover?',
        a: 'Two regions. In Illinois: Carol Stream, Wheaton and Burr Ridge, plus the surrounding DuPage County suburbs. In Virginia: Glen Allen and Woodbridge, covering Henrico and Prince William counties. If you are just outside one of those, call anyway — routes flex.'
    },
    {
        q: 'Do you clean homes as well as businesses?',
        a: 'Both. Roughly half our work is commercial contracts and half is residential — regular housekeeping, deep cleans and move-out cleans. The same vetted crews and the same checklist discipline apply to both.'
    },
    {
        q: 'How much does it cost?',
        a: 'Commercial pricing is a fixed price per visit, set after a site walk, and depends on square footage, floor types and frequency. Home cleaning is quoted per visit on bedrooms, bathrooms and scope. We do not quote a final price over the phone without seeing the space, because that is how people end up with surprise invoices.'
    },
    {
        q: 'Do I need to supply products or equipment?',
        a: 'No. We bring every product, cloth, machine and vacuum with us, and that is included in the price. If you would rather we used a specific product on a particular surface, we will use yours instead.'
    },
    {
        q: 'Are your cleaners insured and background-checked?',
        a: 'Yes. Every cleaner is vetted and background-checked before they are given access to a site, and the company carries public liability insurance. We will send certificates before you sign anything.'
    },
    {
        q: 'Can you clean outside business hours?',
        a: 'Yes, and for most commercial sites we prefer it. Overnight, early morning and weekend slots are standard on contract work and carry no out-of-hours premium.'
    },
    {
        q: 'How long does carpet cleaning take to dry?',
        a: 'Hot water extraction typically dries in 4 to 8 hours with decent airflow. For offices that cannot be out of action that long, we use a low-moisture method that is walkable in 2 to 4 hours.'
    },
    {
        q: 'What is "detail sanitization" — is it different from normal cleaning?',
        a: 'Yes. Cleaning removes soil; sanitization reduces the microbial load on surfaces that hands touch. Disinfectant does nothing on a dirty surface and nothing if it dries too fast, so we clean first, then disinfect every high-touch point and hold the label dwell time. It is a separate, logged pass — not a spray-and-wipe.'
    },
    {
        q: 'Can you strip and reseal our vinyl floors?',
        a: 'Yes. Strip, reseal and burnish for VCT and vinyl, deep-scrub and colour restoration for tile and grout, and machine scrubbing for sealed concrete and warehouse floors. Most sites then move onto a maintenance cycle so the finish is never allowed to fail again.'
    },
    {
        q: 'Do I have to be home for a house clean?',
        a: 'No, and most regular clients are not. We hold keys or codes under a signed key agreement, and the same assigned crew attends every visit so you are not letting a different stranger in each week.'
    },
    {
        q: 'What if I am not happy with a clean?',
        a: 'Tell us within 24 hours and we come back and redo whatever was missed, free. That is the whole guarantee — there is no form to fill in and no argument about what "clean" means.'
    },
    {
        q: 'Is there a contract, and can I cancel?',
        a: 'One-off cleans have no contract at all. Commercial contracts run monthly with 30 days’ notice either way. We do not use lock-in terms — if the service is not worth keeping, a long contract will not fix that.'
    }
];

module.exports = { BUSINESS, REGIONS, NAV, SERVICES, CITIES, REASONS, PROCESS, REVIEWS, RATINGS, FAQS };
