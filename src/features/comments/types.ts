export type CommentStatus = 'PUBLISHED' | 'PENDING' | 'REJECTED' | 'REMOVED'

export interface BannerComment {
  id: string
  text: string
  createdAt: string
  // Already filtered by the server's identity visibility policy.
  author?: { displayName: string; ingressVerified: boolean }
  // Only the owner receives these fields, including for published comments.
  own?: boolean
  status?: CommentStatus
  moderationReason?: string
  canWithdraw?: boolean
}

export interface CommentPage {
  items: BannerComment[]
  nextCursor?: string | null
  publishedCount: number
}

export interface CommentCapabilities {
  canComment: boolean
  denialReason?: 'VERIFICATION_REQUIRED' | 'VERIFICATION_PENDING' | 'DISABLED'
  moderationMode: 'POSTMODERATION' | 'PREMODERATION'
  testVerificationExemption: boolean
  maxLength: number
}

export interface CommentSubmission {
  comment: BannerComment
  publishedCount: number
  capabilities: CommentCapabilities
}
