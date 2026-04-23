"use client"

import { useState, useRef, useEffect } from "react"
import {
  Filter,
  Search,
  ChevronDown,
  MessageCircle,
  EyeOff,
  Zap,
  User,
  UserPlus,
  Trash2,
  Layers,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Link2,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { posts, type PostListItem, type PostListPage } from "@/lib/mock-data"
import { PostListEmpty } from "@/components/empty-states"

function PostThumb({ query, className }: { query: string; className?: string }) {
  return (
    <img
      src={`/placeholder.svg?height=96&width=96&query=${encodeURIComponent(query)}`}
      alt=""
      aria-hidden="true"
      className={cn("h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.05]", className)}
    />
  )
}

function PageAvatarBadge({ page }: { page: PostListPage }) {
  return (
    <span
      title={page.name}
      className={cn(
        "absolute -bottom-1 -right-1 grid h-[18px] w-[18px] place-items-center rounded-full text-[9px] font-bold uppercase tracking-tight ring-2 ring-card",
        page.avatarColor,
      )}
    >
      {page.pictureUrl ? (
        <img src={page.pictureUrl} alt="" className="h-full w-full rounded-full object-cover" />
      ) : (
        page.initial
      )}
    </span>
  )
}

function statusTypeLabel(type: PostListItem["statusType"]): string {
  switch (type) {
    case "PHOTO": return "Added a photo"
    case "VIDEO": return "Added a video"
    case "STATUS": return "Posted a status update"
    case "LINK": return "Shared a link"
  }
}

type Filters = {
  estado: "todos" | "con-pendientes" | "sin-pendientes"
  tipo: "todos" | "PHOTO" | "VIDEO" | "STATUS" | "LINK"
  boost: "todos" | "boosted" | "organico"
}

const DEFAULT_FILTERS: Filters = { estado: "todos", tipo: "todos", boost: "todos" }


function FilterOption({
  label,
  icon,
  checked,
  onSelect,
}: {
  label: string
  icon: React.ReactNode
  checked: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
        checked ? "bg-[#2563eb]/[0.07]" : "hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked ? "border-[#2563eb] bg-[#2563eb]" : "border-muted-foreground/30 bg-background",
        )}
      >
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
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2 pb-2">
      <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        {title}
      </p>
      {children}
    </div>
  )
}

const ICON_SIZE = "h-3.5 w-3.5"


export function PostList({
  selectedPostId = null,
  onSelectPost,
  className,
  style,
}: {
  selectedPostId?: string | null
  onSelectPost?: (id: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState("")
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!filterOpen) return
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [filterOpen])

  const hasActiveFilters =
    filters.estado !== "todos" || filters.tipo !== "todos" || filters.boost !== "todos"

  const visiblePosts = posts.filter((post) => {
    if (filters.estado === "con-pendientes" && post.totalUnanswered === 0) return false
    if (filters.estado === "sin-pendientes" && post.totalUnanswered > 0) return false
    if (filters.tipo !== "todos" && post.statusType !== filters.tipo) return false
    if (filters.boost === "boosted" && post.promotionStatus !== "active") return false
    if (filters.boost === "organico" && post.promotionStatus === "active") return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesName = post.pageName.toLowerCase().includes(q)
      const matchesSnippet = post.snippet?.toLowerCase().includes(q) ?? false
      if (!matchesName && !matchesSnippet) return false
    }
    return true
  })

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <aside
      className={cn("flex h-full w-[320px] shrink-0 flex-col overflow-hidden", className)}
      style={style}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-[13px] font-semibold tracking-tight text-foreground">Posts</h2>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            All pages
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          {/* Filter button with popover */}
          <div ref={filterRef} className="relative">
            <button
              type="button"
              onClick={() => setFilterOpen((v) => !v)}
              aria-label="Filter"
              className={cn(
                "relative grid h-7 w-7 place-items-center rounded-md transition-colors",
                filterOpen
                  ? "bg-[#2563eb]/10 text-[#2563eb]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Filter className="h-3.5 w-3.5" />
              {hasActiveFilters && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
              )}
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-8 z-50 w-56 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                {/* Popover header */}
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-[13px] font-semibold text-foreground">Filtrar</span>
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    title="Limpiar filtros"
                    disabled={!hasActiveFilters}
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-md transition-colors",
                      hasActiveFilters
                        ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                        : "cursor-default text-muted-foreground/30",
                    )}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="border-t border-border pt-2">
                  <FilterSection title="Estado">
                    <FilterOption label="Todos" icon={<Layers className={ICON_SIZE} />}checked={filters.estado === "todos"} onSelect={() => setFilter("estado", "todos")} />
                    <FilterOption label="Con pendientes" icon={<Clock className={ICON_SIZE} />} checked={filters.estado === "con-pendientes"} onSelect={() => setFilter("estado", "con-pendientes")} />
                    <FilterOption label="Sin pendientes" icon={<CheckCircle2 className={ICON_SIZE} />} checked={filters.estado === "sin-pendientes"} onSelect={() => setFilter("estado", "sin-pendientes")} />
                  </FilterSection>

                  <div className="border-t border-border pt-2">
                    <FilterSection title="Tipo de post">
                      <FilterOption label="Todos" icon={<Layers className={ICON_SIZE} />} checked={filters.tipo === "todos"} onSelect={() => setFilter("tipo", "todos")} />
                      <FilterOption label="Foto" icon={<ImageIcon className={ICON_SIZE} />} checked={filters.tipo === "PHOTO"} onSelect={() => setFilter("tipo", "PHOTO")} />
                      <FilterOption label="Video" icon={<VideoIcon className={ICON_SIZE} />} checked={filters.tipo === "VIDEO"} onSelect={() => setFilter("tipo", "VIDEO")} />
                      <FilterOption label="Status" icon={<FileText className={ICON_SIZE} />} checked={filters.tipo === "STATUS"} onSelect={() => setFilter("tipo", "STATUS")} />
                      <FilterOption label="Link" icon={<Link2 className={ICON_SIZE} />} checked={filters.tipo === "LINK"} onSelect={() => setFilter("tipo", "LINK")} />
                    </FilterSection>
                  </div>

                  <div className="border-t border-border pt-2">
                    <FilterSection title="Boost">
                      <FilterOption label="Todos" icon={<Layers className={ICON_SIZE} />} checked={filters.boost === "todos"} onSelect={() => setFilter("boost", "todos")} />
                      <FilterOption label="Solo boosted" icon={<Zap className={ICON_SIZE} />} checked={filters.boost === "boosted"} onSelect={() => setFilter("boost", "boosted")} />
                      <FilterOption label="Orgánico" icon={<Leaf className={ICON_SIZE} />} checked={filters.boost === "organico"} onSelect={() => setFilter("boost", "organico")} />
                    </FilterSection>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="px-3 pb-2 pt-0">
        <div className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-1">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar posts..."
            className="flex-1 bg-transparent text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {visiblePosts.length === 0 ? (
        <PostListEmpty />
      ) : (
        <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2 pt-1">
          {visiblePosts.map((post) => {
            const isSelected = selectedPostId === post.id
            const secondaryLine = post.snippet?.trim()
              ? post.snippet
              : statusTypeLabel(post.statusType)
            const isBoosted = post.promotionStatus === "active"
            return (
              <li key={post.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectPost?.(post.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelectPost?.(post.id)
                    }
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-3 text-left outline-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-[#2563eb]/40",
                    isSelected
                      ? "bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]/20"
                      : "hover:bg-muted/40",
                  )}
                >
                  <div className="relative shrink-0">
                    <PostThumb query={post.thumbnailQuery} />
                    <PageAvatarBadge page={post.page} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-[12px] font-semibold text-foreground">
                        {post.pageName}
                      </p>
                      <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                        {post.lastCommentAt}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "mt-0.5 truncate text-[12px] leading-snug",
                        post.snippet?.trim()
                          ? "text-muted-foreground"
                          : "italic text-muted-foreground/80",
                      )}
                    >
                      {secondaryLine}
                    </p>

                    <div className="mt-2 flex items-center gap-2.5">
                      <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                        <MessageCircle className="h-3 w-3" />
                        {post.totalComments}
                      </span>
                      {post.totalHidden > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                          <EyeOff className="h-3 w-3" />
                          {post.totalHidden}
                        </span>
                      )}

                      <div className="ml-auto flex min-w-0 items-center gap-1.5">
                        {isBoosted && (
                          <span className="inline-flex min-w-0 items-center gap-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                            <Zap className="h-2.5 w-2.5 shrink-0 fill-violet-700" />
                            <span className="max-w-[72px] truncate">Boosted</span>
                          </span>
                        )}

                        {/* Assignee — reserved for detail panel
                        {post.assignee ? (
                          <button type="button" onClick={(e) => e.stopPropagation()} aria-label={`Assigned to ${post.assignee.name}`} title={`Assigned to ${post.assignee.name}`} className="inline-flex min-w-0 items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground/80 transition-colors hover:bg-muted-foreground/20">
                            <User className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
                            <span className="max-w-[72px] truncate">{post.assignee.isCurrentUser ? "You" : post.assignee.name.split(" ")[0]}</span>
                          </button>
                        ) : (
                          <button type="button" onClick={(e) => e.stopPropagation()} aria-label="Assign" title="Assign" className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <UserPlus className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
                            <span>Assign</span>
                          </button>
                        )}
                        */}

                        {post.totalUnanswered > 0 && (
                          <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[10px] font-semibold leading-none text-white">
                            {post.totalUnanswered > 99 ? "99+" : post.totalUnanswered}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </aside>
  )
}
