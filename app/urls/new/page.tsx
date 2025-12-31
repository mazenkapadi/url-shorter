// app/urls/new/page.tsx
import Link from "next/link";
import { NewUrlForm } from "./new-url-form";

export default function NewUrlPage() {
    return (
        <div className="min-h-screen bg-[#050507] text-zinc-100">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:px-6 md:py-12">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-[11px] font-medium text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
                    >
                        ← Back to home
                    </Link>
                </div>

                <header className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                        Links · Create
                    </p>
                    <h1 className="text-2xl font-medium text-zinc-50 md:text-3xl">
                        New short URL
                    </h1>
                    <p className="max-w-md text-sm text-zinc-500">
                        Define a destination, optional custom slug, and expiration to start
                        tracking clicks.
                    </p>
                </header>

                <NewUrlForm />
            </div>
        </div>
    );
}