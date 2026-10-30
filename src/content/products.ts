import type { IconName } from "@/components/ui/icon";

/**
 * Products built and run by the studio. Each one is either downloaded
 * (desktop or mobile app) or hosted on its own subdomain of
 * `productsDomain`. Adding a product is a one-entry change here: the
 * /products page, the product's own page, the home page showcase, the
 * footer, the sitemap and llms.txt all read from this list.
 */
export const productsDomain = "deltacreationco.com";

export type ProductStatus = "available" | "beta" | "in-development";

export const productStatusLabels: Record<ProductStatus, string> = {
  available: "Available now",
  beta: "Public beta",
  "in-development": "In development",
};

export type DownloadPlatform = {
  /** e.g. "macOS", "Windows", "Android". */
  name: string;
  /** Direct link to the installer. Leave empty until the build is published. */
  href?: string;
  /** Small print under the button, e.g. "Apple silicon & Intel". */
  note?: string;
};

export type ProductDelivery =
  /** Runs in the browser at https://<subdomain>.<productsDomain>. */
  | { kind: "web"; subdomain: string }
  /** Installed on the device. `subdomain` optionally hosts its own site. */
  | { kind: "download"; platforms: DownloadPlatform[]; subdomain?: string };

/** Which illustrated interface to show when no screenshot is set. */
export type ProductPreviewKind = "editor" | "analyst" | "chat" | "commerce" | "pos";

export type Product = {
  slug: string;
  name: string;
  /** True while the name is a placeholder; shown as "working name". */
  workingName?: boolean;
  category: string;
  tagline: string;
  /** One or two sentences for cards. */
  summary: string;
  /** Page headline. Wrap words in *asterisks* for the accent font. */
  headline: string;
  description: string;
  status: ProductStatus;
  delivery: ProductDelivery;
  /** Brand colour used for the product's glow and details. */
  color: string;
  preview: ProductPreviewKind;
  /**
   * Optional real screenshot in /public (e.g. "/products/cutaway.png").
   * When set it replaces the illustrated preview.
   */
  screenshot?: { src: string; width: number; height: number };
  /** Short facts shown as tags. */
  highlights: string[];
  features: { icon: IconName; title: string; detail: string }[];
  seo: { title: string; description: string };
};

export const products: Product[] = [
  {
    slug: "cutaway",
    name: "Cutaway",
    category: "Video editor",
    tagline: "Edit video at the speed you think.",
    summary:
      "A fast, focused desktop video editor. Cut, arrange and export without wading through menus or waiting on renders.",
    headline: "Edit video at the *speed you think.*",
    description:
      "Cutaway is a desktop video editor built for people who make a lot of video. A clean multi-track timeline, instant playback and sensible export presets keep you in the edit instead of in the settings.",
    status: "available",
    delivery: {
      kind: "download",
      subdomain: "cutaway",
      platforms: [
        { name: "macOS", href: "https://cutaway.deltacreationco.com/download/macos" },
        { name: "Windows", href: "https://cutaway.deltacreationco.com/download/windows" },
      ],
    },
    color: "#ff5a1f",
    preview: "editor",
    highlights: ["Desktop app", "Multi-track timeline", "Runs locally"],
    features: [
      {
        icon: "layers",
        title: "Multi-track timeline",
        detail:
          "Stack video, titles and audio on as many tracks as the edit needs, with snapping that stays out of the way.",
      },
      {
        icon: "scissors",
        title: "Fast, precise cuts",
        detail: "Split, trim and ripple-delete from the keyboard. Every edit is non-destructive and can be undone.",
      },
      {
        icon: "film",
        title: "Instant playback",
        detail: "Scrub and play back your edit as you work, without waiting for previews to render.",
      },
      {
        icon: "gauge",
        title: "Export presets",
        detail:
          "One-click exports sized for the places your video is going, from social feeds to full-resolution masters.",
      },
      {
        icon: "lock",
        title: "Your files stay yours",
        detail: "Cutaway runs on your computer. Your footage is never uploaded anywhere to be edited.",
      },
      {
        icon: "zap",
        title: "Built to feel light",
        detail: "A focused set of tools, a quick start-up and an interface that keeps the picture front and centre.",
      },
    ],
    seo: {
      title: "Cutaway: A Fast, Focused Desktop Video Editor",
      description:
        "Cutaway is a desktop video editor with a multi-track timeline, instant playback and one-click export presets. Download it for macOS or Windows.",
    },
  },
  {
    slug: "pvchat",
    name: "PVChat",
    category: "Private messaging",
    tagline: "Private chat rooms that leave no trace.",
    summary:
      "Anonymous, end-to-end encrypted chat rooms. No accounts, no names, no emails, and nothing kept once the room closes.",
    headline: "Chat rooms that *leave no trace.*",
    description:
      "Create a room in one click, set its rules and share the link. Messages are encrypted in the browser, so the server only passes along data it can't read, and rooms live in memory until they close.",
    status: "available",
    delivery: { kind: "web", subdomain: "pvchat" },
    color: "#4ff0b0",
    preview: "chat",
    highlights: ["Web app", "End-to-end encrypted", "No sign-up"],
    features: [
      {
        icon: "lock",
        title: "End-to-end encrypted",
        detail:
          "Messages and names are encrypted in the browser with AES-256-GCM. The key comes from the room link and never reaches the server.",
      },
      {
        icon: "user",
        title: "No accounts at all",
        detail:
          "No sign-up, no names, no emails. Anyone can open a room in one click and invite people by link or code.",
      },
      {
        icon: "shield",
        title: "Rules before you join",
        detail:
          "The creator sets the room's rules, and everyone sees and agrees to them on a lobby screen before entering.",
      },
      {
        icon: "timer",
        title: "Messages that expire",
        detail: "Rooms close after an hour, a day or a week, and messages can disappear after 5 minutes or an hour.",
      },
      {
        icon: "key",
        title: "Optional passcode",
        detail:
          "Add a passcode and it's mixed into the encryption key, so even someone holding the link can't read a thing without it.",
      },
      {
        icon: "eye",
        title: "Creator controls",
        detail: "Approve each person from a waiting room, remove people, lock the room or end it for everyone.",
      },
    ],
    seo: {
      title: "PVChat: Private, Anonymous, End-to-End Encrypted Chat Rooms",
      description:
        "Open an anonymous chat room in one click. End-to-end encrypted, no accounts, nothing stored on disk, and rooms that close on their own.",
    },
  },
  {
    slug: "bizretriever",
    name: "BizRetriever",
    category: "AI business analyst",
    tagline: "Your spreadsheets, turned into answers.",
    summary:
      "The AI business analyst for small retailers and online sellers. Upload messy spreadsheets and get plain-language answers, a dashboard and early warnings.",
    headline: "Your messy spreadsheets, turned into *answers.*",
    description:
      "BizRetriever reads the spreadsheets you already have, builds a clean model of your business and answers questions in plain language. Every number shows how it was calculated and where it came from.",
    status: "in-development",
    delivery: { kind: "web", subdomain: "bizretriever" },
    color: "#7fb2ff",
    preview: "analyst",
    highlights: ["Web app", "For retail & e-commerce", "Mobile-first"],
    features: [
      {
        icon: "file",
        title: "Bring your own spreadsheets",
        detail:
          "Upload exports from your shop, marketplaces and tills as they are. BizRetriever works out what's in them.",
      },
      {
        icon: "chat",
        title: "Ask in plain language",
        detail: "“What sold best last month?” gets a straight answer, written for a busy owner, not an analyst.",
      },
      {
        icon: "chart",
        title: "A dashboard, automatically",
        detail: "Sales, profit, stock and customers laid out for you the moment your data is in. No setup.",
      },
      {
        icon: "bell",
        title: "Warnings before problems",
        detail: "Proactive insights flag slipping margins, stock about to run out and customers who've gone quiet.",
      },
      {
        icon: "search",
        title: "Shows its working",
        detail: "Every number links to how it was calculated and the file, sheet and record it came from.",
      },
      {
        icon: "undo",
        title: "Nothing behind your back",
        detail: "Your data is never deleted or overwritten without asking, and every change can be undone.",
      },
    ],
    seo: {
      title: "BizRetriever: The AI Business Analyst for Small Retailers",
      description:
        "Upload messy spreadsheets and get plain-language answers, an automatic dashboard and proactive insights about your shop. Coming soon.",
    },
  },
  {
    slug: "hatti",
    name: "Hatti",
    workingName: true,
    category: "Commerce platform",
    tagline: "Online selling, built for how Pakistan buys.",
    summary:
      "An affordable alternative to Shopify for Pakistani merchants, with cash on delivery, WhatsApp, local couriers, wallets and Urdu built in.",
    headline: "Online selling, built for *how Pakistan buys.*",
    description:
      "Hatti is a complete commerce platform: store builder, themes, checkout, orders, marketing and analytics. It's designed around cash on delivery, WhatsApp, local couriers, wallets and Raast, with plans priced in rupees and 0% transaction fees.",
    status: "in-development",
    delivery: { kind: "web", subdomain: "hatti" },
    color: "#f5c04a",
    preview: "commerce",
    highlights: ["Web platform", "0% transaction fees", "English & Urdu"],
    features: [
      {
        icon: "store",
        title: "Store builder & themes",
        detail: "Launch a fast storefront from ready-made themes in English and Urdu, then make it your own.",
      },
      {
        icon: "wallet",
        title: "Cash on delivery, done right",
        detail: "A checkout designed around COD, plus wallets and Raast, so customers pay the way they already do.",
      },
      {
        icon: "chat",
        title: "WhatsApp built in",
        detail: "Confirm orders and keep customers updated on the channel they actually read.",
      },
      {
        icon: "send",
        title: "Local couriers",
        detail: "Book deliveries, print labels and track parcels with the couriers Pakistani sellers already use.",
      },
      {
        icon: "receipt",
        title: "Priced in rupees",
        detail: "Simple plans in PKR with 0% transaction fees, so a good month doesn't cost you more.",
      },
      {
        icon: "languages",
        title: "English and Urdu",
        detail: "The storefront and the admin speak both languages, including right-to-left layouts.",
      },
    ],
    seo: {
      title: "Hatti: The Commerce Platform Built for Pakistan",
      description:
        "An affordable Shopify alternative for Pakistani merchants, with cash on delivery, WhatsApp, local couriers, wallets, Urdu and 0% transaction fees. In development.",
    },
  },
  {
    slug: "keel",
    name: "Keel",
    workingName: true,
    category: "Point of sale",
    tagline: "The point of sale that never stops selling.",
    summary:
      "A local-first point-of-sale system. Every in-store function keeps working without the internet, with no locked-in processor or hardware.",
    headline: "The point of sale that *never stops selling.*",
    description:
      "Keel keeps the whole store running when the internet or the cloud goes down: taking orders, payments, loyalty and close-out. It works with your choice of payment processor and commodity hardware, on fair month-to-month terms.",
    status: "in-development",
    delivery: { kind: "download", platforms: [{ name: "Android" }] },
    color: "#b69cff",
    preview: "pos",
    highlights: ["Register app + cloud", "Works offline", "Processor-agnostic"],
    features: [
      {
        icon: "offline",
        title: "Local-first",
        detail:
          "Every in-store function runs without the internet. Devices keep each other in sync on the store's own network.",
      },
      {
        icon: "plug",
        title: "Your processor, your hardware",
        detail: "Choose your payment processor and use commodity hardware. No penalty fees and no locked devices.",
      },
      {
        icon: "receipt",
        title: "Explainable pricing",
        detail:
          "Discounts, tax and rounding are calculated the same on every device, with a trace of how each total was reached.",
      },
      {
        icon: "shield",
        title: "Tamper-evident history",
        detail: "Every sale is recorded in a signed, hash-chained event log that's ready for audits and fiscal rules.",
      },
      {
        icon: "workflow",
        title: "One catalog, one kitchen queue",
        detail: "Orders from every channel land in one place, paced to what the kitchen can handle.",
      },
      {
        icon: "folder",
        title: "Leave whenever you like",
        detail: "Month-to-month terms, no early-termination fee and a one-click export of all your data.",
      },
    ],
    seo: {
      title: "Keel: The Local-First Point of Sale That Never Stops Selling",
      description:
        "A point-of-sale system where every in-store function works offline, with your choice of processor and hardware and fair month-to-month terms. In development.",
    },
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productSiteUrl(product: Product) {
  const subdomain = product.delivery.subdomain;
  return subdomain ? `https://${subdomain}.${productsDomain}` : undefined;
}

/** Short "how you get it" line, e.g. "Web app · pvchat.deltacreationco.com". */
export function productDeliveryLabel(product: Product) {
  const { delivery } = product;
  if (delivery.kind === "web") return `Web app · ${delivery.subdomain}.${productsDomain}`;
  return `Download · ${delivery.platforms.map((p) => p.name).join(", ")}`;
}

export type ProductAction = { label: string; href: string; external: boolean };

/** The main call to action for a product, based on its status and delivery. */
export function productPrimaryAction(product: Product, email: string): ProductAction {
  if (product.status === "in-development") {
    return {
      label: "Get early access",
      href: `mailto:${email}?subject=${encodeURIComponent(`Early access: ${product.name}`)}`,
      external: true,
    };
  }
  if (product.delivery.kind === "download") {
    const first = product.delivery.platforms.find((p) => p.href);
    if (first?.href) return { label: `Download for ${first.name}`, href: first.href, external: true };
  }
  const url = productSiteUrl(product);
  if (url) return { label: `Open ${product.name}`, href: url, external: true };
  return { label: "Learn more", href: `/products/${product.slug}`, external: false };
}
