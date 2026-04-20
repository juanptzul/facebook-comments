"use client"

import type React from "react"
import { useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  PanelRightClose,
  PanelRightOpen,
  EyeOff,
  Facebook,
  Globe,
  Image as ImageIcon,
  Lock,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Reply,
  Tag,
  Trash2,
} from "lucide-react"
import { activePost, type SubThread } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Props = {
  activeThread: SubThread | null
  className?: string
  style?: React.CSSProperties
}

export function DetailsPanel({ activeThread, className, style }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <aside
      className={cn(
        "hidden h-full shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out lg:flex",
        open ? "w-[340px] border-l border-black/[0.05]" : "w-10",
        className,
      )}
      style={style}
    >
      {/* Toggle header */}
      <div className={cn("flex h-12 shrink-0 items-center px-2", open ? "justify-start" : "justify-center")}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Collapse details" : "Expand details"}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {open ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </button>
      </div>
      {/* Scrollable content */}
      <div
        className={cn(
          "flex-1 overflow-y-auto transition-opacity duration-150",
          open ? "opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        {activeThread ? <ContactView thread={activeThread} /> : <PostView />}
      </div>
    </aside>
  )
}

function PostView() {
  return (
    <div className="flex flex-col px-3 pb-3">
      <AccordionSection title="Post details" locked>
        <div className="rounded-xl bg-[#F2F6F8] p-3">
          <div className="flex items-start gap-3">
            <img
              src={`/placeholder.svg?height=96&width=96&query=${encodeURIComponent(activePost.thumbnailQuery)}`}
              alt=""
              className="h-12 w-12 shrink-0 rounded-lg object-cover ring-1 ring-border"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {activePost.pageName}
              </p>
              <p className="text-[11px] text-muted-foreground">{activePost.postedAt}</p>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground ring-1 ring-border/60">
                <ImageIcon className="h-3 w-3" />
                {activePost.statusType}
              </span>
            </div>
          </div>
          <div className="mt-3 border-t border-border/60 pt-3">
            <dl className="space-y-1.5 text-[12px]">
              <InfoRow label="Posted">{activePost.postedAt}</InfoRow>
              <InfoRow label="Permalink">
                <a
                  href={activePost.permalinkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  View on Facebook
                  <ExternalLink className="h-3 w-3" />
                </a>
              </InfoRow>
            </dl>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Message" defaultOpen>
        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground/80">
          {activePost.message}
        </p>
      </AccordionSection>

      <AccordionSection title="Engagement" defaultOpen>
        <dl className="space-y-2 text-[12px]">
          <Row icon={<MessageSquare className="h-3.5 w-3.5" />} label="Comments">
            {activePost.totalComments}
          </Row>
          <Row icon={<Reply className="h-3.5 w-3.5" />} label="Public replies">
            {activePost.totalRepliesPublic}
          </Row>
          <Row icon={<Lock className="h-3.5 w-3.5" />} label="Private replies">
            {activePost.totalRepliesPrivate}
          </Row>
        </dl>
      </AccordionSection>

      <AccordionSection title="Moderation">
        <dl className="space-y-2 text-[12px]">
          <Row
            icon={<EyeOff className="h-3.5 w-3.5 text-amber-700" />}
            label="Hidden"
            tone={activePost.totalHidden > 0 ? "warn" : "default"}
          >
            {activePost.totalHidden}
          </Row>
          <Row
            icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
            label="Deleted"
            tone={activePost.totalDeleted > 0 ? "danger" : "default"}
          >
            {activePost.totalDeleted}
          </Row>
        </dl>
      </AccordionSection>
    </div>
  )
}

function ContactView({ thread }: { thread: SubThread }) {
  return (
    <div className="flex flex-col px-3 pb-3">
      <AccordionSection title="General Info" locked>
        <div className="rounded-xl bg-[#F2F6F8] p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-full text-[14px] font-semibold",
                  thread.commenterColor,
                )}
              >
                {thread.commenterInitials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#1877F2] ring-2 ring-[#F2F6F8]">
                <Facebook className="h-2.5 w-2.5 fill-white text-white" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "mb-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  thread.state === "open"
                    ? "bg-amber-500/15 text-amber-700"
                    : "bg-emerald-500/15 text-emerald-700",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    thread.state === "open" ? "bg-amber-500" : "bg-emerald-500",
                  )}
                />
                {thread.state === "open" ? "Unanswered" : "Responded"}
              </div>
              <p className="truncate text-[13px] font-semibold text-foreground">
                {thread.commenterName}
              </p>
              {thread.commenterHandle && (
                <p className="truncate text-[11px] text-muted-foreground">
                  {thread.commenterHandle}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Call"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
            >
              <Phone className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 border-t border-border/60 pt-3">
            <dl className="space-y-1.5 text-[12px]">
              <InfoRow label="Locale">en_US</InfoRow>
              <InfoRow label="Location">Toronto, Canada</InfoRow>
              <InfoRow label="First seen">Feb 14, 2026</InfoRow>
            </dl>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Campaign info" />

      <AccordionSection title="Conversation history">
        <dl className="space-y-2 text-[12px]">
          <Row icon={<MessageSquare className="h-3.5 w-3.5" />} label="Prior comments">
            3 on this page
          </Row>
          <Row icon={<Globe className="h-3.5 w-3.5" />} label="Source">
            Facebook
          </Row>
          <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Last seen">
            {thread.lastActivity}
          </Row>
        </dl>
      </AccordionSection>

      <AccordionSection title="Notes" count={1} rightAction="Add" defaultOpen>
        <div className="rounded-lg bg-[#F2F6F8] p-2.5 ring-1 ring-black/[0.05]">
          <p className="text-[12px] leading-relaxed text-foreground/90">
            Reached out about sizing for the cotton runner. High-intent, follow up tomorrow.
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">Apr 15, 2026 11:20 AM</p>
        </div>
      </AccordionSection>

      <AccordionSection title="Tags" count={3} rightAction="Add" defaultOpen>
        <div className="flex flex-wrap gap-1.5">
          <Tagline>product-question</Tagline>
          <Tagline>sizing</Tagline>
          <Tagline>high-intent</Tagline>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:border-border/80 hover:text-foreground"
          >
            <Plus className="h-2.5 w-2.5" />
            Add
          </button>
        </div>
      </AccordionSection>

      <AccordionSection title="Activity">
        <ul className="space-y-2.5">
          <Activity
            icon={<MessageSquare className="h-3 w-3" />}
            text="Commented on your post"
            time={`${thread.lastActivity} ago`}
          />
          <Activity
            icon={<Tag className="h-3 w-3" />}
            text={
              <>
                Auto-tagged <em className="not-italic font-medium text-foreground">sizing</em>
              </>
            }
            time={`${thread.lastActivity} ago`}
          />
          {thread.assignedTo && (
            <Activity
              icon={<CheckCircle2 className="h-3 w-3" />}
              text={`Assigned to ${thread.assignedTo}`}
              time={`${thread.lastActivity} ago`}
            />
          )}
        </ul>
      </AccordionSection>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <dt className="w-24 shrink-0 text-[11px] font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 text-[12px] text-foreground/90">{children}</dd>
    </div>
  )
}

function AccordionSection({
  title,
  defaultOpen = false,
  locked = false,
  count,
  rightAction,
  children,
}: {
  title: string
  defaultOpen?: boolean
  locked?: boolean
  count?: number
  rightAction?: string
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen || locked)
  const hasBody = !!children
  return (
    <section className="border-b border-border/40 last:border-b-0">
      <div className="flex items-center px-2 py-3">
        <button
          type="button"
          onClick={() => !locked && hasBody && setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 text-left"
          aria-expanded={open}
          disabled={!hasBody || locked}
        >
          {!locked && (
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                !open && "-rotate-90",
              )}
            />
          )}
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
          {count !== undefined && (
            <span className="text-[12px] font-medium text-muted-foreground">{count}</span>
          )}
        </button>
        {rightAction && (
          <button
            type="button"
            className="ml-auto text-[12px] font-medium text-primary hover:underline"
          >
            {rightAction}
          </button>
        )}
      </div>
      {open && hasBody && <div className="px-2 pb-3">{children}</div>}
    </section>
  )
}

function Row({
  icon,
  label,
  tone = "default",
  children,
}: {
  icon: React.ReactNode
  label: string
  tone?: "default" | "warn" | "danger"
  children: React.ReactNode
}) {
  const valueTone =
    tone === "warn" ? "text-amber-700" : tone === "danger" ? "text-destructive" : "text-foreground"
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px]">{label}</span>
      </span>
      <span className={cn("ml-auto truncate text-[12px] font-medium", valueTone)}>{children}</span>
    </div>
  )
}

function Tagline({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#F2F6F8] px-2 py-0.5 text-[11px] font-medium text-foreground ring-1 ring-black/[0.05]">
      {children}
      <span className="text-muted-foreground hover:text-foreground">×</span>
    </span>
  )
}

function Activity({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode
  text: React.ReactNode
  time: string
}) {
  return (
    <li className="flex items-start gap-2 text-[12px]">
      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-foreground/90">{text}</p>
        <p className="text-[10px] text-muted-foreground">{time}</p>
      </div>
    </li>
  )
}
