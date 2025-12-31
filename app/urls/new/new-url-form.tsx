"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

type CreatedUrl = {
    slug: string;
    targetUrl: string;
};

export function NewUrlForm() {
    const router = useRouter();
    const [targetUrl, setTargetUrl] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [createdUrl, setCreatedUrl] = useState<CreatedUrl | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");
        setCreatedUrl(null);

        try {
            const res = await fetch("/api/urls", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    targetUrl,
                    customSlug: customSlug || undefined,
                    expiresAt: expiresAt || undefined,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                setErrorMessage(json.error || "Something went wrong");
                return;
            }

            setCreatedUrl({
                slug: json.url.slug,
                targetUrl: json.url.targetUrl,
            });

            router.push(`/urls/${json.url.slug}`);
        } catch {
            setErrorMessage("Network error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_BASE_URL ?? "";

    return (
        <div className="rounded-2xl border border-zinc-900 bg-[#08080b] px-5 py-5 shadow-sm">
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Destination */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-zinc-500">1 · Destination</p>
                    <label
                        className="text-[11px] uppercase tracking-[0.2em] text-zinc-600"
                        htmlFor="targetUrl"
                    >
                        Target URL
                    </label>
                    <input
                        id="targetUrl"
                        type="url"
                        required
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="block w-full rounded-xl border border-zinc-900 bg-[#050507] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                        placeholder="https://example.com/very/long/link"
                    />
                    <p className="text-[11px] text-zinc-600">
                        This is the final destination your short URL will redirect to.
                    </p>
                </div>

                {/* Slug + expiration */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-zinc-500">
                            2 · Custom slug (optional)
                        </p>
                        <div className="flex items-center gap-2">
              <span
                  className="rounded-xl border border-zinc-900 bg-[#050507] px-2 py-1 text-[11px] text-zinc-500 font-mono">
                {baseUrl}/
              </span>
                            <input
                                id="customSlug"
                                type="text"
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                                className="block w-full rounded-xl border border-zinc-900 bg-[#050507] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                                placeholder="launch-campaign"
                            />
                        </div>
                        <p className="text-[11px] text-zinc-600">
                            Leave empty to auto-generate a short, unique slug.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium text-zinc-500">
                            3 · Expiration (optional)
                        </p>
                        <input
                            id="expiresAt"
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="block w-full rounded-xl border border-zinc-900 bg-[#050507] px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                        />
                        <p className="text-[11px] text-zinc-600">
                            After this date, the short URL will stop resolving.
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-xl border border-red-900/70 bg-red-950/60 px-3 py-2 text-xs text-red-200">
                        {errorMessage}
                    </div>
                )}

                {createdUrl && (
                    <div className="rounded-xl border border-zinc-900 bg-zinc-900/50 px-3 py-2 text-xs space-y-1">
                        <p className="text-zinc-300">Short link created</p>
                        <p className="font-mono text-[11px] text-zinc-100">
                            {baseUrl}/{createdUrl.slug}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex text-[11px] font-medium text-zinc-300 underline-offset-2 hover:underline"
                        >
                            ← Back to home
                        </Link>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-xs font-medium text-black hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? "Creating…" : "Create short URL"}
                </button>
            </form>
        </div>
    );
}