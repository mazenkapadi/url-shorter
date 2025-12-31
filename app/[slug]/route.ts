import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getDeviceType } from "@/lib/analytics";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;
    const supabase = await createSupabaseServerClient();

    const { data: url, error } = await supabase
        .from("urls")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error || !url) {
        return NextResponse.json(
            { error: "Short URL not found" },
            { status: 404 }
        );
    }

    if (url.expires_at && new Date(url.expires_at) < new Date()) {
        return NextResponse.json(
            { error: "This link has expired" },
            { status: 410 }
        );
    }

    const referrer = req.headers.get("referer");
    const userAgent = req.headers.get("user-agent");
    const deviceType = getDeviceType(userAgent);

    // Fire and forget logging. If it fails, redirect anyway.
    await (async () => {
        const {error: clickError} = await supabase
            .from("clicks")
            .insert({
                url_id: url.id,
                referrer,
                user_agent: userAgent,
                device_type: deviceType,
            });

        if (clickError) {
            console.error("Failed to log click event", clickError);
        }
    })();

    return NextResponse.redirect(url.target_url, 302);
}
