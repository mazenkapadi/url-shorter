export function getDeviceType(userAgent: string | null): string {
    if (!userAgent) return "unknown";
    const ua = userAgent.toLowerCase();

    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
        return "mobile";
    }
    if (ua.includes("ipad") || ua.includes("tablet")) {
        return "tablet";
    }
    return "desktop";
}

export function startOfDayISO(d: Date): string {
    const copy = new Date(d);
    copy.setUTCHours(0, 0, 0, 0);
    return copy.toISOString();
}

export function daysAgoISO(days: number): string {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
}
