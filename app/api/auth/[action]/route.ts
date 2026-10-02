// Auth.js endpoints with one segment: /api/auth/session, /csrf, /providers, /signin, /signout, /error.
// Split into [action] and [action]/[provider] instead of a [...nextauth] catch-all because
// GitHub's browser uploader rejects folder names containing "...". Auth.js reads the full
// request URL, so both routes share the same handlers.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
