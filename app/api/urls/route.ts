import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PostBody = {
    targetUrl?: string;
    customSlug?: string;
    expiresAt?: string | null;
};

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return !!url.protocol && !!url.host;
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const body = (await req.json()) as PostBody;

    const targetUrl = body.targetUrl?.trim();
    const customSlug = body.customSlug?.trim() || "";

    let expiresAt: Date | null = null;
    if (body.expiresAt) {
        const parsed = new Date(body.expiresAt);
        if (Number.isNaN(parsed.getTime())) {
            return NextResponse.json(
                { error: "Please enter a valid expiration date" },
                { status: 400 }
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsed < today) {
            return NextResponse.json(
                { error: "Expiration date cannot be in the past" },
                { status: 400 }
            );
        }

        expiresAt = parsed;
    }

    if (!targetUrl || !isValidUrl(targetUrl)) {
        return NextResponse.json(
            { error: "Please enter a valid URL" },
            { status: 400 }
        );
    }

    const slug =
        customSlug !== ""
            ? customSlug
            : nanoid(7); // ~3.5B combinations, fine for this project[web:19]

    // If custom slug, make sure it is not taken
    if (customSlug) {
        const { data: existing, error: existingError } = await supabase
            .from("urls")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

        if (existingError) {
            return NextResponse.json(
                { error: "Error checking slug availability" },
                { status: 500 }
            );
        }

        if (existing) {
            return NextResponse.json(
                { error: "Slug is already in use" },
                { status: 409 }
            );
        }
    }

    const insertPayload: {
        slug: string;
        target_url: string;
        expires_at?: string | null;
    } = {
        slug,
        target_url: targetUrl,
    };

    if (expiresAt) {
        insertPayload.expires_at = expiresAt.toISOString();
    }

    const { data, error } = await supabase
        .from("urls")
        .insert(insertPayload)
        .select("*")
        .single(); // select() after insert returns new row[web:35][web:38]

    if (error) {
        return NextResponse.json(
            { error: "Failed to create short URL" },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            url: {
                id: data.id,
                slug: data.slug,
                targetUrl: data.target_url,
                clicksCount: data.clicks_count,
                createdAt: data.created_at,
                expiresAt: data.expires_at,
            },
        },
        { status: 201 }
    );
}
