import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "@/components/ui/icon";
import type { Product } from "@/content/products";
import { productsDomain } from "@/content/products";
import { cn } from "@/lib/utils";

/**
 * A product's interface inside a window frame. Shows the real screenshot
 * when one is set, otherwise an illustrated (non-interactive) mock-up of
 * the product's main screen. Panels collapse with container queries, so
 * it reads well from a phone-width card up to a full-width stage.
 */
export function ProductPreview({ product, className }: { product: Product; className?: string }) {
  const title =
    product.delivery.kind === "web" ? `${product.delivery.subdomain}.${productsDomain}` : windowTitles[product.preview];

  return (
    <div
      className={cn(
        "@container overflow-hidden rounded-[1.1rem] border border-white/10 bg-ink-900 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]",
        className,
      )}
      style={{ "--product": product.color } as CSSProperties}
      role="img"
      aria-label={`${product.name} interface preview`}
    >
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.07] bg-ink-850 px-3.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span
          className={cn(
            "truncate font-mono text-[0.68rem] text-fog-500",
            product.delivery.kind === "web" && "mx-auto rounded-md bg-white/[0.04] px-3 py-0.5",
          )}
        >
          {product.delivery.kind === "web" && <Icon name="lock" className="mr-1.5 inline size-3 align-[-2px]" />}
          {title}
        </span>
        {product.delivery.kind === "web" && <span className="w-[42px]" aria-hidden="true" />}
      </div>
      <div aria-hidden="true">
        {product.screenshot ? (
          <Image
            src={product.screenshot.src}
            width={product.screenshot.width}
            height={product.screenshot.height}
            alt=""
            className="h-auto w-full"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
        ) : (
          <div className="aspect-[4/5] text-[11px] leading-tight text-fog-300 select-none @md:aspect-[4/3] @xl:aspect-[16/10]">
            {mocks[product.preview]}
          </div>
        )}
      </div>
    </div>
  );
}

const windowTitles: Record<Product["preview"], string> = {
  editor: "Cutaway — Launch film.cut",
  analyst: "BizRetriever",
  chat: "PVChat",
  commerce: "Hatti Admin",
  pos: "Keel Register · Front counter",
};

/** Deterministic pseudo-random values, so server and client render the same bars. */
function noise(seed: number, count: number, min = 0.15, max = 1) {
  return Array.from({ length: count }, (_, i) => {
    const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    return min + (x - Math.floor(x)) * (max - min);
  });
}

function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg border border-white/[0.07] bg-white/[0.025]", className)}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/*  Cutaway: video editor                                              */
/* ------------------------------------------------------------------ */

function EditorMock() {
  const clipsV2 = [
    { left: 18, width: 14, label: "Title" },
    { left: 58, width: 12, label: "Lower third" },
  ];
  const clipsV1 = [
    { left: 0, width: 22, label: "A001_intro" },
    { left: 22.4, width: 17, label: "B-roll_03" },
    { left: 39.8, width: 26, label: "A002_interview" },
    { left: 66.2, width: 15, label: "B-roll_07" },
    { left: 81.6, width: 18, label: "A004_outro" },
  ];

  return (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex min-h-0 flex-[1.15] gap-2 p-2">
        <Panel className="hidden w-[22%] flex-col p-2 @2xl:flex">
          <p className="mb-2 font-mono text-[9px] tracking-wider text-fog-500 uppercase">Media · 24</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[210, 25, 260, 190, 330, 15].map((hue, i) => (
              <div key={i} className="overflow-hidden rounded-[5px] border border-white/[0.06]">
                <div
                  className="aspect-video"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 45% 32%), hsl(${hue + 30} 35% 14%))`,
                  }}
                />
              </div>
            ))}
          </div>
        </Panel>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_65%_40%,#e07a4a_0%,#7a2f1a_38%,#1a0d0a_75%)]" />
            <div className="absolute bottom-0 left-[18%] h-[72%] w-[30%] rounded-t-[45%] bg-[#120806]/85 blur-[1px]" />
            <div className="absolute top-[18%] right-[16%] size-[18%] rounded-full bg-[#ffd2a8]/70 blur-xl" />
            <div className="absolute inset-x-[12%] bottom-[10%] text-center">
              <span className="rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white/90">
                We started with one simple idea.
              </span>
            </div>
            <span className="absolute top-2 left-2 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white/80">
              1080p · 30fps
            </span>
          </div>
          <div className="flex items-center justify-between px-1 font-mono text-[10px] text-fog-400">
            <span className="text-[var(--product)]">00:01:12:08</span>
            <span className="flex items-center gap-2 text-fog-300">
              <span>◀◀</span>
              <span className="grid size-5 place-items-center rounded-full bg-fog-100 text-[8px] text-ink-950">▶</span>
              <span>▶▶</span>
            </span>
            <span>00:03:40:00</span>
          </div>
        </div>

        <Panel className="hidden w-[20%] flex-col gap-2.5 p-2.5 @xl:flex">
          <p className="font-mono text-[9px] tracking-wider text-fog-500 uppercase">Inspector</p>
          {[
            ["Scale", 72],
            ["Opacity", 100],
            ["Exposure", 54],
            ["Volume", 64],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-[9px] text-fog-400">
                <span>{label}</span>
                <span className="font-mono">{value}</span>
              </div>
              <div className="h-1 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--product)]" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </Panel>
      </div>

      <div className="relative flex flex-1 flex-col border-t border-white/[0.07] bg-ink-900 px-2 pt-1.5 pb-2">
        <div className="mb-1 flex h-3 items-end gap-0 pl-7">
          {Array.from({ length: 40 }, (_, i) => (
            <span key={i} className={cn("flex-1 border-l border-white/10", i % 5 === 0 ? "h-3" : "h-1.5")} />
          ))}
        </div>
        <div className="relative flex flex-1 flex-col gap-1">
          <Track label="V2">
            {clipsV2.map((c) => (
              <Clip key={c.label} {...c} className="border-[#b69cff]/40 bg-[#b69cff]/25 text-[#e3d9ff]" />
            ))}
          </Track>
          <Track label="V1">
            {clipsV1.map((c) => (
              <Clip
                key={c.label}
                {...c}
                className="border-[var(--product)]/50 bg-[color-mix(in_oklab,var(--product)_28%,transparent)] text-white/90"
              />
            ))}
          </Track>
          <Track label="A1">
            <Wave left={0} width={65.8} seed={1} className="bg-[#4ff0b0]/12 text-[#4ff0b0]/70" />
            <Wave left={66.2} width={33.4} seed={2} className="bg-[#4ff0b0]/12 text-[#4ff0b0]/70" />
          </Track>
          <Track label="A2">
            <Wave left={0} width={99.6} seed={3} className="bg-[#7fb2ff]/10 text-[#7fb2ff]/60" />
          </Track>
          <div className="pointer-events-none absolute inset-y-[-14px] right-0 left-7">
            <div className="playhead absolute inset-y-0 w-px bg-fog-100" style={{ left: "46%" }}>
              <span className="absolute -top-0.5 -left-[4px] size-[9px] rotate-45 rounded-[2px] bg-fog-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Track({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
      <span className="w-5.5 shrink-0 self-center font-mono text-[9px] text-fog-500">{label}</span>
      <div className="relative flex-1 rounded-[4px] bg-white/[0.02]">{children}</div>
    </div>
  );
}

function Clip({ left, width, label, className }: { left: number; width: number; label: string; className?: string }) {
  return (
    <div
      className={cn("absolute inset-y-0 overflow-hidden rounded-[4px] border px-1.5 pt-0.5", className)}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="block truncate text-[9px]">{label}</span>
    </div>
  );
}

function Wave({ left, width, seed, className }: { left: number; width: number; seed: number; className?: string }) {
  const bars = noise(seed, Math.max(8, Math.round(width * 0.9)));
  return (
    <div
      className={cn("absolute inset-y-0 flex items-center gap-px overflow-hidden rounded-[4px] px-1", className)}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      {bars.map((h, i) => (
        <span key={i} className="w-full rounded-full bg-current" style={{ height: `${h * 80}%` }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BizRetriever: AI business analyst                                  */
/* ------------------------------------------------------------------ */

function AnalystMock() {
  const bars = [
    { label: "Linen tote", value: 92 },
    { label: "Canvas apron", value: 71 },
    { label: "Ceramic mug", value: 58 },
    { label: "Wool throw", value: 44 },
    { label: "Candle set", value: 31 },
  ];
  return (
    <div className="flex h-full bg-ink-950">
      <nav className="hidden w-[17%] flex-col gap-0.5 border-r border-white/[0.07] p-2.5 @2xl:flex">
        <p className="mb-2 flex items-center gap-1.5 font-medium text-fog-100">
          <span className="size-3 rounded-[4px] bg-[var(--product)]" />
          Linen &amp; Co.
        </p>
        {["Home", "Ask", "Dashboard", "Insights", "Your data"].map((item) => (
          <span
            key={item}
            className={cn("rounded-md px-2 py-1.5", item === "Ask" ? "bg-white/[0.06] text-fog-100" : "text-fog-400")}
          >
            {item}
          </span>
        ))}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
        <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-[var(--product)] px-3 py-2 text-[11px] text-ink-950">
          Which products made the most profit last month?
        </div>
        <Panel className="flex min-h-0 flex-1 flex-col gap-2.5 p-3">
          <p className="text-[12px] text-fog-100">
            <span className="font-medium">Linen tote</span> made the most profit in September:{" "}
            <span className="font-medium text-[var(--product)]">$4,180</span>, up 23% on August.
          </p>
          <div className="flex min-h-0 flex-1 flex-col justify-around gap-1.5">
            {bars.map((b, i) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="w-[24%] shrink-0 truncate text-[10px] text-fog-400">{b.label}</span>
                <div className="h-[9px] flex-1 rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${b.value}%`,
                      background: i === 0 ? "var(--product)" : "color-mix(in oklab, var(--product) 38%, #27272f)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="flex gap-3 text-[10px] text-fog-500">
            <span className="text-[var(--product)] underline underline-offset-2">How I calculated this</span>
            <span>From: shopify-orders.csv, costs.xlsx</span>
          </p>
        </Panel>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-fog-500">
          <Icon name="sparkles" className="size-3 text-[var(--product)]" />
          Ask about your sales, stock or customers…
        </div>
      </div>

      <div className="hidden w-[27%] flex-col gap-2 border-l border-white/[0.07] p-2.5 @xl:flex">
        <p className="font-mono text-[9px] tracking-wider text-fog-500 uppercase">Insights</p>
        {[
          { tone: "#ffb44a", title: "Linen tote sells out in ~6 days", body: "At this pace, reorder by Friday." },
          { tone: "#ff7a7a", title: "Margin slipping on mugs", body: "Down from 41% to 33% since the price change." },
          { tone: "#4ff0b0", title: "14 customers came back", body: "Repeat orders are up 9% this month." },
        ].map((card) => (
          <Panel key={card.title} className="p-2">
            <p className="flex items-center gap-1.5 text-[10px] font-medium text-fog-100">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: card.tone }} />
              {card.title}
            </p>
            <p className="mt-1 text-[9.5px] text-fog-400">{card.body}</p>
          </Panel>
        ))}
        <Panel className="mt-auto p-2">
          <p className="text-[9px] text-fog-500">Revenue · 30 days</p>
          <p className="mt-0.5 text-[15px] font-medium tracking-tight text-fog-100">$38,920</p>
          <svg viewBox="0 0 100 28" className="mt-1 h-7 w-full text-[var(--product)]" preserveAspectRatio="none">
            <path
              d="M0 22 L10 19 L20 21 L30 15 L40 17 L50 11 L60 13 L70 8 L80 10 L90 5 L100 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PVChat: private chat rooms                                         */
/* ------------------------------------------------------------------ */

function ChatMock() {
  const messages = [
    { who: "Quiet Otter", me: false, text: "Is everyone in? Sharing the draft now.", time: "21:04" },
    { who: "You", me: true, text: "In. Link worked first time.", time: "21:04" },
    { who: "Amber Fox", me: false, text: "Same here. Love that there's no sign-up.", time: "21:05" },
    { who: "Quiet Otter", me: false, text: "Room closes at midnight, so read it tonight 🙂", time: "21:05" },
  ];
  return (
    <div className="flex h-full bg-ink-950">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
          <div>
            <p className="text-[12px] font-medium text-fog-100">Launch planning</p>
            <p className="font-mono text-[9px] text-fog-500">#HG2MS-N5M81-•••••-•••••</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--product)]/30 bg-[var(--product)]/10 px-2 py-0.5 text-[9.5px] text-[var(--product)]">
            <Icon name="lock" className="size-3" />
            End-to-end encrypted
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden p-3">
          <p className="mx-auto rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[9.5px] text-fog-500">
            Messages disappear after 1 hour
          </p>
          {messages.map((m, i) => (
            <div key={i} className={cn("flex max-w-[78%] flex-col items-start gap-0.5", m.me && "ml-auto items-end")}>
              {!m.me && <span className="px-1 text-[9px] text-fog-500">{m.who}</span>}
              <span
                className={cn(
                  "rounded-2xl px-3 py-1.5 text-[11px]",
                  m.me
                    ? "rounded-br-md bg-[var(--product)] text-ink-950"
                    : "rounded-bl-md bg-white/[0.06] text-fog-100",
                )}
              >
                {m.text}
              </span>
              <span className="px-1 font-mono text-[8.5px] text-fog-500">{m.time}</span>
            </div>
          ))}
          <p className="flex items-center gap-1 text-[9.5px] text-fog-500">
            <span className="typing-dots inline-flex gap-0.5">
              <span className="size-1 rounded-full bg-fog-400" />
              <span className="size-1 rounded-full bg-fog-400" />
              <span className="size-1 rounded-full bg-fog-400" />
            </span>
            Amber Fox is typing
          </p>
        </div>
        <div className="flex items-center gap-2 border-t border-white/[0.07] p-2">
          <span className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-fog-500">
            Write a message…
          </span>
          <span className="grid size-6 place-items-center rounded-full bg-[var(--product)] text-ink-950">
            <Icon name="send" className="size-3" />
          </span>
        </div>
      </div>

      <div className="hidden w-[30%] flex-col gap-2.5 border-l border-white/[0.07] p-3 @xl:flex">
        <p className="font-mono text-[9px] tracking-wider text-fog-500 uppercase">Room rules</p>
        {[
          ["Closes after", "24 hours"],
          ["Messages vanish", "after 1 hour"],
          ["People", "3 of 8"],
          ["Approval", "On"],
          ["Passcode", "Required"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 border-b border-white/[0.05] pb-1.5 text-[10px]">
            <span className="text-fog-400">{k}</span>
            <span className="text-fog-100">{v}</span>
          </div>
        ))}
        <p className="mt-1 font-mono text-[9px] tracking-wider text-fog-500 uppercase">In the room</p>
        {["Quiet Otter", "Amber Fox", "You"].map((n) => (
          <p key={n} className="flex items-center gap-1.5 text-[10px] text-fog-200">
            <span className="size-1.5 rounded-full bg-[var(--product)]" />
            {n}
          </p>
        ))}
        <span className="mt-auto rounded-md border border-white/10 py-1.5 text-center text-[10px] text-fog-300">
          Lock room
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hatti: commerce admin                                              */
/* ------------------------------------------------------------------ */

function CommerceMock() {
  const orders = [
    { id: "#1048", name: "Ayesha K.", city: "Lahore", pay: "COD", total: "Rs 6,450", status: "Confirmed" },
    { id: "#1047", name: "Bilal A.", city: "Karachi", pay: "Raast", total: "Rs 12,900", status: "Paid" },
    { id: "#1046", name: "Sana M.", city: "Islamabad", pay: "COD", total: "Rs 3,200", status: "Out for delivery" },
    { id: "#1045", name: "Hamza R.", city: "Multan", pay: "Wallet", total: "Rs 8,750", status: "Delivered" },
    { id: "#1044", name: "Fatima Z.", city: "Faisalabad", pay: "COD", total: "Rs 4,100", status: "Delivered" },
  ];
  return (
    <div className="flex h-full bg-ink-950">
      <nav className="hidden w-[16%] flex-col gap-0.5 border-r border-white/[0.07] p-2.5 @2xl:flex">
        <p className="mb-2 flex items-center gap-1.5 font-medium text-fog-100">
          <span className="grid size-3.5 place-items-center rounded-[4px] bg-[var(--product)] text-[8px] text-ink-950">
            H
          </span>
          Zari Studio
        </p>
        {["Home", "Orders", "Products", "Customers", "Marketing", "Online store"].map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-md px-2 py-1.5",
              item === "Orders" ? "bg-white/[0.06] text-fog-100" : "text-fog-400",
            )}
          >
            {item}
          </span>
        ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-fog-100">Orders</p>
          <span className="flex overflow-hidden rounded-full border border-white/10 text-[9.5px]">
            <span className="bg-white/10 px-2 py-0.5 text-fog-100">EN</span>
            <span className="px-2 py-0.5 text-fog-400" lang="ur">
              اردو
            </span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 @lg:grid-cols-3">
          {[
            ["Orders today", "128"],
            ["COD to collect", "Rs 214,500"],
            ["Delivered", "92%"],
          ].map(([k, v], i) => (
            <Panel key={k} className={cn("p-2", i === 2 && "hidden @lg:block")}>
              <p className="text-[9.5px] text-fog-500">{k}</p>
              <p className="mt-0.5 text-[14px] font-medium tracking-tight text-fog-100">{v}</p>
            </Panel>
          ))}
        </div>
        <Panel className="min-h-0 flex-1 overflow-hidden">
          <div className="grid grid-cols-[0.7fr_1.3fr_1fr_1fr] gap-2 border-b border-white/[0.07] px-2.5 py-1.5 text-[9px] tracking-wide text-fog-500 uppercase @xl:grid-cols-[0.7fr_1.3fr_1fr_0.8fr_1fr_1.4fr]">
            <span>Order</span>
            <span>Customer</span>
            <span className="hidden @xl:block">City</span>
            <span>Payment</span>
            <span className="hidden @xl:block">Total</span>
            <span>Status</span>
          </div>
          {orders.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[0.7fr_1.3fr_1fr_1fr] items-center gap-2 border-b border-white/[0.04] px-2.5 py-[0.42rem] text-[10.5px] @xl:grid-cols-[0.7fr_1.3fr_1fr_0.8fr_1fr_1.4fr]"
            >
              <span className="font-mono text-fog-400">{o.id}</span>
              <span className="truncate text-fog-100">{o.name}</span>
              <span className="hidden truncate text-fog-400 @xl:block">{o.city}</span>
              <span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[9px]",
                    o.pay === "COD" ? "bg-[var(--product)]/15 text-[var(--product)]" : "bg-white/[0.07] text-fog-200",
                  )}
                >
                  {o.pay}
                </span>
              </span>
              <span className="hidden text-fog-200 @xl:block">{o.total}</span>
              <span className="flex items-center gap-1 truncate text-fog-300">
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    o.status === "Delivered" || o.status === "Paid" ? "bg-[#4ff0b0]" : "bg-[#7fb2ff]",
                  )}
                />
                {o.status}
              </span>
            </div>
          ))}
        </Panel>
        <p className="flex items-center gap-1.5 text-[9.5px] text-fog-500">
          <Icon name="chat" className="size-3 text-[#4ff0b0]" />
          WhatsApp confirmations sent for 41 COD orders today
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Keel: point of sale register                                       */
/* ------------------------------------------------------------------ */

function PosMock() {
  const items = [
    { name: "Flat white", price: "4.20", hue: 28 },
    { name: "Oat latte", price: "4.60", hue: 35 },
    { name: "Cold brew", price: "4.00", hue: 20 },
    { name: "Croissant", price: "3.40", hue: 42 },
    { name: "Banana bread", price: "3.80", hue: 32 },
    { name: "Granola bowl", price: "6.90", hue: 95 },
    { name: "Matcha", price: "4.80", hue: 110 },
    { name: "Chai latte", price: "4.40", hue: 25 },
    { name: "Avocado toast", price: "8.50", hue: 80 },
  ];
  const ticket = [
    ["2 × Flat white", "8.40"],
    ["1 × Croissant", "3.40"],
    ["1 × Avocado toast", "8.50"],
    ["   + Poached egg", "1.50"],
  ];
  return (
    <div className="flex h-full flex-col bg-ink-950">
      <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#4ff0b0]/[0.06] px-3 py-1.5 text-[10px]">
        <span className="flex items-center gap-1.5 text-[#4ff0b0]">
          <Icon name="offline" className="size-3" />
          Offline · selling normally
        </span>
        <span className="font-mono text-[9px] text-fog-500">14 sales will sync when back online</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col gap-2 p-2.5">
          <div className="flex gap-1.5 text-[10px]">
            {["Coffee", "Bakery", "Breakfast", "Drinks"].map((c, i) => (
              <span
                key={c}
                className={cn(
                  "rounded-full px-2.5 py-1",
                  i === 0 ? "bg-[var(--product)] text-ink-950" : "border border-white/10 text-fog-400",
                )}
              >
                {c}
              </span>
            ))}
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5 @lg:grid-cols-3">
            {items.map((item, i) => (
              <div
                key={item.name}
                className={cn(
                  "flex flex-col justify-between rounded-lg border border-white/[0.07] p-2",
                  i >= 6 && "hidden @lg:flex",
                )}
                style={{ background: `linear-gradient(160deg, hsl(${item.hue} 30% 16%), hsl(${item.hue} 20% 9%))` }}
              >
                <span className="text-[10.5px] font-medium text-fog-100">{item.name}</span>
                <span className="font-mono text-[10px] text-fog-400">${item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden w-[36%] flex-col border-l border-white/[0.07] bg-ink-900 p-2.5 @md:flex">
          <p className="flex justify-between text-[10px] text-fog-500">
            <span>Table 4 · Check 1</span>
            <span className="font-mono">#A-2291</span>
          </p>
          <div className="mt-2 flex flex-1 flex-col gap-1.5">
            {ticket.map(([label, price]) => (
              <p key={label} className="flex justify-between gap-2 text-[10.5px]">
                <span
                  className={cn("truncate whitespace-pre", label.startsWith(" ") ? "text-fog-500" : "text-fog-100")}
                >
                  {label}
                </span>
                <span className="font-mono text-fog-300">{price}</span>
              </p>
            ))}
          </div>
          <div className="space-y-1 border-t border-white/[0.07] pt-2 text-[10px]">
            <p className="flex justify-between text-fog-400">
              <span>Subtotal</span>
              <span className="font-mono">21.80</span>
            </p>
            <p className="flex justify-between text-fog-400">
              <span>Tax 8.875%</span>
              <span className="font-mono">1.93</span>
            </p>
            <p className="flex justify-between text-[12px] font-medium text-fog-100">
              <span>Total</span>
              <span className="font-mono">$23.73</span>
            </p>
          </div>
          <span className="mt-2 rounded-lg bg-[var(--product)] py-2 text-center text-[11px] font-medium text-ink-950">
            Charge $23.73
          </span>
        </div>
      </div>
    </div>
  );
}

const mocks: Record<Product["preview"], ReactNode> = {
  editor: <EditorMock />,
  analyst: <AnalystMock />,
  chat: <ChatMock />,
  commerce: <CommerceMock />,
  pos: <PosMock />,
};
