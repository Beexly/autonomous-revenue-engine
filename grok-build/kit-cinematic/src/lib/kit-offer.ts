export const IG_DM = "https://ig.me/m/gbeexly";
export const IG_HANDLE = "@gbeexly";

export const offer = {
  onePager: {
    name: "One-pager",
    price: "$350",
    cadence: "flat",
    dm: "KIT",
    href: IG_DM,
    blurb: "One page that makes the phone ring. Live within days.",
    loved: true,
    includes: [
      "Your name, services, towns, big tap-to-call button",
      "Built for phones first",
      "No monthly fees — you own it",
      "Free preview first. Don't love it, pay nothing.",
    ],
  },
  fullSite: {
    name: "Full website",
    price: "$900",
    cadence: "flat",
    dm: "SITE",
    href: IG_DM,
    blurb: "A complete site for shops ready to look like the obvious choice.",
    loved: false,
    includes: [
      "Up to 5 pages: home, services, about, reviews, contact",
      "Quote form that sends leads straight to your phone",
      "Google Maps and your reviews embedded",
      "Basic SEO baked in from day one",
      "Free homepage preview first",
    ],
  },
  workflows: {
    name: "Workflows",
    price: "$500",
    cadence: "from",
    dm: "WORKFLOW",
    href: IG_DM,
    blurb: "Custom automation for the stuff that's eating your week.",
    loved: false,
    includes: [
      "Missed-call text-back",
      "Online booking that pings your phone",
      "Lead follow-up that runs itself",
      "Review engine: happy customers asked automatically",
      "Priced by scope — tell me what to automate",
    ],
  },
};

export const craft = [
  {
    n: "i",
    title: "Designed, not decorated",
    body: "Art direction per business — type, color, and rhythm chosen for your trade, never a template.",
  },
  {
    n: "ii",
    title: "Written like a human",
    body: "Copy in your town's voice, with your prices stated plainly. No filler, no corporate fog.",
  },
  {
    n: "iii",
    title: "Phone-first",
    body: "Built for the device in your customer's hand: big tap-to-call, sticky call bar, loads fast on data.",
  },
  {
    n: "iv",
    title: "Fast & findable",
    body: "Single-file pages that load instantly, with the local SEO basics baked in from day one.",
  },
  {
    n: "v",
    title: "Yours outright",
    body: "No monthly fees, no logins to lose, no designer holding your site hostage. You own it.",
  },
];

export const reversal = [
  {
    n: "i",
    title: "No pitch deck",
    body: "You're not buying slides about what your site could be. You're buying the site itself, already built, already on your screen.",
  },
  {
    n: "ii",
    title: "No deposit",
    body: "Nothing changes hands until you've seen your page and said yes. The risk sits with me, not you.",
  },
  {
    n: "iii",
    title: "No disappearing act",
    body: "The page is yours outright. No monthly fee, no login to lose, no designer holding your site hostage.",
  },
];

export const faqs = [
  {
    q: "What's the difference between the one-pager and the full website?",
    a: "The one-pager is a single screen: your name, services, and a big call button — $350 flat. The full website is up to 5 pages with a quote form, your Google reviews, maps, and SEO baked in — $900 flat. Same deal on both: free preview first, you own it, no monthly fees.",
  },
  {
    q: "What kind of workflows do you build?",
    a: "The boring stuff that loses you money: missed calls that never get a text back, leads nobody follows up with, happy customers nobody asks for a review. DM “WORKFLOW” and tell me what's eating your time — I'll tell you straight if I can automate it and what it'll cost.",
  },
  {
    q: "How long does it take?",
    a: "The preview usually lands the same day you send your info. Once you approve it, the site goes live within a few days.",
  },
  {
    q: "What do you need from me?",
    a: "Four things: your business name, your phone number, the services you want listed, and the towns you serve. If you have a logo or photos, wonderful — send them. If not, the page works fine without them.",
  },
  {
    q: "What if I hate the preview?",
    a: "Then you pay nothing and we're done — no hard feelings, no invoice, no follow-up sales pitch. The preview is free because I'd rather you see it than take my word for it.",
  },
  {
    q: "How do I pay the $350?",
    a: "We sort that out when you approve the preview — whatever's easiest for you. You don't pay anything until you've seen your page and said yes.",
  },
  {
    q: "Who owns the website?",
    a: "You do. It's built for you, by hand, yours to keep. There are no monthly fees and nothing to cancel.",
  },
  {
    q: "Can you change things later?",
    a: "Small stuff — a new phone number, a service added or removed — just message me and I'll update it. If you ever want a second page or something bigger, we'll talk then, not now.",
  },
  {
    q: "Do you only work in The Woodlands?",
    a: "The Woodlands, Spring, Conroe, and the rest of north Houston. If you're a local shop whose customers find you on their phone, you're in range.",
  },
];

export type TradeSlug = "hvac" | "lawn" | "detail" | "pool" | "roof";

export type Trade = {
  slug: TradeSlug;
  kicker: string;
  title: string;
  italic: string;
  town: string;
  image: string;
  accent: string;
  paper: string;
  ink: string;
  muted: string;
  phone: string;
  hours: string;
  priceLine: string;
  lede: string;
  services: { name: string; price: string }[];
  sampleNote: string;
};

export const trades: Trade[] = [
  {
    slug: "hvac",
    kicker: "HVAC · Houston TX",
    title: "Midnight",
    italic: "Service",
    town: "Houston",
    image: "/kit/hvac.jpg",
    accent: "#E8602A",
    paper: "#0B0C0E",
    ink: "#F4EDE4",
    muted: "#B9A89A",
    phone: "(713) 555-0142",
    hours: "24 / 7 emergency",
    priceLine: "Outside 102°F. Inside 72°F.",
    lede: "Industrial midnight for a 24/7 AC crew. Condensed type, emergency orange, and the temperature doing the talking.",
    services: [
      { name: "Same-day diagnostic", price: "$89" },
      { name: "AC repair", price: "from $149" },
      { name: "System replace", price: "quoted" },
    ],
    sampleNote: "Fictional sample. Yours gets your name, your number, your hours.",
  },
  {
    slug: "lawn",
    kicker: "Lawn care · The Woodlands TX",
    title: "Sunday",
    italic: "Morning",
    town: "The Woodlands",
    image: "/kit/lawn.jpg",
    accent: "#3F6B46",
    paper: "#F3E6D4",
    ink: "#1C2418",
    muted: "#5E6A52",
    phone: "(281) 555-0194",
    hours: "Tue–Sat · 7a–6p",
    priceLine: "From $45 a visit.",
    lede: "Organic editorial for a lawn crew that treats yards like gardens. Warm paper, botanical greens, prices stated plainly.",
    services: [
      { name: "Weekly mow", price: "from $45" },
      { name: "Edging & beds", price: "$30" },
      { name: "Seasonal clean-up", price: "from $180" },
    ],
    sampleNote: "Fictional sample. Yours gets your name, your routes, your prices.",
  },
  {
    slug: "detail",
    kicker: "Mobile detailing · Houston TX",
    title: "Black",
    italic: "Gloss",
    town: "Houston",
    image: "/kit/detail.jpg",
    accent: "#7DE4F2",
    paper: "#07080A",
    ink: "#F2F5F7",
    muted: "#8A97A3",
    phone: "(832) 555-0160",
    hours: "By appointment",
    priceLine: "Packages $129 to $499.",
    lede: "Automotive noir for a mobile detail studio. Chrome type, cyan rim-light, packages configured like a build sheet.",
    services: [
      { name: "Maintenance wash", price: "$129" },
      { name: "Full interior", price: "$249" },
      { name: "Correction + coat", price: "$499" },
    ],
    sampleNote: "Fictional sample. Yours gets your packages and your booking number.",
  },
  {
    slug: "pool",
    kicker: "Pool service · The Woodlands TX",
    title: "Still",
    italic: "Water",
    town: "The Woodlands",
    image: "/kit/pool.jpg",
    accent: "#7BB8C4",
    paper: "#0E1A1E",
    ink: "#E7F2F4",
    muted: "#8EADB4",
    phone: "(281) 555-0177",
    hours: "Mon–Fri routes",
    priceLine: "Weekly plans from $149/mo.",
    lede: "Aquatic luxury for a pool care route. Drifting calm, serif italics, resort quiet from the first pixel.",
    services: [
      { name: "Weekly care", price: "$149/mo" },
      { name: "Green-to-clean", price: "from $220" },
      { name: "Equipment check", price: "$95" },
    ],
    sampleNote: "Fictional sample. Yours gets your route towns and your plan prices.",
  },
  {
    slug: "roof",
    kicker: "Roofing · Conroe TX",
    title: "Iron",
    italic: "& Oak",
    town: "Conroe",
    image: "/kit/roof.jpg",
    accent: "#C17A4A",
    paper: "#12100E",
    ink: "#F4EDE4",
    muted: "#A89886",
    phone: "(936) 555-0133",
    hours: "Mon–Sat · storm call-outs",
    priceLine: "Repairs from $250.",
    lede: "Craftsman heritage for a third-generation roofer. Blueprint grids, copper on charcoal, honest numbers.",
    services: [
      { name: "Leak repair", price: "from $250" },
      { name: "Storm inspect", price: "free" },
      { name: "Full reroof", price: "quoted" },
    ],
    sampleNote: "Fictional sample. Yours gets your name, your license, your number.",
  },
];

export function tradeBySlug(slug: string | undefined): Trade | undefined {
  return trades.find((t) => t.slug === slug);
}
