"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowUpRight,
  ChevronDown,
  EyeOff,
  Facebook,
  Globe,
  Lock,
  MessageCircle,
  MoreHorizontal,
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
            aria-label="More actions"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
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
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium text-foreground hover:bg-muted"
            aria-haspopup="menu"
            aria-expanded={filterOpen}
          >
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <FilterLabel value={filter} />
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          {filterOpen && (
            <div
              className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-md border border-border bg-popover shadow-lg"
              role="menu"
            >
              <FilterOption
                value="unanswered"
                current={filter}
                onSelect={(v) => {
                  setFilter(v)
                  setFilterOpen(false)
                }}
              >
                Unanswered
                <CountChip color="amber">
                  {subThreads.filter((t) => t.state === "open").length}
                </CountChip>
              </FilterOption>
              <FilterOption
                value="answered"
                current={filter}
                onSelect={(v) => {
                  setFilter(v)
                  setFilterOpen(false)
                }}
              >
                Answered
                <CountChip color="emerald">
                  {subThreads.filter((t) => t.state === "closed").length}
                </CountChip>
              </FilterOption>
              <FilterOption
                value="all"
                current={filter}
                onSelect={(v) => {
                  setFilter(v)
                  setFilterOpen(false)
                }}
              >
                All
                <CountChip color="muted">{subThreads.length}</CountChip>
              </FilterOption>
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

function FilterLabel({ value }: { value: Filter }) {
  if (value === "unanswered") return <>Unanswered</>
  if (value === "answered") return <>Answered</>
  return <>All</>
}

function FilterOption({
  value,
  current,
  onSelect,
  children,
}: {
  value: Filter
  current: Filter
  onSelect: (v: Filter) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors",
        current === value ? "bg-muted text-foreground" : "text-foreground hover:bg-muted",
      )}
      role="menuitem"
    >
      {children}
    </button>
  )
}

function CountChip({
  children,
  color,
}: {
  children: React.ReactNode
  color: "amber" | "emerald" | "muted"
}) {
  return (
    <span
      className={cn(
        "ml-auto rounded px-1.5 py-0.5 text-[10px] font-semibold",
        color === "amber" && "bg-amber-500/10 text-amber-700",
        color === "emerald" && "bg-emerald-500/10 text-emerald-700",
        color === "muted" && "bg-muted text-muted-foreground",
      )}
    >
      {children}
    </span>
  )
}
