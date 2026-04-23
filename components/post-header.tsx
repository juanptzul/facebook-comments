"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  EyeOff,
  Facebook,
  Filter,
  Layers,
  Lock,
  MessageCircle,
  Reply,
  ThumbsUp,
  Trash2,
  UserRound,
} from "lucide-react"
import { activePost, subThreads } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export type Filter = "unanswered" | "answered" | "all"

type Props = {
  filter: Filter
  setFilter: (f: Filter) => void
}

export function PostHeader({ filter, setFilter }: Props) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const visibleCount =
    filter === "unanswered"
      ? subThreads.filter((t) => t.state === "open").length
      : filter === "answered"
        ? subThreads.filter((t) => t.state === "closed").length
        : subThreads.length

  useEffect(() => {
    if (!filterOpen) return
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [filterOpen])

  return (
    <header className="rounded-xl bg-card shadow-card ring-1 ring-black/[0.05]">
      {/* Top meta row */}
      <div className="flex items-start gap-3 px-5 pt-3.5 pb-3">
        <div className="relative mt-0.5 h-7 w-7 shrink-0">
          <img
            src={`/placeholder.svg?height=56&width=56&query=${encodeURIComponent(activePost.thumbnailQuery)}`}
            alt=""
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-7 w-7 rounded-md object-cover ring-1 ring-border transition-opacity duration-300 ease-out",
              collapsed ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground transition-opacity duration-300 ease-out",
              collapsed ? "opacity-0" : "opacity-100",
            )}
          >
            <UserRound className="h-3.5 w-3.5" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#1877F2] ring-2 ring-card">
            <Facebook className="h-2 w-2 fill-white text-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[14px] font-semibold leading-5 text-foreground">
            {activePost.pageName}
          </h2>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
              {activePost.statusType}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <span>{activePost.postedAt}</span>
          </div>
          <div
            aria-hidden={!collapsed}
            className={cn(
              "grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out",
              collapsed ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <p className="overflow-hidden truncate text-[12px] leading-5 text-foreground/75">
              {activePost.message}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <a
            href={activePost.permalinkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            Open
          </a>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand post details" : "Collapse post details"}
            aria-expanded={!collapsed}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300 ease-out",
                collapsed ? "rotate-0" : "rotate-180",
              )}
            />
          </button>
        </div>
      </div>

      {/* Collapsible section: thumbnail + message + stats */}
      <div
        aria-hidden={collapsed}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex items-start gap-3 px-5 pb-3.5">
            <img
              src={`/placeholder.svg?height=96&width=96&query=${encodeURIComponent(activePost.thumbnailQuery)}`}
              alt="Post media"
              className="h-14 w-14 shrink-0 rounded-md object-cover ring-1 ring-border"
            />
            <p className="pt-0.5 text-[13px] leading-relaxed text-foreground">{activePost.message}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border/50 px-5 py-2.5 text-[11.5px]">
            <Stat icon={<MessageCircle className="h-3.5 w-3.5" />} count={activePost.totalComments}>
              comments
            </Stat>
            <Stat icon={<ThumbsUp className="h-3.5 w-3.5" />} count={activePost.reactionCount}>
              reactions
            </Stat>
            <Stat icon={<Reply className="h-3.5 w-3.5" />} count={activePost.totalRepliesPublic}>
              public
            </Stat>
            <Stat icon={<Lock className="h-3.5 w-3.5" />} count={activePost.totalRepliesPrivate}>
              private
            </Stat>
            <Stat
              icon={<EyeOff className="h-3.5 w-3.5" />}
              count={activePost.totalHidden}
              tone={activePost.totalHidden > 0 ? "warn" : "default"}
            >
              hidden
            </Stat>
            <Stat
              icon={<Trash2 className="h-3.5 w-3.5" />}
              count={activePost.totalDeleted}
              tone={activePost.totalDeleted > 0 ? "danger" : "default"}
            >
              deleted
            </Stat>
          </div>
        </div>
      </div>

      {/* Commenters + filter row */}
      <div className="flex items-center justify-between gap-2 border-t border-border/50 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-foreground">
            {visibleCount} {visibleCount === 1 ? "commenter" : "commenters"}
          </span>
          <span className="text-[12px] text-muted-foreground">on this post</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
              filterOpen || filter !== "all"
                ? "text-[#2563eb] hover:bg-[#2563eb]/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Filter className="h-3 w-3" />
            {filter === "all" ? "All" : filter === "unanswered" ? "Unanswered" : "Answered"}
            <ChevronDown className="h-3 w-3" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-8 z-50 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <div className="px-2 py-2">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  State
                </p>
                {(["all", "unanswered", "answered"] as Filter[]).map((v) => {
                  const checked = filter === v
                  const icon =
                    v === "all" ? <Layers className="h-3.5 w-3.5" /> :
                    v === "unanswered" ? <Clock className="h-3.5 w-3.5" /> :
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  const label =
                    v === "all" ? "All" :
                    v === "unanswered" ? "Unanswered" :
                    "Answered"
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setFilter(v); setFilterOpen(false) }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
                        checked ? "bg-[#2563eb]/[0.07]" : "hover:bg-muted",
                      )}
                    >
                      <span className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        checked ? "border-[#2563eb] bg-[#2563eb]" : "border-muted-foreground/30 bg-background",
                      )}>
                        {checked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className={cn("shrink-0", checked ? "text-[#2563eb]" : "text-muted-foreground")}>
                        {icon}
                      </span>
                      <span className={cn("flex-1 text-[12px]", checked ? "font-semibold text-[#2563eb]" : "text-foreground")}>
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Stat({
  icon,
  count,
  children,
  tone = "default",
}: {
  icon: React.ReactNode
  count: number
  children: React.ReactNode
  tone?: "default" | "warn" | "danger"
}) {
  const toneClass =
    tone === "warn"
      ? "text-amber-700"
      : tone === "danger"
        ? "text-destructive"
        : "text-muted-foreground"
  return (
    <span className={cn("inline-flex items-center gap-1.5", toneClass)}>
      {icon}
      <span className="font-semibold tabular-nums text-foreground">{count}</span>
      <span>{children}</span>
    </span>
  )
}

