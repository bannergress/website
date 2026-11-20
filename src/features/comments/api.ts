import { api } from '../../api'
import type { BannerComment, CommentDraft } from './types'

const commentsPath = (bannerId: string) =>
  `bnrs/${encodeURIComponent(bannerId)}/comments`

const commentPath = (bannerId: string, uuid: string) =>
  `${commentsPath(bannerId)}/${encodeURIComponent(uuid)}`

export const getComments = (bannerId: string) =>
  api.get<BannerComment[]>(commentsPath(bannerId))

export const saveComment = (
  bannerId: string,
  uuid: string,
  {
    comment,
    ratingRoundTheClock,
    ratingOverall,
    ratingAccessibility,
    ratingPassphrases,
  }: CommentDraft
) =>
  api.put<BannerComment>(commentPath(bannerId, uuid), {
    comment,
    ratingRoundTheClock,
    ratingOverall,
    ratingAccessibility,
    ratingPassphrases,
  })

export const deleteComment = (bannerId: string, uuid: string) =>
  api.request<void>('DELETE', commentPath(bannerId, uuid), {}, undefined, true)
