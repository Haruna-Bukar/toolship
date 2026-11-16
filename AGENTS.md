# Toolship

All-in-one AI SaaS website: several AI tools under one dashboard. Tagline: "All your tools, one ship."
Built by one developer (Yusuf, Nigeria). Audience: creators, developers and small teams in Africa.
Business model: 30 days free after sign up, then a paid plan (about 2,500 naira per month) through Paystack.

## Stack

- Frontend: React + Vite + Tailwind CSS v4 (theme tokens are in `src/index.css`), React Router, lucide-react
- Auth and database: Supabase (Auth, Postgres, Row Level Security)
- AI: Gemini API, called only from the server (`api/generate.js`)
- Hosting: Vercel (serverless functions in `/api`)
- Planned: Paystack payments (Stripe later)

## Design

- Dark theme. Background `#0a0a0f`, cards `#1a1a24`, brand teal `#2EC4B6`, primary buttons purple `#7C3AED`.
- Font: Inter. Mobile responsive. Voice: fast, simple, minimal.

## Project layout

- `api/generate.js` : one generic endpoint, `POST /api/generate` with body `{ tool, inputs }`. Looks up the tool, validates, builds the prompt, calls Gemini with a model fallback list, returns `{ results: [...] }`.
- `api/_tools.js` : server-side definition of every tool (`count`, `validate`, `prompt`). Prompts live ONLY here. The underscore stops Vercel from exposing it as a route.
- `src/data/toolConfigs.js` : client-side description of each tool (form fields, tip, templates, docs text, result labels, optional `tabs`, `saveHistory`, `pdfResultIndex`).
- `src/data/tools.js` : the homepage grid. `live: true` makes a card a link, `false` shows "Coming soon".
- `src/pages/ToolPage.jsx` : the single generic tool page for every tool (route `/tools/:toolName`).
- `src/pages/` : `Home`, `Login`, `Signup`, `ToolPage`.
- `src/components/` : `FormField`, `ResultCard`, `HistoryTab`, `TemplatesTab`, `DocsTab`, `ToolHeader`, `TrialBanner`, `ProtectedRoute`, `AuthLayout`, `PasswordField`, `Navbar`, `Hero`, `ToolsGrid`, `Footer`, `PlatformIcon`.
- `src/context/AuthProvider.jsx`, `src/context/authContext.js`, `src/hooks/useAuth.js` : auth state.
- `src/hooks/useHistory.js` : per-tool history stored in the Supabase `generations` table.
- `src/lib/supabase.js` : the shared Supabase client (publishable key only).
- `src/utils/extractText.js` : reads PDF, .docx and .txt files in the browser (pdfjs-dist, mammoth), loaded on demand.
- `src/utils/textToPdf.js` : builds a text-based resume PDF in the browser (jsPDF), loaded on demand.
- `supabase/schema.sql` : tables, Row Level Security policies, and the new-user trigger. Safe to run more than once.

## Tools

- `caption-generator` (CaptionCraft), `product-description-writer` (DescribeIt), `resume-optimizer` (ResumeBoost, supports file upload, editable result, PDF download, no history by design).
- The other seven are "Coming soon" cards.
- The tool slug must be spelled identically in `toolConfigs.js`, `api/_tools.js` and `tools.js`.

### How to add a tool

1. Add a config object in `src/data/toolConfigs.js`.
2. Add `count`, `validate` and `prompt` in `api/_tools.js`. Keep option lists in sync with the client config.
3. Set `live: true` for it in `src/data/tools.js`.

## Environment variables (`.env` in the project root, never committed)

- `GEMINI_API_KEY` : server only.
- `GEMINI_MODEL` : optional override. Model names change often, check Google AI Studio.
- `VITE_SUPABASE_URL` : base project URL only, ending in `.supabase.co`, with no path and no trailing slash.
- `VITE_SUPABASE_PUBLISHABLE_KEY` : the `sb_publishable_...` key. Safe in the browser.
- Planned, server only: `SUPABASE_SECRET_KEY` (service role). It must NEVER get a `VITE_` prefix and never appear in `src/`.

## Security rules (do not break these)

- Never put the Gemini key or any Supabase secret/service_role key in frontend code or in a `VITE_` variable.
- Prompts and validation stay on the server. Never accept a prompt from the browser.
- Every table has Row Level Security on. Users only touch their own rows (`auth.uid() = user_id`).
- Users must not be able to change `profiles.plan`, `profiles.pro_until` or `profiles.created_at` (column-level grants allow `full_name` only).
- `usage_events` is written only by the server with the secret key. Users can read their own rows only.
- Signed-out visitors (the `anon` role) have no table access.
- Keep anonymous sign-ins turned off in Supabase.
- Resume text is personal data. The resume tool does not save history. Do not log resume or job description contents.
- Frontend route protection is only convenience. Real enforcement happens on the server and in the database.

## Current status

- Done: homepage, three working tools, History/Templates/Docs tabs, resume file upload and PDF download, Supabase sign up and sign in pages, protected tool routes, RLS schema, history moved to Supabase.
- Verify first: sign up works end to end after the `VITE_SUPABASE_URL` fix.
- Not secure yet: `/api/generate` accepts anyone.

## Next steps (in this order)

1. The browser sends the user's access token (`Authorization: Bearer ...`) with each generate request. The server verifies it with Supabase and rejects missing or invalid tokens.
2. Server-side trial check: trial ends 30 days after `profiles.created_at`. Return a clear "trial ended" response for expired users with `plan = 'trial'`. Pro users pass while `pro_until` is in the future.
3. Per-user rate limit by counting recent rows in `usage_events`, which the server inserts with the secret key.
4. `TrialBanner` shows real days left (currently fixed at 30). Add the paywall screen.
5. Paystack checkout, with a webhook that sets `plan` and `pro_until` on the server. Verify webhook signatures.
6. Mobile menu for the navbar, forgot password flow, Privacy and Terms pages, per-user cost controls.

## Known issues and local setup notes

- On Windows, `npx vercel dev` can fail with `EPERM ... symlink`. Fix: turn on Developer Mode, clear `%LOCALAPPDATA%\com.vercel.cli\Cache\builders-vlt` (use robocopy, paths are very long), open a new terminal.
- `npm run dev` runs the frontend only on port 5173. `/api/generate` needs `vercel dev`, or a small dev proxy added to `vite.config.js`.
- After editing `.env`, fully restart the dev server. Hot reload does not re-read it.
- Standard PDF fonts only cover basic Latin characters, so `textToPdf.js` simplifies other characters.

## Working style

- Use regular punctuation. No em dashes or en dashes in documents, UI text or generated text.
- After writing code, explain what it does and why, in plain language. The developer is learning.
- Keep changes small and focused. Do not rewrite unrelated files.
- Do not add dependencies without saying why.
- Run `npm run lint` and `npm run build` before saying a task is finished.
