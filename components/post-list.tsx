"use client"

import { Facebook, Filter, Search, ChevronDown, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { posts, type PostListItem } from "@/lib/mock-data"
import { PostListEmpty } from "@/components/empty-states"

export type Tab = "all" | "mine" | "mentions"

const MINE_POST_IDS = new Set(["post-essential-tee", "post-winter-arrivals"])

function filterPostsByTab(tab: Tab): PostListItem[] {
  switch (tab) {
    case "mine":
      return posts.filter((p) => MINE_POST_IDS.has(p.id))
    case "mentions":
      return []
    case "all":
    default:
      return posts
  }
}

function PostThumb({ query, className }: { query: string; className?: string }) {
  return (
    <img
      src={`/placeholder.svg?height=96&width=96&query=${encodeURIComponent(query)}`}
      alt=""
      aria-hidden="true"
      className={cn("h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.05]", className)}
    />
  )
}

function CommenterStack({ commenters }: { commenters: PostListItem["topCommenters"] }) {
  if (commenters.length === 0) return null
  return (
    <div className="flex -space-x-1.5">
      {commenters.slice(0, 3).map((c, i) => (
        <span
          key={i}
          className={cn(
            "grid h-4 w-4 place-items-center rounded-full text-[8px] font-semibold ring-2 ring-card",
            c.color,
          )}
        >
          {c.initials}
        </span>
      ))}
    </div>
  )
}

export function PostList({
  activeTab = "all",
  onTabChange,
  selectedPostId = null,
  onSelectPost,
  className,
  style,
}: {
  activeTab?: Tab
  onTabChange?: (tab: Tab) => void
  selectedPostId?: string | null
  onSelectPost?: (id: string) => void
  className?: string
  style?: React.CSSProperties
}) {
  const visiblePosts = filterPostsByTab(activeTab)
  const mineCount = filterPostsByTab("mine").length

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
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Filter"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs — scope of the list */}
      <div className="flex items-center gap-0.5 px-2 pb-1">
        <TabButton active={activeTab === "all"} onClick={() => onTabChange?.("all")}>
          All
          <Counter active={activeTab === "all"}>{posts.length}</Counter>
        </TabButton>
        <TabButton active={activeTab === "mine"} onClick={() => onTabChange?.("mine")}>
          Mine
          <Counter active={activeTab === "mine"}>{mineCount}</Counter>
        </TabButton>
        <TabButton active={activeTab === "mentions"} onClick={() => onTabChange?.("mentions")}>
          Mentions
        </TabButton>
      </div>

      {visiblePosts.length === 0 ? (
        <PostListEmpty tab={activeTab} />
      ) : (
      <ul className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {visiblePosts.map((post) => (
          <li key={post.id}>
            <button
              type="button"
              onClick={() => onSelectPost?.(post.id)}
              className={cn(
                "group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-all duration-200",
                selectedPostId === post.id
                  ? "bg-primary/[0.06] ring-1 ring-primary/15"
                  : "hover:bg-muted/40",
              )}
            >
              {/* Post thumbnail */}
              <div className="relative shrink-0">
                <PostThumb query={post.thumbnailQuery} />
                <span className="absolute -bottom-0.5 -right-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-[#1877F2] ring-2 ring-card">
                  <Facebook className="h-2 w-2 fill-white text-white" />
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[12px] font-semibold text-foreground">
                    {post.pageName}
                  </p>
                  <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                    {post.lastCommentAt}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[12px] leading-snug text-muted-foreground">
                  {post.snippet}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  {post.totalUnanswered > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {post.totalUnanswered} unanswered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      All answered
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {post.totalComments}
                  </span>
                  <div className="ml-auto">
                    <CommenterStack commenters={post.topCommenters} />
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
      )}
    </aside>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-medium transition-colors duration-200",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function Counter({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        "text-[11px] font-semibold tabular-nums",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {children}
    </span>
  )
}
