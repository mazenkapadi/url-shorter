// app/urls/[slug]/page.tsx
import { UrlAnalyticsClient } from "./analytics-client";

export default function UrlAnalyticsPage({
  params,
}: {
  params: { slug: string };
}) {
  return <UrlAnalyticsClient slug={params.slug} />;
}
