# Banner comments

`VITE_COMMENTS_ENABLED` enables the desktop and mobile Comments views for
saved banners. Keep it off until the backend and Keycloak roles are configured.

## Backend contract

- `GET /bnrs/{bannerId}/comments` returns a newest-first array to signed-in
  users. The frontend uses the array length for the count and resolves
  `#comment-{uuid}` links from the same array.
- `PUT /bnrs/{bannerId}/comments/{uuid}` requires the `create-comment`
  realm role. The client generates the UUID for a new comment and reuses it on
  retry. The backend returns the saved comment.
- The PUT body contains `comment` and optional `ratingRoundTheClock`
  (`restricted` or `unrestricted`), `ratingOverall`, `ratingAccessibility`
  and `ratingPassphrases` (integers from 1 to 5). The response adds the
  read-only fields `uuid`, optional `author` (`name`, optional `faction`) and
  `created`.
- `DELETE /bnrs/{bannerId}/comments/{uuid}` requires `manage-comments`
  and is available from the comment on the website.

The backend checks ownership on PUT. The list provides no ownership field, so
the website offers editing for UUIDs it has confirmed by saving them during the
current banner visit. Editing older comments requires an authoritative
ownership indicator in the backend response.

## Publication and moderation

Successful writes are visible immediately. Moderators remove comments on the
website. Telegram is a read-only feed with links back to the website. A
permanent posting ban is applied in Keycloak by revoking effective
`create-comment` access. The website gates the composer on that role and the
backend enforces it on every PUT.

Before rollout, verify that production grants the role only to verified,
non-banned accounts, and that relinking cannot restore it for banned accounts.
Use the test realm to grant access to signed-in unlinked testers. Check ban
enforcement against active sessions and confirm TEST/PROD feed isolation.
The backend must bind comment UUIDs to their banner on writes and prevent a
stale edit or retry from recreating a comment removed by moderation.
