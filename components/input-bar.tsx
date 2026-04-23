"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  AtSign,
  Check,
  ChevronDown,
  CornerUpLeft,
  Image as ImageIcon,
  Lock,
  Maximize2,
  Minimize2,
  Send,
  Smile,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Mode = "public" | "private"

export type ReplyContext = {
  commentId: string
  name: string
  direction: "in" | "out"
  canReplyPrivately: boolean
}

type Props = {
  replyContext: ReplyContext | null
  onClear: () => void
}

export function InputBar({ replyContext, onClear }: Props) {
  const [mode, setMode] = useState<Mode>("public")
  const [value, setValue] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const enabled = replyContext !== null
  const privateAvailable =
    enabled && replyContext!.direction === "in" && replyContext!.canReplyPrivately

  useEffect(() => {
    if (replyContext) {
      if (expanded) textareaRef.current?.focus()
      else inputRef.current?.focus()
    } else {
      setValue("")
      setMode("public")
      setExpanded(false)
    }
  }, [replyContext?.commentId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!enabled) return
    if (expanded) textareaRef.current?.focus()
    else inputRef.current?.focus()
  }, [expanded, enabled])

  useEffect(() => {
    if (mode === "private" && !privateAvailable) setMode("public")
  }, [mode, privateAvailable])

  useEffect(() => {
    if (!menuOpen) return
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [menuOpen])

  const canSend = enabled && value.trim().length > 0

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-3xl">
        {expanded && enabled ? (
          /* ============== EXPANDED CARD ============== */
          <div
            className={cn(
              "rounded-2xl border border-border/50 bg-card shadow-card",
              "focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15",
            )}
          >
            <div className="flex items-center gap-1 px-2 pt-2">
              <ModeDropdown
                mode={mode}
                setMode={setMode}
                enabled={enabled}
                privateAvailable={privateAvailable}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                menuRef={menuRef}
              />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Collapse"
                title="Collapse"
                className="ml-auto grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              placeholder={
                mode === "public"
                  ? `Reply publicly to ${replyContext!.name}…`
                  : `Send a private message to ${replyContext!.name}…`
              }
              className="block w-full resize-none bg-transparent px-3 py-2 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            />

            <div className="flex items-center gap-0.5 border-t border-border/40 px-2 py-1.5">
              <ToolIcon label="Emoji" disabled={!enabled}>
                <Smile className="h-4 w-4" />
              </ToolIcon>
              <ToolIcon label="Attach image" disabled={!enabled}>
                <ImageIcon className="h-4 w-4" />
              </ToolIcon>
              <ToolIcon label="Mention" disabled={!enabled}>
                <AtSign className="h-4 w-4" />
              </ToolIcon>
              <span className="ml-auto mr-2 text-[10.5px] text-muted-foreground">
                {value.length > 0 ? `${value.length} chars` : "⌘↵ to send"}
              </span>
              <div className="mx-1 h-5 w-px bg-border/70" aria-hidden="true" />
              <SendButton canSend={canSend} />
            </div>
          </div>
        ) : (
          /* ============== COLLAPSED BAR ============== */
          <div
            className={cn(
              "flex items-center gap-1 rounded-xl border bg-card p-1.5 transition-colors",
              enabled
                ? "border-border/50 shadow-card focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15"
                : "border-dashed border-border/60 shadow-[0_1px_3px_-1px_rgba(16,24,40,0.05),0_6px_20px_-8px_rgba(16,24,40,0.08)]",
            )}
          >
            <ModeDropdown
              mode={mode}
              setMode={setMode}
              enabled={enabled}
              privateAvailable={privateAvailable}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              menuRef={menuRef}
            />

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!enabled}
              placeholder={
                !enabled
                  ? "Select a comment to reply…"
                  : mode === "public"
                    ? `Reply publicly to ${replyContext!.name}…`
                    : `Send a private message to ${replyContext!.name}…`
              }
              className={cn(
                "min-w-0 flex-1 bg-transparent px-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none",
                !enabled && "cursor-not-allowed",
              )}
            />

            <div className="flex items-center gap-0.5">
              <ToolIcon label="Emoji" disabled={!enabled}>
                <Smile className="h-4 w-4" />
              </ToolIcon>
              <ToolIcon label="Attach image" disabled={!enabled}>
                <ImageIcon className="h-4 w-4" />
              </ToolIcon>
              <ToolIcon label="Mention" disabled={!enabled}>
                <AtSign className="h-4 w-4" />
              </ToolIcon>
              <ToolIcon
                label="Expand"
                disabled={!enabled}
                onClick={() => enabled && setExpanded(true)}
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </ToolIcon>
            </div>

            <div className="mx-1 h-5 w-px bg-border/70" aria-hidden="true" />

            <SendButton canSend={canSend} />
          </div>
        )}
      </div>
    </div>
  )
}

function SendButton({ canSend }: { canSend: boolean }) {
  return (
    <button
      type="button"
      disabled={!canSend}
      aria-label="Send"
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-all",
        canSend
          ? "shadow-[0_2px_8px_-2px_rgba(0,71,255,0.4)] hover:brightness-110"
          : "cursor-not-allowed opacity-40",
      )}
    >
      <Send className="h-3.5 w-3.5" />
    </button>
  )
}

function ModeDropdown({
  mode,
  setMode,
  enabled,
  privateAvailable,
  menuOpen,
  setMenuOpen,
  menuRef,
}: {
  mode: Mode
  setMode: (m: Mode) => void
  enabled: boolean
  privateAvailable: boolean
  menuOpen: boolean
  setMenuOpen: (v: boolean | ((o: boolean) => boolean)) => void
  menuRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        disabled={!enabled}
        onClick={() => setMenuOpen((o) => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-[#F2F4F9] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
          enabled ? "text-foreground hover:bg-muted" : "cursor-not-allowed text-muted-foreground",
        )}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
      >
        {mode === "private" ? (
          <Lock className="h-3 w-3 text-muted-foreground" />
        ) : (
          <CornerUpLeft className="h-3 w-3 text-muted-foreground" />
        )}
        <span>{mode === "private" ? "Private" : "Public"}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {menuOpen && enabled && (
        <div
          className="absolute bottom-full left-0 z-20 mb-1.5 w-52 overflow-hidden rounded-xl border border-border/60 bg-popover p-1 shadow-lg"
          role="menu"
        >
          <ModeOption
            active={mode === "public"}
            icon={<CornerUpLeft className="h-3.5 w-3.5" />}
            title="Public reply"
            subtitle="Visible on the post"
            onSelect={() => {
              setMode("public")
              setMenuOpen(false)
            }}
          />
          <ModeOption
            active={mode === "private"}
            disabled={!privateAvailable}
            icon={<Lock className="h-3.5 w-3.5" />}
            title="Private message"
            subtitle={
              privateAvailable ? "Sent via Messenger" : "Not available for this comment"
            }
            onSelect={() => {
              if (!privateAvailable) return
              setMode("private")
              setMenuOpen(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function ModeOption({
  active,
  disabled,
  icon,
  title,
  subtitle,
  onSelect,
}: {
  active: boolean
  disabled?: boolean
  icon: React.ReactNode
  title: string
  subtitle: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      role="menuitem"
      className={cn(
        "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
        disabled
          ? "cursor-not-allowed opacity-50"
          : active
            ? "bg-primary/10"
            : "hover:bg-muted",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md",
          active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "text-[12.5px] font-semibold",
              active ? "text-primary" : "text-foreground",
            )}
          >
            {title}
          </span>
          {active && <Check className="h-3 w-3 text-primary" />}
        </div>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  )
}

function ToolIcon({
  children,
  label,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-md text-muted-foreground",
        disabled ? "cursor-not-allowed" : "hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
