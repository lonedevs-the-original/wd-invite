# Taklif

Modern Uzbek online wedding invitations with a multi-event admin dashboard, guest lists, and RSVP tracking.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and publishable key.
3. Apply `supabase/migrations/202607260001_initial_schema.sql` to the Supabase project.
4. Run `npm install` and `npm run dev`.

Without environment variables the interface runs with included demo data.

## Routes

- `/` — product landing page
- `/i/aziz-diyora` — public invitation demo
- `/admin` — multi-wedding dashboard
- `/admin/invitations/new` — invitation editor
