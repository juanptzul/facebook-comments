"use client"

import type React from "react"

import { useState } from "react"
import {
  CornerUpLeft,
  Eye,
  EyeOff,
  ExternalLink,
  Link2,
  Lock,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/mock-data"

type Props = {
  comment: Comment
  isReply?: boolean
  deleteConfirm?: boolean
  selected?: boolean
  onSelect?: () => void
}

function HighlightMentions({ text, mentions = [] }: { text: string; mentions?: string[] }) {
  if (mentions.length === 0) return <>{text}</>
  const pattern = new RegExp(`(@(?:${mentions.map((m) => m.replace(/\s+/g, "\\s+")).join("|")}))`, "g")
  const parts = text.split(pattern)
  const mentionSet = new Set(mentions.map((m) => `@${m}`))
  return (
    <>
      {parts.map((part, i) =>
        mentionSet.has(part) ? (
          <span key={i} className="font-medium text-primary">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation()
}

function ActionButton({
  children,
  label,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode
  label: string
  variant?: "default" | "muted"
  onClick?: (e: React.MouseEvent) => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md transition-colors",
        "hover:bg-muted",
        variant === "muted" ? "text-muted-foreground/70" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

export function CommentBubble({
  comment,
  isReply = false,
  deleteConfirm = false,
  selected = false,
  onSelect,
}: Props) {
  const isOut = comment.direction === "out"
  const [liked, setLiked] = useState(false)
  const [hidden, setHidden] = useState(!!comment.hidden)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(deleteConfirm)

  const handleBubbleClick = () => onSelect?.()

  return (
    <div
      className={cn("group/bubble relative cursor-pointer", selected && "z-0")}
      onClick={handleBubbleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect?.()
        }
      }}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold",
            comment.authorColor,
          )}
        >
          {comment.authorInitials}
        </div>

        {/* Bubble card */}
        <div className="flex min-w-0 max-w-[min(640px,85%)] flex-1 flex-col">
          <div
            className={cn(
              "relative rounded-lg border px-3 py-2 transition-all",
              selected
                ? "border-transparent bg-primary/10 ring-2 ring-primary/40 shadow-sm"
                : isOut
                  ? "border-transparent bg-blue-100 group-hover/bubble:brightness-[0.98]"
                  : "border-transparent bg-card group-hover/bubble:brightness-[0.99]",
              hidden && "opacity-60",
            )}
          >
            {/* Selected indicator */}
            {selected && (
              <div className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-foreground">
                <CornerUpLeft className="h-2.5 w-2.5" />
                Replying
              </div>
            )}

            {/* Hidden overlay badge */}
            {hidden && (
              <div className="mb-1.5 flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                <EyeOff className="h-3 w-3" />
                Hidden from public
              </div>
            )}

            {/* Header */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-[12.5px] font-semibold text-foreground">
                {comment.authorName}
              </span>
              {isOut && (
                <span className="rounded bg-primary/10 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-primary">
                  Page
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">· {comment.timestamp}</span>
            </div>

            {/* Message */}
            <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">
              <HighlightMentions text={comment.text} mentions={comment.mentions} />
            </p>

            {/* Reactions + Reply */}
            {(comment.reactions && comment.reactions.length > 0 || (!isReply && !isOut)) && (
              <div
                className="-mb-1 mt-2 flex flex-wrap items-center gap-2"
                onClick={stopPropagation}
              >
                {comment.reactions && comment.reactions.length > 0 && (
                  <>
                    <div className="flex items-center gap-0.5 rounded-full border border-border bg-background px-1.5 py-0.5">
                      {comment.reactions.map((r) => (
                        <span key={r.label} className="inline-flex items-center gap-0.5 text-[11px]">
                          <span className="leading-none">{r.emoji}</span>
                          <span className="font-medium text-muted-foreground">{r.count}</span>
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {comment.totalReactions} reactions
                    </span>
                  </>
                )}
                {!isReply && !isOut && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onSelect?.() }}
                    className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Reply
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer row: meta + actions */}
          <div className="mt-1 flex h-7 items-center gap-2 px-1 text-[11px] text-muted-foreground">
            {liked && !isOut && (
              <span className="inline-flex items-center gap-1 text-primary">
                <ThumbsUp className="h-3 w-3 fill-primary" />
              </span>
            )}

            {/* Action toolbar OR delete confirm */}
            {showDeleteConfirm ? (
              <div
                className="flex items-center gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-1.5 py-1"
                onClick={stopPropagation}
              >
                <span className="text-[11px] font-medium text-destructive">Delete this comment?</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteConfirm(false)
                  }}
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={stopPropagation}
                  className="rounded bg-destructive px-1.5 py-0.5 text-[11px] font-semibold text-destructive-foreground hover:brightness-110"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div
                onClick={stopPropagation}
                className={cn(
                  "ml-auto flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5 opacity-0 shadow-sm transition-opacity",
                  "group-hover/bubble:opacity-100 focus-within:opacity-100",
                  selected && "opacity-100",
                )}
              >
                <ActionButton
                  label={hidden ? "Unhide" : "Hide from public"}
                  onClick={(e) => {
                    e.stopPropagation()
                    setHidden((h) => !h)
                  }}
                >
                  {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </ActionButton>
                <ActionButton
                  label="Delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDeleteConfirm(true)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </ActionButton>
                {!isOut && (
                  <ActionButton
                    label={liked ? "Unlike" : "Like"}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLiked((l) => !l)
                    }}
                  >
                    <ThumbsUp className={cn("h-3.5 w-3.5", liked && "fill-primary text-primary")} />
                  </ActionButton>
                )}
                {/* Reply: select this comment as the reply target */}
                <ActionButton
                  label="Reply"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect?.()
                  }}
                >
                  <CornerUpLeft className="h-3.5 w-3.5" />
                </ActionButton>
                <ActionButton label="Copy permalink" onClick={stopPropagation}>
                  <Link2 className="h-3.5 w-3.5" />
                </ActionButton>
                <ActionButton label="View on Facebook" onClick={stopPropagation}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </ActionButton>
                {comment.canReplyPrivately && (
                  <ActionButton label="Private reply" onClick={stopPropagation}>
                    <Lock className="h-3.5 w-3.5" />
                  </ActionButton>
                )}
                {isOut && (
                  <ActionButton label="Edit" variant="muted" onClick={stopPropagation}>
                    <Pencil className="h-3.5 w-3.5" />
                  </ActionButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
