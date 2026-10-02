// Central place to check which integrations are configured.
// Anything missing falls back to a local development mode.

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supabase: {
    // Accept the URL even if it was pasted with the REST path (https://x.supabase.co/rest/v1/).
    url: (process.env.SUPABASE_URL ?? "").trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    serviceKey: (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim(),
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY ?? "",
    domain: process.env.MAILGUN_DOMAIN ?? "",
    base: process.env.MAILGUN_API_BASE || "https://api.mailgun.net",
    from: process.env.MAILGUN_FROM || "VitaNaija <orders@example.com>",
    notify: process.env.ORDER_NOTIFY_EMAIL ?? "",
  },
  google: {
    id: process.env.AUTH_GOOGLE_ID ?? "",
    secret: process.env.AUTH_GOOGLE_SECRET ?? "",
  },
};

export const hasSupabase = Boolean(env.supabase.url && env.supabase.serviceKey);
export const hasMailgun = Boolean(env.mailgun.apiKey && env.mailgun.domain);
export const hasGoogle = Boolean(env.google.id && env.google.secret);
export const isProd = process.env.NODE_ENV === "production";
