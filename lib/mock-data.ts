export type CommentDirection = "in" | "out"
export type ThreadState = "open" | "closed"

export type Reaction = {
  emoji: string
  label: string
  count: number
}

export type Comment = {
  id: string
  direction: CommentDirection
  authorName: string
  authorHandle?: string
  authorInitials: string
  authorColor: string
  text: string
  timestamp: string
  likeCount?: number
  hidden?: boolean
  canReplyPrivately?: boolean
  reactions?: Reaction[]
  totalReactions?: number
  replyTo?: string
  mentions?: string[]
}

export type SubThread = {
  id: string
  commenterName: string
  commenterHandle?: string
  commenterInitials: string
  commenterColor: string
  state: ThreadState
  assignedTo?: string
  lastActivity: string
  unreadCount?: number
  comments: Comment[]
}

export type PostListPage = {
  name: string
  initial: string
  avatarColor: string
  pictureUrl?: string
}

export type PostListAssignee = {
  name: string
  isCurrentUser?: boolean
}

export type PostListItem = {
  id: string
  pageName: string
  page: PostListPage
  thumbnailQuery: string
  snippet?: string
  postedAt: string
  statusType: "PHOTO" | "VIDEO" | "STATUS" | "LINK"
  isPublished: boolean
  permalinkUrl: string
  promotionStatus: "active" | "inactive"
  lastCommentAt: string
  totalComments: number
  totalUnanswered: number
  totalRepliesPublic: number
  totalRepliesPrivate: number
  totalHidden: number
  totalDeleted: number
  topCommenters: Array<{ initials: string; color: string }>
  assignee?: PostListAssignee
  active?: boolean
}

export type ActivePost = {
  id: string
  pageName: string
  thumbnailQuery: string
  message: string
  postedAt: string
  statusType: PostListItem["statusType"]
  permalinkUrl: string
  totalComments: number
  reactionCount: number
  totalRepliesPublic: number
  totalRepliesPrivate: number
  totalHidden: number
  totalDeleted: number
}

const COLORS = {
  sarah: "bg-[oklch(0.88_0.12_30)] text-[oklch(0.35_0.15_30)]",
  michael: "bg-[oklch(0.88_0.12_180)] text-[oklch(0.35_0.15_220)]",
  jessica: "bg-[oklch(0.88_0.12_330)] text-[oklch(0.35_0.15_330)]",
  david: "bg-[oklch(0.88_0.12_140)] text-[oklch(0.35_0.15_140)]",
  priya: "bg-[oklch(0.88_0.12_60)] text-[oklch(0.35_0.15_60)]",
  alex: "bg-[oklch(0.88_0.12_280)] text-[oklch(0.35_0.15_280)]",
  page: "bg-primary text-primary-foreground",
}

const PAGES = {
  northfield: {
    name: "Northfield Supply Co.",
    initial: "N",
    avatarColor: "bg-[oklch(0.82_0.12_160)] text-[oklch(0.30_0.15_160)]",
  },
  wuphf: {
    name: "WUPHF.com",
    initial: "W",
    avatarColor: "bg-[oklch(0.82_0.12_250)] text-[oklch(0.30_0.15_250)]",
  },
} satisfies Record<string, PostListPage>

export const posts: PostListItem[] = [
  {
    id: "post-essential-tee",
    pageName: "Northfield Supply Co.",
    page: PAGES.northfield,
    thumbnailQuery: "minimalist cotton tshirt flatlay neutral tones",
    snippet:
      "New drop is live. The Essential Tee in four new colors — cut from 240gsm organic cotton.",
    postedAt: "Yesterday at 10:24 AM",
    statusType: "PHOTO",
    isPublished: true,
    permalinkUrl: "https://facebook.com/northfield/posts/essential-tee",
    promotionStatus: "active",
    lastCommentAt: "4m",
    totalComments: 342,
    totalUnanswered: 3,
    totalRepliesPublic: 28,
    totalRepliesPrivate: 4,
    totalHidden: 2,
    totalDeleted: 1,
    topCommenters: [
      { initials: "SC", color: COLORS.sarah },
      { initials: "MT", color: COLORS.michael },
      { initials: "PR", color: COLORS.priya },
    ],
    assignee: { name: "Priya Raman" },
    active: true,
  },
  {
    id: "post-fall-lookbook",
    pageName: "Northfield Supply Co.",
    page: PAGES.northfield,
    thumbnailQuery: "fall collection lookbook autumn editorial",
    snippet:
      "Fall lookbook is here — a study in layering, rust tones, and weight.",
    postedAt: "2 days ago",
    statusType: "PHOTO",
    isPublished: true,
    permalinkUrl: "https://facebook.com/northfield/posts/fall-lookbook",
    promotionStatus: "inactive",
    lastCommentAt: "1h",
    totalComments: 128,
    totalUnanswered: 1,
    totalRepliesPublic: 12,
    totalRepliesPrivate: 1,
    totalHidden: 0,
    totalDeleted: 0,
    topCommenters: [
      { initials: "JP", color: COLORS.jessica },
      { initials: "DK", color: COLORS.david },
    ],
  },
  {
    id: "post-winter-arrivals",
    pageName: "WUPHF.com",
    page: PAGES.wuphf,
    thumbnailQuery: "winter jacket product photography snow",
    postedAt: "4 days ago",
    statusType: "VIDEO",
    isPublished: true,
    permalinkUrl: "https://facebook.com/northfield/posts/winter-arrivals",
    promotionStatus: "inactive",
    lastCommentAt: "3h",
    totalComments: 64,
    totalUnanswered: 2,
    totalRepliesPublic: 6,
    totalRepliesPrivate: 0,
    totalHidden: 0,
    totalDeleted: 0,
    topCommenters: [
      { initials: "DK", color: COLORS.david },
    ],
  },
  {
    id: "post-summer-sale",
    pageName: "Northfield Supply Co.",
    page: PAGES.northfield,
    thumbnailQuery: "summer sale fashion banner bright colors",
    snippet: "Summer sale is on — up to 40% off across the entire catalog.",
    postedAt: "5 days ago",
    statusType: "PHOTO",
    isPublished: true,
    permalinkUrl: "https://facebook.com/northfield/posts/summer-sale",
    promotionStatus: "active",
    lastCommentAt: "30m",
    totalComments: 891,
    totalUnanswered: 47,
    totalRepliesPublic: 74,
    totalRepliesPrivate: 12,
    totalHidden: 5,
    totalDeleted: 2,
    topCommenters: [
      { initials: "SC", color: COLORS.sarah },
      { initials: "AR", color: COLORS.alex },
    ],
  },
  {
    id: "post-viral-reel",
    pageName: "WUPHF.com",
    page: PAGES.wuphf,
    thumbnailQuery: "viral social media reel behind the scenes studio",
    snippet: "Behind the scenes from our last shoot — this one took off.",
    postedAt: "1 week ago",
    statusType: "VIDEO",
    isPublished: true,
    permalinkUrl: "https://facebook.com/wuphf/posts/viral-reel",
    promotionStatus: "active",
    lastCommentAt: "2m",
    totalComments: 4320,
    totalUnanswered: 150,
    totalRepliesPublic: 310,
    totalRepliesPrivate: 28,
    totalHidden: 18,
    totalDeleted: 7,
    topCommenters: [
      { initials: "MT", color: COLORS.michael },
      { initials: "JP", color: COLORS.jessica },
      { initials: "DK", color: COLORS.david },
    ],
  },
]

export const activePost: ActivePost = {
  id: "post-essential-tee",
  pageName: "Northfield Supply Co.",
  thumbnailQuery: "minimalist cotton tshirt flatlay neutral tones",
  message:
    "New drop is live. The Essential Tee in four new colors — cut from 240gsm organic cotton and built to last. Free shipping on orders over $75.",
  postedAt: "Yesterday at 10:24 AM",
  statusType: "PHOTO",
  permalinkUrl: "https://facebook.com/northfield/posts/essential-tee",
  totalComments: 342,
  reactionCount: 89,
  totalRepliesPublic: 28,
  totalRepliesPrivate: 4,
  totalHidden: 2,
  totalDeleted: 1,
}

const PAGE_AUTHOR = {
  authorName: "Northfield Supply Co.",
  authorInitials: "NS",
  authorColor: COLORS.page,
}

export const subThreads: SubThread[] = [
  {
    id: "sub-sarah",
    commenterName: "Sarah Chen",
    commenterHandle: "@sarah.chen.98",
    commenterInitials: "SC",
    commenterColor: COLORS.sarah,
    state: "open",
    assignedTo: "Priya",
    lastActivity: "4m",
    unreadCount: 1,
    comments: [
      {
        id: "sarah-1",
        direction: "in",
        authorName: "Sarah Chen",
        authorHandle: "@sarah.chen.98",
        authorInitials: "SC",
        authorColor: COLORS.sarah,
        text:
          "Is this available in sizes larger than XL? I've been looking everywhere for a brand that actually goes up to 3XL in this fit — your stuff is the only thing that's caught my eye in months.",
        timestamp: "4m ago",
        likeCount: 3,
        canReplyPrivately: true,
        reactions: [
          { emoji: "❤️", label: "Love", count: 4 },
          { emoji: "👍", label: "Like", count: 2 },
        ],
        totalReactions: 6,
      },
      {
        id: "sarah-reply",
        direction: "out",
        ...PAGE_AUTHOR,
        text:
          "@Sarah Chen Hi Sarah! Our Essential Tee runs up to XXL right now, and we're adding 3XL to the next production run in May. I'll DM you when pre-orders open.",
        timestamp: "2m ago",
        likeCount: 2,
        mentions: ["Sarah Chen"],
        replyTo: "Sarah Chen",
      },
      {
        id: "sarah-followup",
        direction: "in",
        authorName: "Sarah Chen",
        authorHandle: "@sarah.chen.98",
        authorInitials: "SC",
        authorColor: COLORS.sarah,
        text:
          "amazing, thank you! one more q — any plans for the crew neck in heather grey? that's the colorway I've been hoping for 🤞",
        timestamp: "Just now",
        likeCount: 0,
      },
    ],
  },
  {
    id: "sub-alex",
    commenterName: "Alex Rivera",
    commenterHandle: "@alex.rivera",
    commenterInitials: "AR",
    commenterColor: COLORS.alex,
    state: "open",
    assignedTo: "Priya",
    lastActivity: "12m",
    comments: [
      {
        id: "alex-1",
        direction: "in",
        authorName: "Alex Rivera",
        authorHandle: "@alex.rivera",
        authorInitials: "AR",
        authorColor: COLORS.alex,
        text:
          "Do you ship internationally? I'm in Madrid and would love to get my hands on this.",
        timestamp: "12m ago",
        likeCount: 2,
        canReplyPrivately: true,
      },
      {
        id: "alex-reply-1",
        direction: "out",
        ...PAGE_AUTHOR,
        text:
          "@Alex Rivera Hi Alex! We currently ship to US and Canada only, but international is on our Q3 roadmap.",
        timestamp: "10m ago",
        likeCount: 1,
        mentions: ["Alex Rivera"],
        replyTo: "Alex Rivera",
      },
      {
        id: "alex-2",
        direction: "in",
        authorName: "Alex Rivera",
        authorHandle: "@alex.rivera",
        authorInitials: "AR",
        authorColor: COLORS.alex,
        text: "Any way I can get notified when you launch in Europe?",
        timestamp: "8m ago",
        likeCount: 0,
      },
      {
        id: "alex-reply-2",
        direction: "out",
        ...PAGE_AUTHOR,
        text:
          "Absolutely — drop your email at northfield.co/notify-eu and we'll ping you first.",
        timestamp: "6m ago",
        likeCount: 1,
      },
      {
        id: "alex-3",
        direction: "in",
        authorName: "Alex Rivera",
        authorHandle: "@alex.rivera",
        authorInitials: "AR",
        authorColor: COLORS.alex,
        text:
          "Just signed up, thanks! One more thing — do you offer tax-inclusive pricing when you launch?",
        timestamp: "4m ago",
        likeCount: 0,
      },
    ],
  },
  {
    id: "sub-michael",
    commenterName: "Michael Torres",
    commenterHandle: "@mike.torres",
    commenterInitials: "MT",
    commenterColor: COLORS.michael,
    state: "closed",
    assignedTo: "Priya",
    lastActivity: "22m",
    comments: [
      {
        id: "michael-1",
        direction: "in",
        authorName: "Michael Torres",
        authorInitials: "MT",
        authorColor: COLORS.michael,
        text: "Just got mine today, the quality is incredible — thank you!",
        timestamp: "22m ago",
        likeCount: 8,
        canReplyPrivately: true,
        reactions: [{ emoji: "❤️", label: "Love", count: 3 }],
        totalReactions: 3,
      },
      {
        id: "michael-reply",
        direction: "out",
        ...PAGE_AUTHOR,
        text: "@Michael Torres Thanks so much, Michael — glad it landed well!",
        timestamp: "18m ago",
        likeCount: 1,
        mentions: ["Michael Torres"],
        replyTo: "Michael Torres",
      },
    ],
  },
  {
    id: "sub-jessica",
    commenterName: "Jessica Park",
    commenterInitials: "JP",
    commenterColor: COLORS.jessica,
    state: "open",
    lastActivity: "1h",
    unreadCount: 1,
    comments: [
      {
        id: "jessica-1",
        direction: "in",
        authorName: "Jessica Park",
        authorInitials: "JP",
        authorColor: COLORS.jessica,
        text: "this is obvious scam don't buy from them they never ship",
        timestamp: "1h ago",
        likeCount: 0,
        hidden: true,
        canReplyPrivately: false,
      },
    ],
  },
  {
    id: "sub-david",
    commenterName: "David Kim",
    commenterInitials: "DK",
    commenterColor: COLORS.david,
    state: "open",
    assignedTo: "Priya",
    lastActivity: "3h",
    unreadCount: 1,
    comments: [
      {
        id: "david-1",
        direction: "in",
        authorName: "David Kim",
        authorInitials: "DK",
        authorColor: COLORS.david,
        text: "Do you ship to Canada? Couldn't find shipping info on the site.",
        timestamp: "3h ago",
        likeCount: 1,
        canReplyPrivately: true,
      },
    ],
  },
  {
    id: "sub-priya",
    commenterName: "Priya Raman",
    commenterInitials: "PR",
    commenterColor: COLORS.priya,
    state: "closed",
    lastActivity: "6h",
    comments: [
      {
        id: "priya-1",
        direction: "in",
        authorName: "Priya Raman",
        authorInitials: "PR",
        authorColor: COLORS.priya,
        text:
          "Wore mine on a 10-hour flight, zero wrinkles. Sold on the fabric 🙌",
        timestamp: "6h ago",
        likeCount: 12,
        canReplyPrivately: true,
        reactions: [
          { emoji: "❤️", label: "Love", count: 5 },
          { emoji: "👍", label: "Like", count: 4 },
        ],
        totalReactions: 9,
      },
      {
        id: "priya-reply",
        direction: "out",
        ...PAGE_AUTHOR,
        text:
          "@Priya Raman That's the dream use case — thank you for sharing, Priya!",
        timestamp: "5h ago",
        likeCount: 2,
        mentions: ["Priya Raman"],
        replyTo: "Priya Raman",
      },
    ],
  },
]
