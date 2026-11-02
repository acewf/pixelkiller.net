/**
 * All copy for the site, in one typed object. A translated site (e.g. /pt)
 * provides another `SiteContent`; components never hold copy of their own.
 */

export interface Link {
  label: string;
  href: string;
}

export interface SectionMeta {
  id: string;
  index: string;
  label: string;
  aside: string;
}

export type Tone = "good" | "warn" | "info";

export interface SiteContent {
  url: string;
  name: string;
  title: string;
  email: string;
  /** Company line used where the footer's © is out of place (e.g. the social card). */
  legal: string;
  skipLink: string;
  /** Appended, visually hidden, to links that open a new tab. */
  newTab: string;
  /** Section links use "/#id" so they work from any route, the 404 page included. */
  nav: {
    label: string;
    homeLabel: string;
    homeHref: string;
    /** Narrow screens fold the links into a disclosure with this label. */
    menu: string;
    menuLabel: string;
    links: Link[];
  };
  hero: {
    eyebrow: string;
    titleLines: string[];
    lead: string;
    primary: Link;
    secondary: Link;
    readout: { caption: string; label: string; phases: string[] };
  };
  thesis: SectionMeta & { statement: string; emphasis: string; points: string[] };
  ventures: SectionMeta & {
    title: string;
    flagship: {
      kicker: string;
      name: string;
      tagline: string;
      body: string;
      capabilitiesLabel: string;
      capabilities: string[];
      worksWith: string;
      link: Link;
      board: {
        title: string;
        live: string;
        tag: string;
        yieldLabel: string;
        yieldValue: string;
        partsLabel: string;
        partsStart: number;
        onlineLabel: string;
        onlineValue: string;
        alertsLabel: string;
        alertsValue: string;
        plantsLabel: string;
        plants: { name: string; machines: string; status: string; tone: Tone; yieldPct: number }[];
        eventsLabel: string;
        events: { text: string; tone: Tone }[];
      };
    };
    open: { kicker: string; title: string; body: string; cta: Link };
  };
  method: SectionMeta & { title: string; steps: { title: string; body: string }[] };
  ai: SectionMeta & {
    title: string;
    lead: string;
    lattice: { rules: string; learning: string };
    before: { label: string; items: string[] };
    after: { label: string; items: string[] };
    log: {
      title: string;
      tag: string;
      steps: { role: string; task: string; status: string }[];
      human: { role: string; task: string; status: string };
    };
  };
  story: SectionMeta & {
    title: string;
    entries: { year: string; role: string; org: string; current?: boolean }[];
  };
  contact: SectionMeta & { prompt: string; title: string; email: Link; linksLabel: string; links: Link[] };
  footer: { line: string; backToTop: string };
  notFound: { title: string; code: string; label: string; heading: string; body: string; cta: Link };
}

const email = "contact@pixelkiller.net";

export const site: SiteContent = {
  url: "https://pixelkiller.net",
  name: "Pixelkiller",
  title: "Pixelkiller: from pixels to production",
  email,
  legal: "Pixelkiller Ltd · United Kingdom",
  skipLink: "Skip to content",
  newTab: "(opens in a new tab)",
  nav: {
    label: "Primary",
    homeLabel: "Pixelkiller, home",
    homeHref: "/#top",
    menu: "Menu",
    menuLabel: "Site menu",
    links: [
      { label: "Ventures", href: "/#ventures" },
      { label: "Method", href: "/#method" },
      { label: "AI", href: "/#ai" },
      { label: "Story", href: "/#story" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  hero: {
    eyebrow: "Venture studio · United Kingdom",
    titleLines: ["From pixels", "to production."],
    lead: "Pixelkiller is the venture studio of Pedro Martins. Twenty years building for screens — Flash, games, AAA launches — now pointed at the industries that make things, with AI in the loop.",
    primary: { label: "See the ventures", href: "/#ventures" },
    secondary: { label: "Get in touch", href: `mailto:${email}` },
    readout: {
      caption: "Particle field · WebGL2",
      label: "Particle field phases",
      phases: ["Pixels", "Mark", "Part", "Network"],
    },
  },
  thesis: {
    id: "thesis",
    index: "02",
    label: "Thesis",
    aside: "Why a developer",
    statement: "Developers are the new founders of",
    emphasis: "old industries.",
    points: [
      "AI collapsed the cost of building. One developer with agents now covers the ground of a whole team.",
      "The bottleneck moved to the floor: real machines, real data, real operators.",
      "So we go where the work is, and build software that earns its place beside the machine.",
    ],
  },
  ventures: {
    id: "ventures",
    index: "03",
    label: "Ventures",
    aside: "Portfolio",
    title: "Companies under the Pixelkiller umbrella",
    flagship: {
      kicker: "Venture 01 · Manufacturing",
      name: "Undrd Control",
      tagline: "Live fleet control for CNC production.",
      body: "See every CNC machine in every plant as it runs, and let an edge agent correct tool wear before it becomes scrap. Retrofitted onto the controllers factories already own.",
      capabilitiesLabel: "Capabilities",
      capabilities: ["Computer vision", "Edge agent", "Closed-loop correction", "Fleet dashboard"],
      worksWith:
        "Works with controllers from GSK, Fanuc, Siemens, Heidenhain, Fagor, Mitsubishi Electric, Haas, Mazak, Okuma",
      link: { label: "undrd.app", href: "https://undrd.app" },
      board: {
        title: "Fleet overview",
        live: "Live",
        tag: "Illustrative",
        yieldLabel: "Fleet yield",
        yieldValue: "99.2%",
        partsLabel: "Parts today",
        partsStart: 4812,
        onlineLabel: "Machines online",
        onlineValue: "10 / 12",
        alertsLabel: "Open alerts",
        alertsValue: "1",
        plantsLabel: "Plants",
        plants: [
          { name: "Plant A", machines: "5 machines", status: "Nominal", tone: "good", yieldPct: 99.6 },
          { name: "Plant B", machines: "4 machines", status: "Warning", tone: "warn", yieldPct: 97.8 },
          { name: "Plant C", machines: "3 machines", status: "Nominal", tone: "good", yieldPct: 99.4 },
        ],
        eventsLabel: "Recent events",
        events: [
          { text: "Lathe 07 · late, last heard 40 s ago", tone: "warn" },
          { text: "Lathe 07 · back online", tone: "good" },
          { text: "Lathe 03 · correction −0.013 mm on T02", tone: "info" },
        ],
      },
    },
    open: {
      kicker: "Open slot",
      title: "Your industry",
      body: "Running a process on clipboards and spreadsheets? Bring the problem. We bring the stack.",
      cta: { label: "Pitch a problem", href: `mailto:${email}` },
    },
  },
  method: {
    id: "method",
    index: "04",
    label: "Method",
    aside: "Five habits from twenty years of shipping",
    title: "How a developer builds companies",
    steps: [
      {
        title: "Prototype before pitch",
        body: "A working demo on a real machine beats a slide deck. We build first, then talk.",
      },
      {
        title: "Retrofit, don’t replace",
        body: "Meet an industry where it is: its controllers, its networks, its people.",
      },
      {
        title: "Own the whole loop",
        body: "Model, edge device, backend, dashboard, website. One builder holds the full system, so nothing gets lost between teams.",
      },
      {
        title: "Agents in the workflow",
        body: "AI agents write, test, review and translate alongside us, so a small studio ships like a big one.",
      },
      {
        title: "Measure, then correct",
        body: "Like the agent on the lathe: measure the result, correct the offset, before the drift becomes scrap.",
      },
    ],
  },
  ai: {
    id: "ai",
    index: "05",
    label: "AI",
    aside: "Industry 3.0 → 4.0",
    title: "From rules to learning",
    lead: "Most inspection still runs on thresholds someone tuned by hand. The next decade belongs to systems that learn from the parts a plant actually makes, and correct before the scrap.",
    lattice: { rules: "Rules · discrete", learning: "Learning · continuous" },
    before: {
      label: "Industry 3.0 · Rules",
      items: [
        "Hand-tuned thresholds",
        "Inspection at the end of the line",
        "Shift sheets and paper",
        "Machines as islands",
      ],
    },
    after: {
      label: "Industry 4.0 · Learning",
      items: [
        "Models trained on your own parts",
        "Correction in process, before scrap",
        "A live fleet view",
        "Machines report, agents correct",
      ],
    },
    log: {
      title: "agents.log · how a venture gets built",
      tag: "Illustrative workflow",
      steps: [
        { role: "plan", task: "slice the venture into shippable parts", status: "done" },
        { role: "code", task: "implement the connector for a new controller", status: "done" },
        { role: "review", task: "flag issues in the correction clamp", status: "done" },
        { role: "test", task: "generate cases from real cycle logs", status: "done" },
        { role: "translate", task: "site and dashboard, EN → PT", status: "done" },
      ],
      human: { role: "human", task: "decide, and ship to the floor", status: "awaiting" },
    },
  },
  story: {
    id: "story",
    index: "06",
    label: "Story",
    aside: "2004 → Now",
    title: "Shipping pixels since 2004",
    entries: [
      { year: "2004", role: "Flash e-learning content", org: "Novabase" },
      { year: "2007", role: "Dynamic Flash websites", org: "Pkage Design" },
      { year: "2010", role: "Digital campaigns", org: "Havas Worldwide (Euro RSCG), Leo Burnett" },
      { year: "2013", role: "Interactive kiosks and queue systems", org: "Mobbit Systems" },
      { year: "2014", role: "Nutri Ventures game", org: "The Hotel" },
      { year: "2015", role: "HTML5 casino games in Pixi.js and WebGL", org: "Gamesys" },
      {
        year: "2018",
        role: "Tools and marketing sites for AAA games: Final Fantasy VII, Life is Strange, Forspoken, Outriders",
        org: "Square Enix",
      },
      { year: "Now", role: "Founder", org: "Pixelkiller and Undrd Control", current: true },
    ],
  },
  contact: {
    id: "contact",
    index: "07",
    label: "Contact",
    aside: "Pedro Sousa Martins",
    prompt: "Got an industry still running on clipboards?",
    title: "Let’s rewire it.",
    email: { label: email, href: `mailto:${email}` },
    linksLabel: "Elsewhere",
    links: [
      { label: "LinkedIn", href: "https://pt.linkedin.com/pub/pedro-martins/18/762/302" },
      { label: "GitHub", href: "https://github.com/acewf" },
    ],
  },
  footer: {
    line: "Pixelkiller Ltd · United Kingdom · © 2026",
    backToTop: "Back to top ↑",
  },
  notFound: {
    title: "Page not found · Pixelkiller",
    code: "404",
    label: "Page not found",
    heading: "This page isn’t on the floor.",
    body: "The link may be out of date, or the page has moved on. Start again from the home page.",
    cta: { label: "Back to the home page", href: "/" },
  },
};
