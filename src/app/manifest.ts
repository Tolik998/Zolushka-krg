import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest { return { name: "Zolushka.krg", short_name: "Zolushka", description: "Сайт салона красоты в Караганде", start_url: "/ru", display: "standalone", background_color: "#f6f0e7", theme_color: "#2b171d", icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png" }] }; }
