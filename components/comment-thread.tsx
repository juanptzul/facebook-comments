"use client"

import { useMemo } from "react"
import { Inbox } from "lucide-react"
import { CommentBubble } from "./comment-bubble"
import { subThreads, type SubThread } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import type { Filter } from "./post-header"

type Props = {
  filter: Filter
  selectedCommentId: string | null
  onSelectComment: (commentId: string | null) => void
}

export function CommentThread({ filter, selectedCommentId, onSelectComment }: Props) {
  const visibleThreads = useMemo(() => {
    if (filter === "unanswered") return subThreads.filter((t) => t.state === "open")
    if (filter === "answered") return subThreads.filter((t) => t.state === "closed")
    return subThreads
  }, [filter])

  return (
    <div className="flex-1 overflow-y-auto">
      {visibleThreads.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-5">
          {visibleThreads.map((thread) => (
            <SubThreadGroup
              key={thread.id}
              thread={thread}
              selectedCommentId={selectedCommentId}
              onSelectComment={onSelectComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SubThreadGroup({
  thread,
  selectedCommentId,
  onSelectComment,
}: {
  thread: SubThread
  selectedCommentId: string | null
  onSelectComment: (commentId: string | null) => void
}) {
  const [original, ...rest] = thread.comments
  if (!original) return null

  const toggle = (id: string) =>
    onSelectComment(selectedCommentId === id ? null : id)

  return (
    <section className="flex flex-col gap-2.5">
      {/* Group anchor — subtle sub-heading above the thread */}
      <div className="flex items-center gap-1.5 pl-[42px] text-[10.5px] font-medium text-muted-foreground">
        <span className="font-medium text-foreground/80">{thread.commenterName}</span>
        <span className="text-muted-foreground/50">·</span>
        <span
          className={cn(
            "inline-flex items-center gap-1",
            thread.state === "open" ? "text-amber-700" : "text-emerald-700",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              thread.state === "open" ? "bg-amber-500" : "bg-emerald-500",
            )}
          />
          {thread.state === "open" ? "Unanswered" : "Answered"}
        </span>
        {thread.assignedTo && (
          <>
            <span className="text-muted-foreground/50">·</span>
            <span>assigned to {thread.assignedTo}</span>
          </>
        )}
        <span className="text-muted-foreground/50">·</span>
        <span>{thread.lastActivity}</span>
      </div>

      <div className="relative flex flex-col gap-2.5">
        {rest.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-11 bottom-4 w-px bg-slate-400/65"
          />
        )}

        <CommentBubble
          comment={original}
          selected={selectedCommentId === original.id}
          onSelect={() => toggle(original.id)}
        />

        {rest.map((c) => (
          <div key={c.id} className="pl-10">
            <CommentBubble
              comment={c}
              selected={selectedCommentId === c.id}
              onSelect={() => toggle(c.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
        <Inbox className="h-5 w-5" />
      </div>
      <p className="text-[13px] font-medium text-foreground">Nothing matches this filter</p>
      <p className="max-w-xs text-[12px]">
        No commenters in{" "}
        <span className="font-medium">
          {filter === "unanswered" ? "Unanswered" : filter === "answered" ? "Answered" : "All"}
        </span>{" "}
        state on this post.
      </p>
    </div>
  )
}
