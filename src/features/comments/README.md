# Banner comments frontend contract (#555)

This is the proposed v1 contract used by the website, to be implemented in the
backend. It does not describe an already deployed API. Enable the UI with
`VITE_COMMENTS_ENABLED=true` at build time after the backend is available.
It defaults off. This flag only exposes the UI; it grants no write permissions
and cannot enable the test verification exemption.

For the Deployment workflow, set the GitHub environment variable
`VITE_COMMENTS_ENABLED` to `true` in the selected target environment when it is
ready. The build forwards this variable to Vite. Leaving it unset or setting it
to `false` keeps the comments UI disabled.

Requests use the existing API base URL, bearer authentication and language header.
Only persisted banner detail pages opt in. Create/collection previews do not
request comments or expose the composer.

## Endpoints

| Method and path | Result |
| --- | --- |
| `GET bnrs/{slug}/comments?limit=20&cursor=...` | `CommentPage` containing published comments only |
| `GET bnrs/{slug}/comments/mine?limit=20&cursor=...` | Authenticated owner's history, including pending/rejected/removed comments |
| `GET bnrs/{slug}/comments/{commentId}` | Published comment or caller's own nonpublic comment; otherwise indistinguishable 404 |
| `GET user/comment-capabilities` | Authenticated `CommentCapabilities` |
| `POST bnrs/{slug}/comments` | Body `{ text, clientSubmissionId }`, returns `CommentSubmission` (200/201) |
| `DELETE comments/{commentId}` | Owner withdrawal, 204; no moderation violation |

Types are defined in `src/features/comments/types.ts`. No response is shared
between account sessions in the frontend. Authenticated/private responses must
also use appropriate private/no-store HTTP caching on the server.

`CommentPage` is `{ items, nextCursor?, publishedCount }`. Public and owner
cursors are opaque and independent. Order by `createdAt DESC, id DESC`, using
canonical UTC timestamps. `publishedCount` never includes private history.
Resolve banner slugs/aliases to the immutable banner UUID in the backend; the
frontend's existing `Banner.id` is a URL slug and must not be treated as a UUID.

`BannerComment` is `{ id, text, createdAt, author?, own?, status?,
moderationReason?, canWithdraw? }`. IDs must be URL-safe UUIDs.
`author` is `{ displayName, ingressVerified }`, already filtered by server
identity policy. Omit author identities for guests. The UI additionally hides
guest identities. Unlinked test users must have `ingressVerified: false`.
Never return email, subject IDs, verification secrets or private moderator notes.
Only the owner receives `own: true`, `status`, `moderationReason` and
`canWithdraw`. Status values: `PUBLISHED`, `PENDING`, `REJECTED`, `REMOVED`.

`CommentCapabilities` is `{ canComment, denialReason?, moderationMode,
testVerificationExemption, maxLength }`. Denial reasons are
`VERIFICATION_REQUIRED`, `VERIFICATION_PENDING`, `DISABLED`; unknown reasons
display a generic disabled message. Moderation mode is `POSTMODERATION` or
`PREMODERATION`. `maxLength` is a positive integer (suggested default 2000),
counted in Unicode code points. Text is plain text; preserve newlines and Unicode.

`testVerificationExemption` explicitly indicates that the current caller can
write under the server's trusted test-only exemption. It does not imply a verified
Ingress identity. Production verification, test exemption, authentication,
ownership, rate limits and moderation transitions are enforced on every write
by the backend. Missing/unavailable capabilities fail closed in the UI.

`CommentSubmission` is `{ comment, publishedCount, capabilities }`. Its `comment`
must include owner fields and the authoritative `PUBLISHED` or `PENDING` status.
Pending submissions appear only in owner history and do not affect public counts.
After moderation, Refresh/Retry or reopening the page retrieves current state;
this version does not poll or implement realtime moderation updates.

Bind `clientSubmissionId` (random UUID) to the authenticated subject, banner UUID
and original text. Replaying an accepted submission returns its existing result
without creating another comment. Retry the same draft with the same ID after
ambiguous failures; a changed draft gets a new ID. Recheck eligibility for new
submissions. No author, verification, environment, visibility or moderation
fields are submitted by the client.

Failures use HTTP 400/422 for invalid text, 401/403 for authentication/capability
denial, 404 for inaccessible comments, 409 for conflicts and 429 for rate limits.
The UI retains drafts on failures and refreshes capabilities after 401/403.
Withdrawal is idempotent, requires ownership and must remain available when new
submissions are disabled. On successful withdrawal, the frontend refreshes lists
and counts; retries must not turn a previously successful withdrawal into a strike.

## Permalinks and rollout checks

Permalinks use `/banner/{canonical-slug}#comment-{uuid}`. Loading a link selects
Comments and retrieves its target independently of pagination. Alias redirects
preserve the fragment. Backend banner rename/merge handling must preserve UUID
relationships and resolve old slugs appropriately. A forbidden/deleted target
displays the same generic unavailable message.

Before production activation, validate linked production accounts, unlinked and
pending production denials, server-enabled unlinked test accounts, premoderation,
rate limits, idempotent retries, owner withdrawal, guest DTO filtering and denied
private permalinks against the real API. The dedicated Telegram bot, backend
state machine/outbox, permissions and deployment remain separate work in #555.
