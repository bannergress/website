import { api } from '../../api'
import type {
  BannerComment,
  CommentCapabilities,
  CommentPage,
  CommentSubmission,
} from './types'

const commentsPath = (bannerId: string) =>
  `bnrs/${encodeURIComponent(bannerId)}/comments`

export const getComments = (bannerId: string, cursor?: string) =>
  api.get<CommentPage>(commentsPath(bannerId), { cursor, limit: 20 })

export const getOwnComments = (bannerId: string, cursor?: string) =>
  api.get<CommentPage>(`${commentsPath(bannerId)}/mine`, { cursor, limit: 20 })

export const getComment = (bannerId: string, id: string) =>
  api.get<BannerComment>(`${commentsPath(bannerId)}/${encodeURIComponent(id)}`)

export const getCommentCapabilities = () =>
  api.get<CommentCapabilities>('user/comment-capabilities')

export const submitComment = (
  bannerId: string,
  text: string,
  clientSubmissionId: string
) =>
  api.post<CommentSubmission>(commentsPath(bannerId), {
    text,
    clientSubmissionId,
  })

export const withdrawComment = (id: string) =>
  api.request<void>(
    'DELETE',
    `comments/${encodeURIComponent(id)}`,
    {},
    undefined,
    true
  )
