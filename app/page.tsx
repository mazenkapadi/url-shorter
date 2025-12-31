// app/page.tsx

import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#050507] text-zinc-100">
            <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 md:px-6 md:py-12">
                {/* Header */}
                <header className="space-y-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-2">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                                Links · Analytics
                            </p>
                            <h1 className="text-3xl font-medium text-zinc-50 md:text-[2.1rem]">
                                URL Shortener Dashboard
                            </h1>
                            <p className="max-w-md text-sm text-zinc-500">
                                Create short links, track click behavior, and inspect referrers and
                                devices in a compact analytics view.
                            </p>
                            <p className="text-[11px] text-zinc-600">
                                Powered by{" "}
                                <span className="font-mono text-zinc-300">Next.js · Supabase · nanoid</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Link
                                href="/urls/new"
                                className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-xs font-medium text-black hover:bg-zinc-200 transition-colors"
                            >
                                Create short URL
                            </Link>
                            <Link
                                href="/urls"
                                className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-[#050507] px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900 transition-colors"
                            >
                                View all links
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Main layout */}
                <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    {/* Left: 3-step flow (Notes-style) */}
                    <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-5 py-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 text-[10px]">
                    1
                  </span>
                                    <span>Define your link</span>
                                </div>
                                <span
                                    className="rounded-full border border-zinc-800 bg-[#050507] px-2 py-0.5 text-[10px] text-zinc-500">
                  Input
                </span>
                            </div>
                            <p className="mb-3 text-xs text-zinc-500">
                                Paste a long URL, optionally add a custom slug and expiration. This
                                creates a new row in the{" "}
                                <span className="font-mono text-[10px] text-zinc-300">urls</span> table.
                            </p>
                            <Link
                                href="/urls/new"
                                className="inline-flex items-center rounded-xl bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-black hover:bg-zinc-200 transition-colors"
                            >
                                Create short URL
                            </Link>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-5 py-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 text-[10px]">
                    2
                  </span>
                                    <span>Share the slug</span>
                                </div>
                                <span
                                    className="rounded-full border border-zinc-800 bg-[#050507] px-2 py-0.5 text-[10px] text-zinc-500">
                  Routing
                </span>
                            </div>
                            <p className="text-xs text-zinc-500">
                                The short URL is just{" "}
                                <span className="font-mono text-[10px] text-zinc-300">
                  /&lt;slug&gt;
                </span>{" "}
                                handled by a dynamic route. Any time someone clicks it, the server
                                looks up the destination and redirects them.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-5 py-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-800 text-[10px]">
                    3
                  </span>
                                    <span>Inspect analytics</span>
                                </div>
                                <span
                                    className="rounded-full border border-zinc-800 bg-[#050507] px-2 py-0.5 text-[10px] text-zinc-500">
                  Observability
                </span>
                            </div>
                            <p className="mb-3 text-xs text-zinc-500">
                                Each redirect logs a click event with timestamp, referrer, and device
                                type. Per‑URL analytics pages aggregate this into totals, 7‑day
                                trends, referrers, and device breakdowns.
                            </p>
                            <Link
                                href="/urls"
                                className="inline-flex text-[11px] font-medium text-zinc-300 underline-offset-2 hover:underline"
                            >
                                Open analytics dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Right: sample metrics card (GitHub-style panel) */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-5 py-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                                        Sample · Link
                                    </p>
                                    <h2 className="mt-1 text-sm font-medium text-zinc-50">
                                        Launch campaign link
                                    </h2>
                                </div>
                                <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
                  Demo data
                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] text-zinc-500">Short URL</p>
                                    <p className="font-mono text-[11px] text-zinc-200">
                                        https://sho.mazen.dev/launch
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div className="rounded-xl border border-zinc-900 bg-[#050507] px-3 py-3">
                                        <p className="mb-1 text-[11px] text-zinc-500">Total clicks</p>
                                        <p className="text-base font-semibold text-zinc-50">248</p>
                                    </div>
                                    <div className="rounded-xl border border-zinc-900 bg-[#050507] px-3 py-3">
                                        <p className="mb-1 text-[11px] text-zinc-500">Last 7 days</p>
                                        <p className="text-base font-semibold text-zinc-50">63</p>
                                    </div>
                                    <div className="rounded-xl border border-zinc-900 bg-[#050507] px-3 py-3">
                                        <p className="mb-1 text-[11px] text-zinc-500">Top device</p>
                                        <p className="text-base font-semibold text-zinc-50">Mobile</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[11px] text-zinc-500">Top referrers</p>
                                    <ul className="space-y-1 text-[11px] text-zinc-300">
                                        <li className="flex items-center justify-between">
                                            <span>linkedin.com</span>
                                            <span className="font-medium">42</span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>github.com</span>
                                            <span className="font-medium">28</span>
                                        </li>
                                        <li className="flex items-center justify-between">
                                            <span>direct</span>
                                            <span className="font-medium">19</span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="pt-1 text-[11px] text-zinc-500">
                                    Layout and hierarchy mirror the GitHub metrics dashboard and Notes
                                    Summarizer so this feels like part of the same internal toolkit.
                                </p>
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Architecture & data flow */}
                <section className="space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                                Under the hood
                            </p>
                            <h2 className="text-lg font-medium text-zinc-50">
                                How the shortener works
                            </h2>
                            <p className="max-w-2xl text-xs text-zinc-500">
                                A thin Next.js layer in front of Supabase: server routes handle slugs,
                                log events, and aggregate data; the UI stays as a set of focused
                                cards instead of a heavy charting app.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Request flow */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-4">
                            <p className="text-[11px] text-zinc-600">Request flow</p>
                            <h3 className="mt-1 text-sm font-medium text-zinc-50">
                                From slug to redirect
                            </h3>
                            <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-500">
                                <li>
                                    1. Browser hits <code className="font-mono">/:slug</code> (dynamic
                                    route).
                                </li>
                                <li>
                                    2. Server looks up the slug in{" "}
                                    <span className="font-mono text-zinc-300">urls</span>, validates
                                    existence and expiration.
                                </li>
                                <li>
                                    3. A click row is inserted into{" "}
                                    <span className="font-mono text-zinc-300">clicks</span> and the
                                    user is redirected with a 302.
                                </li>
                            </ul>
                        </div>

                        {/* Data model */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-4">
                            <p className="text-[11px] text-zinc-600">Data model</p>
                            <h3 className="mt-1 text-sm font-medium text-zinc-50">
                                URLs & events
                            </h3>
                            <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-500">
                                <li>
                                    <span className="font-mono text-zinc-300">urls</span>:
                                    <span> slug, target, expiration, label, cached clicks.</span>
                                </li>
                                <li>
                                    <span className="font-mono text-zinc-300">clicks</span>:
                                    <span> one row per redirect, with timestamp, referrer, device.</span>
                                </li>
                                <li>
                                    Optional trigger maintains{" "}
                                    <span className="font-mono text-zinc-300">clicks_count</span> for
                                    fast list views.
                                </li>
                            </ul>
                        </div>

                        {/* Analytics */}
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-4">
                            <p className="text-[11px] text-zinc-600">Analytics</p>
                            <h3 className="mt-1 text-sm font-medium text-zinc-50">
                                Aggregations on read
                            </h3>
                            <ul className="mt-2 space-y-1.5 text-[11px] text-zinc-500">
                                <li>Per‑URL API endpoint queries Supabase for click events.</li>
                                <li>
                                    TypeScript groups by day for 7‑ and 30‑day trends and tallies
                                    referrers and devices.
                                </li>
                                <li>
                                    Results render into lightweight metric cards instead of a chart
                                    library to keep the project lean.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
