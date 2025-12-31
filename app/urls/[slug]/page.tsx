// app/urls/[slug]/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { daysAgoISO, startOfDayISO } from "@/lib/analytics";

type AnalyticsResponse = {
    url: {
        slug: string;
        targetUrl: string;
        totalClicks: number;
        createdAt: string;
        expiresAt: string | null;
    };
    analytics: {
        clicksLast7Days: number;
        clicksByDay: { day: string; count: number }[];
        topReferrers: { referrer: string; count: number }[];
        deviceBreakdown: { deviceType: string; count: number }[];
    };
};

async function getAnalytics(slug: string): Promise<AnalyticsResponse | null> {
    const supabase = await createSupabaseServerClient();

    const { data: url, error: urlError } = await supabase
        .from("urls")
        .select("id, clicks_count, created_at, target_url, slug, expires_at")
        .eq("slug", slug)
        .maybeSingle();

    if (urlError || !url) {
        return null;
    }

    const totalClicks = url.clicks_count as number;

    const sevenDaysAgo = daysAgoISO(7);

    const { count: clicksLast7DaysRaw, error: last7Error } = await supabase
        .from("clicks")
        .select("id", { count: "exact", head: true })
        .eq("url_id", url.id)
        .gte("created_at", sevenDaysAgo);

    const clicksLast7Days = last7Error ? 0 : (clicksLast7DaysRaw ?? 0);

    const { data: clicksByDayRaw, error: byDayError } = await supabase
        .from("clicks")
        .select("created_at")
        .eq("url_id", url.id)
        .gte("created_at", daysAgoISO(30))
        .order("created_at", { ascending: true });

    const dayMap = new Map<string, number>();
    for (const row of clicksByDayRaw ?? []) {
        const d = new Date(row.created_at as string);
        const dayKey = startOfDayISO(d).slice(0, 10); // YYYY-MM-DD
        dayMap.set(dayKey, (dayMap.get(dayKey) ?? 0) + 1);
    }

    const clicksByDay = Array.from(dayMap.entries())
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([day, count]) => ({ day, count }));

    const { data: refRowsRaw, error: refError } = await supabase
        .from("clicks")
        .select("referrer")
        .eq("url_id", url.id);

    const refRows = refError ? [] : (refRowsRaw ?? []);

    const refMap = new Map<string, number>();
    for (const row of refRows ?? []) {
        const key = (row.referrer as string | null) || "direct";
        refMap.set(key, (refMap.get(key) ?? 0) + 1);
    }

    const topReferrers = Array.from(refMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([referrer, count]) => ({ referrer, count }));

    const { data: deviceRowsRaw, error: deviceError } = await supabase
        .from("clicks")
        .select("device_type")
        .eq("url_id", url.id);

    const deviceRows = deviceError ? [] : (deviceRowsRaw ?? []);

    const deviceMap = new Map<string, number>();
    for (const row of deviceRows) {
        const key = (row.device_type as string | null) || "unknown";
        deviceMap.set(key, (deviceMap.get(key) ?? 0) + 1);
    }

    const deviceBreakdown = Array.from(deviceMap.entries()).map(
        ([deviceType, count]) => ({ deviceType, count })
    );

    return {
        url: {
            slug: url.slug,
            targetUrl: url.target_url,
            totalClicks,
            createdAt: url.created_at,
            expiresAt: url.expires_at,
        },
        analytics: {
            clicksLast7Days,
            clicksByDay,
            topReferrers,
            deviceBreakdown,
        },
    };
}

export default async function UrlAnalyticsPage({
                                                   params,
                                               }: {
    params: { slug: string };
}) {
    const data = await getAnalytics(params.slug);

    if (!data) {
        return (
            <div className="min-h-screen bg-[#050507] text-zinc-100">
                <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12 space-y-4">
                    <h1 className="text-2xl font-medium text-zinc-50">URL not found</h1>
                    <p className="text-sm text-zinc-500">
                        The link you are looking for does not exist or has been removed.
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                        <Link
                            href="/"
                            className="font-medium text-zinc-300 underline-offset-2 hover:underline"
                        >
                            ← Back to home
                        </Link>
                        <Link
                            href="/urls"
                            className="font-medium text-zinc-400 underline-offset-2 hover:underline"
                        >
                            Back to all links
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const {url, analytics} = data;
    const fullShort =
        (process.env.NEXT_PUBLIC_BASE_URL ?? "") + "/" + url.slug;

    return (
        <div className="min-h-screen bg-[#050507] text-zinc-100">
            <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-12 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                            Link · Analytics
                        </p>
                        <h1 className="text-2xl font-medium text-zinc-50">{url.slug}</h1>
                        <p className="max-w-xl text-xs text-zinc-500">{url.targetUrl}</p>
                        <p className="text-[11px] text-zinc-600">
                            Created{" "}
                            <span className="font-mono text-zinc-300">
                {new Date(url.createdAt).toLocaleString()}
              </span>
                            {url.expiresAt && (
                                <>
                                    {" · "}Expires{" "}
                                    <span className="font-mono text-zinc-300">
                    {new Date(url.expiresAt).toLocaleDateString()}
                  </span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 md:items-end">
                        <Link
                            href="/"
                            className="self-start md:self-end rounded-xl border border-zinc-800 bg-[#050507] px-3 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-zinc-900 transition-colors"
                        >
                            ← Back to home
                        </Link>
                        <Link
                            href="/urls"
                            className="self-start md:self-end text-[11px] font-medium text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
                        >
                            Back to all links
                        </Link>
                    </div>
                </div>

                {/* Metric row */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-3">
                        <p className="text-[11px] text-zinc-500">Total clicks</p>
                        <p className="mt-1 text-2xl font-semibold text-zinc-50">
                            {url.totalClicks}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-3">
                        <p className="text-[11px] text-zinc-500">Last 7 days</p>
                        <p className="mt-1 text-2xl font-semibold text-zinc-50">
                            {analytics.clicksLast7Days}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-4 py-3">
                        <p className="text-[11px] text-zinc-500">Short link</p>
                        <p className="mt-1 font-mono text-[11px] text-zinc-200">
                            {fullShort}
                        </p>
                    </div>
                </div>

                {/* Detail panels */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Clicks by day */}
                    <div className="rounded-2xl border border-zinc-900 bg-[#08080b] p-4">
                        <div className="mb-2">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                                Timeline
                            </p>
                            <h2 className="text-sm font-medium text-zinc-50">
                                Clicks by day (last 30d)
                            </h2>
                        </div>
                        <div className="mt-3 space-y-1 text-xs">
                            {analytics.clicksByDay.length === 0 ? (
                                <p className="text-xs text-zinc-500">No clicks yet.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {analytics.clicksByDay.map((row) => (
                                        <li
                                            key={row.day}
                                            className="flex items-center justify-between text-[11px]"
                                        >
                                            <span className="text-zinc-400">{row.day}</span>
                                            <span className="font-medium text-zinc-100">
                        {row.count}
                      </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Referrers + devices */}
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] p-4">
                            <div className="mb-2">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                                    Sources
                                </p>
                                <h2 className="text-sm font-medium text-zinc-50">
                                    Top referrers
                                </h2>
                            </div>
                            <div className="mt-3 text-xs">
                                {analytics.topReferrers.length === 0 ? (
                                    <p className="text-xs text-zinc-500">No referrer data yet.</p>
                                ) : (
                                    <ul className="space-y-1">
                                        {analytics.topReferrers.map((row) => (
                                            <li
                                                key={row.referrer}
                                                className="flex items-center justify-between text-[11px]"
                                            >
                                                <span className="text-zinc-300">{row.referrer}</span>
                                                <span className="font-medium text-zinc-100">
                          {row.count}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] p-4">
                            <div className="mb-2">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                                    Devices
                                </p>
                                <h2 className="text-sm font-medium text-zinc-50">
                                    Device breakdown
                                </h2>
                            </div>
                            <div className="mt-3 text-xs">
                                {analytics.deviceBreakdown.length === 0 ? (
                                    <p className="text-xs text-zinc-500">No device data yet.</p>
                                ) : (
                                    <ul className="space-y-1">
                                        {analytics.deviceBreakdown.map((row) => (
                                            <li
                                                key={row.deviceType}
                                                className="flex items-center justify-between text-[11px]"
                                            >
                                                <span className="text-zinc-300">{row.deviceType}</span>
                                                <span className="font-medium text-zinc-100">
                          {row.count}
                        </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="pt-1 text-[11px] text-zinc-600">
                    This view mirrors the GitHub Metrics Dashboard layout: headline metrics on
                    top, contextual breakdowns below, all within the same dark design system.
                </p>
            </div>
        </div>
    );
}