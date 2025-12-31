// app/urls/page.tsx
import Link from "next/link";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getUrls() {
    const supabase = await createSupabaseServerClient();
    const {data, error} = await supabase
        .from("urls")
        .select("id, slug, target_url, clicks_count, created_at, expires_at")
        .order("created_at", {ascending: false});

    if (error) {
        console.error(error);
        return [];
    }

    return data ?? [];
}

export default async function UrlsPage() {
    const urls = await getUrls();

    return (
        <div className="min-h-screen bg-[#050507] text-zinc-100">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:px-6 md:py-12">
                {/* Header + nav */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                            Links · Overview
                        </p>
                        <h1 className="text-2xl font-medium text-zinc-50 md:text-3xl">
                            URL Shortener
                        </h1>
                        <p className="text-sm text-zinc-500">
                            View all your short links, their targets, and high-level performance.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <Link
                            href="/"
                            className="text-[11px] font-medium text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
                        >
                            ← Back to home
                        </Link>
                        <Link
                            href="/urls/new"
                            className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-xs font-medium text-black hover:bg-zinc-200 transition-colors"
                        >
                            New link
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-zinc-900 bg-[#08080b] text-zinc-100 shadow-sm">
                    <div className="border-b border-zinc-900 px-5 py-3 flex items-center justify-between">
                        <h2 className="text-sm font-medium text-zinc-50">Your links</h2>
                        <span className="text-[11px] text-zinc-600">
              {urls.length} {urls.length === 1 ? "link" : "links"}
            </span>
                    </div>
                    <div className="px-5 py-4">
                        {urls.length === 0 ? (
                            <p className="text-sm text-zinc-500">
                                No links yet. Create your first short URL from the home page or the
                                button above.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs">
                                    <thead
                                        className="border-b border-zinc-900 text-[11px] uppercase tracking-[0.12em] text-zinc-600">
                                    <tr>
                                        <th className="py-2 pr-4 text-left font-medium">Short</th>
                                        <th className="py-2 pr-4 text-left font-medium">Target</th>
                                        <th className="py-2 pr-4 text-left font-medium">Clicks</th>
                                        <th className="py-2 pr-4 text-left font-medium">Created</th>
                                        <th className="py-2 pr-4 text-left font-medium">Expires</th>
                                        <th className="py-2 pr-0 text-right font-medium">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {urls.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="border-b border-zinc-900 last:border-0 hover:bg-[#0b0b10]"
                                        >
                                            <td className="py-2 pr-4 align-top">
                          <span className="font-mono text-[11px] text-zinc-200">
                            {process.env.NEXT_PUBLIC_BASE_URL ?? ""}/{u.slug}
                          </span>
                                            </td>
                                            <td className="py-2 pr-4 align-top max-w-xs">
                          <span className="block truncate text-[11px] text-zinc-500">
                            {u.target_url}
                          </span>
                                            </td>
                                            <td className="py-2 pr-4 align-top text-[11px] text-zinc-100">
                                                {u.clicks_count}
                                            </td>
                                            <td className="py-2 pr-4 align-top text-[11px] text-zinc-500">
                                                {new Date(u.created_at).toLocaleString()}
                                            </td>
                                            <td className="py-2 pr-4 align-top text-[11px] text-zinc-500">
                                                {u.expires_at
                                                    ? new Date(u.expires_at).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="py-2 pr-0 align-top text-right">
                                                <Link
                                                    href={`/urls/${u.slug}`}
                                                    className="text-[11px] font-medium text-zinc-300 underline-offset-2 hover:underline"
                                                >
                                                    View analytics
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
