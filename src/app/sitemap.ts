import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap { const paths = ["", "/services", "/express", "/booking", "/masters", "/portfolio", "/privacy"]; return ["ru", "kz"].flatMap((locale) => paths.map((path) => ({ url: `${siteUrl}/${locale}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.8 }))); }
