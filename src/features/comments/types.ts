import type { NamedAgent } from '../mission/types'

export type CommentRating = 1 | 2 | 3 | 4 | 5
export type RoundTheClockRating = 'restricted' | 'unrestricted'

export interface CommentDraft {
  comment: string
  ratingRoundTheClock?: RoundTheClockRating
  ratingOverall?: CommentRating
  ratingAccessibility?: CommentRating
  ratingPassphrases?: CommentRating
}

export interface BannerComment extends CommentDraft {
  uuid: string
  author?: Partial<Pick<NamedAgent, 'faction'>> & Pick<NamedAgent, 'name'>
  created: string
}

export const commentRatingFields = [
  'ratingOverall',
  'ratingAccessibility',
  'ratingPassphrases',
] as const
