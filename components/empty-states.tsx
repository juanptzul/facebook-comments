import { AtSign, Inbox, UserRound } from "lucide-react"

type Tab = "all" | "mine" | "mentions"

export function CenterEmpty() {
  return (
    <div className="grid h-full place-items-center px-8 py-10">
      <div className="flex max-w-sm flex-col items-center text-center">
        <PostBubblesIllustration />
        <h3
          className="animate-panel-in mt-6 font-display text-[22px] font-medium leading-[1.15] tracking-tight text-foreground"
          style={{ animationDelay: "200ms" }}
        >
          Select a post to view comments
        </h3>
        <p
          className="animate-panel-in mt-1.5 text-[13px] leading-relaxed text-muted-foreground"
          style={{ animationDelay: "280ms" }}
        >
          Pick a post from the list on the left to see its comments, reply to commenters, and moderate activity.
        </p>
      </div>
    </div>
  )
}

function PostBubblesIllustration() {
  return (
    <svg
      viewBox="0 0 180 140"
      className="animate-illustration-in h-44 w-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Soft halo */}
      <circle cx="90" cy="70" r="62" fill="#EEF2F7" />

      {/* Post card */}
      <rect
        x="36"
        y="20"
        width="92"
        height="66"
        rx="15"
        fill="white"
        stroke="#CBD5E1"
        strokeWidth="1.25"
      />
      <rect x="44" y="28" width="18" height="18" rx="4" fill="#E2E8F0" />
      <circle cx="53" cy="37" r="3" fill="#CBD5E1" />
      <rect x="68" y="30" width="36" height="3" rx="1.5" fill="#94A3B8" />
      <rect x="68" y="38" width="22" height="3" rx="1.5" fill="#CBD5E1" />
      <rect x="44" y="55" width="76" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="44" y="63" width="58" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="44" y="71" width="40" height="3" rx="1.5" fill="#E2E8F0" />

      {/* Bubble — small, back-right */}
      <g transform="translate(118, 82)">
        <path
          d="M8 0 H25 A8 8 0 0 1 33 8 V11 A8 8 0 0 1 25 19 H14 L8 24 V19 A8 8 0 0 1 0 11 V8 A8 8 0 0 1 8 0 Z"
          fill="white"
          stroke="#CBD5E1"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <rect x="9" y="8" width="16" height="2.5" rx="1.25" fill="#E2E8F0" />
      </g>

      {/* Bubble — main highlighted (with gentle float loop) */}
      <g transform="translate(64, 88)">
        <g className="animate-bubble-float">
          <path
            d="M14 0 H51 A14 14 0 0 1 65 14 V18 A14 14 0 0 1 51 32 H24 L14 42 V32 A14 14 0 0 1 0 18 V14 A14 14 0 0 1 14 0 Z"
            fill="#CCE6FE"
            stroke="#2563EB"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect x="18" y="11" width="38" height="3" rx="1.5" fill="#2563EB" fillOpacity="0.55" />
          <rect x="18" y="19" width="26" height="3" rx="1.5" fill="#2563EB" fillOpacity="0.3" />
        </g>
      </g>

      {/* Bubble — small, front-left */}
      <g transform="translate(28, 100)">
        <path
          d="M6 0 H22 A6 6 0 0 1 28 6 V10 A6 6 0 0 1 22 16 H10 L6 21 V16 A6 6 0 0 1 0 10 V6 A6 6 0 0 1 6 0 Z"
          fill="white"
          stroke="#CBD5E1"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        <rect x="7" y="6" width="14" height="2.5" rx="1.25" fill="#E2E8F0" />
      </g>
    </svg>
  )
}

export function PostListEmpty({ tab }: { tab: Tab }) {
  const content = {
    all: {
      Icon: Inbox,
      title: "No posts yet",
      subtitle: "New posts with comments will appear here.",
    },
    mine: {
      Icon: UserRound,
      title: "No assigned posts",
      subtitle: "Posts with comments assigned to you will show up here.",
    },
    mentions: {
      Icon: AtSign,
      title: "No mentions",
      subtitle: "When your page is mentioned in a comment, it'll appear here.",
    },
  }[tab]
  const { Icon, title, subtitle } = content
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-400" strokeWidth={1.75} />
      </div>
      <h3 className="mt-4 text-[13px] font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-[220px] text-[12px] leading-snug text-muted-foreground">
        {subtitle}
      </p>
    </div>
  )
}
