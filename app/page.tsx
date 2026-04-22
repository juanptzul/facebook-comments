"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { FileText, Inbox } from "lucide-react"
import { PostList } from "@/components/post-list"
import { PostHeader, type Filter } from "@/components/post-header"
import { CommentThread } from "@/components/comment-thread"
import { InputBar, type ReplyContext } from "@/components/input-bar"
import { DetailsPanel } from "@/components/details-panel"
import { CenterEmpty } from "@/components/empty-states"
import { subThreads } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function NavRail() {
  const items = [
    { icon: Inbox, label: "Inbox", active: false, badge: 12 },
    { icon: FileText, label: "Posts", active: true, badge: 3 },
  ]
  return (
    <nav
      className="animate-panel-in flex h-full w-14 shrink-0 flex-col overflow-hidden rounded-[10px] bg-card py-3 ring-1 ring-black/[0.05]"
      style={{ animationDelay: "0ms" }}
    >
      <ul className="flex w-full flex-col items-stretch gap-1 px-2">
        {items.map(({ icon: Icon, label, active, badge }, idx) => (
          <Fragment key={label}>
            {idx === 1 && (
              <li
                aria-hidden="true"
                className="mx-auto my-1 h-px w-6 bg-black/[0.08]"
              />
            )}
            <li className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-2 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-150",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <button
                type="button"
                aria-label={label}
                title={label}
                className={cn(
                  "grid h-9 w-full place-items-center rounded-md transition-colors duration-150",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="relative">
                  <Icon className="h-4 w-4" />
                  {badge && (
                    <span
                      className={cn(
                        "absolute -right-2.5 -top-2.5 grid h-[15px] min-w-[15px] place-items-center rounded-full px-1 text-[10px] font-semibold tabular-nums text-card ring-2 ring-card",
                        active ? "bg-primary" : "bg-[oklch(0.70_0.012_260)]",
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </span>
              </button>
            </li>
          </Fragment>
        ))}
      </ul>
      <div className="mt-auto grid h-8 w-8 shrink-0 place-items-center self-center rounded-full bg-[oklch(0.88_0.08_258)] text-[11px] font-semibold text-[oklch(0.35_0.15_258)]">
        PR
      </div>
    </nav>
  )
}

export default function Page() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("all")

  // Esc deselects
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCommentId(null)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const { replyContext, activeThread } = useMemo(() => {
    if (!selectedCommentId) return { replyContext: null, activeThread: null }
    for (const thread of subThreads) {
      const c = thread.comments.find((x) => x.id === selectedCommentId)
      if (c) {
        return {
          activeThread: thread,
          replyContext: {
            commentId: c.id,
            name: c.authorName,
            snippet: c.text,
            direction: c.direction,
            canReplyPrivately: !!c.canReplyPrivately,
          } as ReplyContext,
        }
      }
    }
    return { replyContext: null, activeThread: null }
  }, [selectedCommentId])

  return (
    <main className="bg-shell flex h-svh w-full gap-3 overflow-hidden p-3 text-foreground">
      <NavRail />
      <div className="flex min-w-0 flex-1 overflow-hidden rounded-[10px] bg-card ring-1 ring-black/[0.05]">
        <PostList
          selectedPostId={selectedPostId}
          onSelectPost={setSelectedPostId}
          className="animate-panel-in"
          style={{ animationDelay: "80ms" }}
        />
        <section
          className="animate-panel-in flex min-w-0 flex-1 flex-col overflow-hidden border-l border-black/[0.05]"
          style={{ animationDelay: "160ms" }}
        >
          {selectedPostId ? (
            <div className="min-h-0 flex-1 overflow-hidden p-3">
              <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[10px] bg-[#F0F2F7] p-3 ring-1 ring-black/[0.05]">
                <PostHeader filter={filter} setFilter={setFilter} />
                <CommentThread
                  filter={filter}
                  selectedCommentId={selectedCommentId}
                  onSelectComment={setSelectedCommentId}
                />
                <InputBar replyContext={replyContext} onClear={() => setSelectedCommentId(null)} />
              </div>
            </div>
          ) : (
            <CenterEmpty />
          )}
        </section>
        {selectedPostId && (
          <DetailsPanel
            activeThread={activeThread}
            className="animate-panel-in"
            style={{ animationDelay: "240ms" }}
          />
        )}
      </div>
    </main>
  )
}
