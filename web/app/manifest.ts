import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Sofya",
    description: "Yapay zeka sigorta danışmanınız Sofya.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1322",
    theme_color: "#0b1322",
    lang: "tr",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
