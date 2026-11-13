import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/content";
import { GUIDES } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  });

  return [
    page("", 1, "weekly"),
    page("/urunler", 0.8, "monthly"),
    ...PRODUCTS.map((product) => page(`/urunler/${product.slug}`, 0.8, "monthly")),
    page("/rehber", 0.6, "monthly"),
    ...GUIDES.map((guide) => page(`/rehber/${guide.slug}`, 0.6, "monthly")),
    page("/sofya", 0.6, "monthly"),
    page("/sss", 0.6, "monthly"),
    page("/kvkk", 0.3, "monthly"),
    page("/gizlilik-politikasi", 0.3, "monthly"),
    page("/cerez-politikasi", 0.3, "monthly"),
    page("/sigorta-bilgilendirme", 0.3, "monthly"),
    page("/cayma-iptal-iade", 0.3, "monthly"),
  ];
}
