# URL Shortener Dashboard

A minimal URL shortener built with Next.js App Router and Supabase. Create short URLs, redirect via `/:slug`, and inspect per‑link click analytics (totals, last 7 days, referrers, and device breakdown).

## Features

- Create short URLs with optional custom slug and expiration
- Redirect handler at `/:slug` that logs each click into a `clicks` table
- Per‑URL analytics endpoint and dashboard (`/urls/[slug]`)
- Overview table of all URLs at `/urls`
- Fully server-rendered UI with a simple card-based analytics layout (no charting library)

## Tech stack

- **Framework:** Next.js App Router
- **Database & auth:** Supabase
- **Styling:** Tailwind-style utility classes (via `globals.css`)
- **Language:** TypeScript

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a Supabase project and a public anon key. Then set the following environment variables (for local dev you can use a `.env.local` file):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: base URL used in UI when not running in the browser
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Database schema

Create two tables in Supabase (SQL editor):

```sql
create table public.urls (
  id bigint generated always as identity primary key,
  slug text unique not null,
  target_url text not null,
  clicks_count bigint default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table public.clicks (
  id bigint generated always as identity primary key,
  url_id bigint not null references public.urls(id) on delete cascade,
  referrer text,
  user_agent text,
  device_type text,
  created_at timestamptz default now()
);

-- Optional: trigger to keep clicks_count in sync
create or replace function public.increment_clicks_count()
returns trigger as $$
begin
  update public.urls
  set clicks_count = coalesce(clicks_count, 0) + 1
  where id = new.url_id;
  return new;
end;
$$ language plpgsql;

create trigger clicks_after_insert
after insert on public.clicks
for each row
execute procedure public.increment_clicks_count();
```

> The app assumes `clicks_count` exists on `urls` for fast list views, but it will still work without the trigger; totals will just be lower‑fidelity.

### 4. Run the dev server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## App overview

### Routes

- `/` – Marketing/overview page explaining the 3‑step flow and architecture
- `/urls` – Table of all URLs, showing slug, target, clicks, created date, and expiration
- `/urls/new` – Form to create a new short URL
- `/urls/[slug]` – Analytics dashboard for a specific URL (totals, last 7 days, referrers, devices)
- `/:slug` – Redirect route that looks up the URL in Supabase, logs a click row, and 302‑redirects to the target
- `/api/urls` – POST endpoint used by the create form
- `/api/urls/[slug]/analytics` – GET endpoint returning analytics JSON consumed by `/urls/[slug]`

### Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key (required)
- `NEXT_PUBLIC_BASE_URL` – Base URL used when constructing links on the server (optional but recommended)

## Development

- Lint: `npm run lint`
- Build: `npm run build`

This project was bootstrapped with `create-next-app` but the templates and copy have been rewritten for the URL shortener use case.
