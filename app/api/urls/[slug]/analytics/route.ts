import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { daysAgoISO, startOfDayISO } from "@/lib/analytics";

type ClicksByDayRow = {
    day: string;
    count: number;
};

export async function GET(
    _req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const supabase = await createSupabaseServerClient();
    const { slug } = params;

    const { data: url, error: urlError } = await supabase
        .from("urls")
        .select("id, clicks_count, created_at, target_url, slug, expires_at")
        .eq("slug", slug)
        .maybeSingle();

    if (urlError || !url) {
        return NextResponse.json(
            { error: "URL not found" },
            { status: 404 }
        );
    }

    // total clicks is already cached
    const totalClicks = url.clicks_count as number;

    const sevenDaysAgo = daysAgoISO(7);

    const { count: clicksLast7Days, error: last7Error } = await supabase
        .from("clicks")
        .select("id", { count: "exact", head: true })
        .eq("url_id", url.id)
        .gte("created_at", sevenDaysAgo);

    if (last7Error) {
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }

    // group by day
    const { data: clicksByDayRaw, error: byDayError } = await supabase
        .from("clicks")
        .select("created_at")
        .eq("url_id", url.id)
        .gte("created_at", daysAgoISO(30))
        .order("created_at", { ascending: true });

    if (byDayError) {
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }

    const dayMap = new Map<string, number>();
    for (const row of clicksByDayRaw ?? []) {
        const d = new Date(row.created_at as string);
        const dayKey = startOfDayISO(d).slice(0, 10); // YYYY-MM-DD
        dayMap.set(dayKey, (dayMap.get(dayKey) ?? 0) + 1);
    }

    const clicksByDay: ClicksByDayRow[] = Array.from(dayMap.entries())
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([day, count]) => ({ day, count }));

    // top referrers
    const { data: refRows, error: refError } = await supabase
        .from("clicks")
        .select("referrer")
        .eq("url_id", url.id);

    if (refError) {
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }

    const refMap = new Map<string, number>();
    for (const row of refRows ?? []) {
        const key = (row.referrer as string | null) || "direct";
        refMap.set(key, (refMap.get(key) ?? 0) + 1);
    }

    const topReferrers = Array.from(refMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([referrer, count]) => ({ referrer, count }));

    // device breakdown
    const { data: deviceRows, error: deviceError } = await supabase
        .from("clicks")
        .select("device_type")
        .eq("url_id", url.id);

    if (deviceError) {
        return NextResponse.json(
            { error: "Failed to load analytics" },
            { status: 500 }
        );
    }

    const deviceMap = new Map<string, number>();
    for (const row of deviceRows ?? []) {
        const key = (row.device_type as string | null) || "unknown";
        deviceMap.set(key, (deviceMap.get(key) ?? 0) + 1);
    }

    const deviceBreakdown = Array.from(deviceMap.entries()).map(
        ([deviceType, count]) => ({ deviceType, count })
    );

    return NextResponse.json({
        url: {
            slug: url.slug,
            targetUrl: url.target_url,
            totalClicks,
            createdAt: url.created_at,
            expiresAt: url.expires_at,
        },
        analytics: {
            clicksLast7Days: clicksLast7Days ?? 0,
            clicksByDay,
            topReferrers,
            deviceBreakdown,
        },
    });
}
