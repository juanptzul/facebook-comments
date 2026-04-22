"use client"

import {
  Filter,
  Search,
  ChevronDown,
  MessageCircle,
  EyeOff,
  Zap,
  User,
  UserPlus,
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
      className={cn("h-11 w-11 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.05]", className)}
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
    case "PHOTO":
      return "Added a photo"
    case "VIDEO":
      return "Added a video"
    case "STATUS":
      return "Posted a status update"
    case "LINK":
      return "Shared a link"
  }
}

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
  const visiblePosts = posts

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
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-[#2563eb]/40",
                    isSelected
                      ? "bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]/20"
                      : "hover:bg-muted/40",
                  )}
                >
                  {/* Left column: thumbnail */}
                  <div className="relative shrink-0">
                    <PostThumb query={post.thumbnailQuery} />
                    <PageAvatarBadge page={post.page} />
                  </div>

                  {/* Right column: text + stats */}
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

                    <div className="mt-1 flex items-center gap-2">
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

                        {post.assignee ? (
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Assigned to ${post.assignee.name}`}
                            title={`Assigned to ${post.assignee.name}`}
                            className="inline-flex min-w-0 items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground/80 transition-colors hover:bg-muted-foreground/20"
                          >
                            <User className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
                            <span className="max-w-[72px] truncate">
                              {post.assignee.isCurrentUser
                                ? "You"
                                : post.assignee.name.split(" ")[0]}
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Assign"
                            title="Assign"
                            className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <UserPlus className="h-2.5 w-2.5 shrink-0" strokeWidth={2.25} />
                            <span>Assign</span>
                          </button>
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
