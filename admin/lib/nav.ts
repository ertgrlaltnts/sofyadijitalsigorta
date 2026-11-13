import {
  BookOpen,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Shapes,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  keywords: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, keywords: "ana sayfa özet istatistik" },
  { href: "/bilgi-tabani", label: "Bilgi Tabanı", icon: BookOpen, keywords: "sss doküman kayıt içerik" },
  { href: "/kategoriler", label: "Kategoriler", icon: Shapes, keywords: "kategori sıralama" },
  { href: "/test-alani", label: "Test Alanı", icon: FlaskConical, keywords: "playground sohbet dene" },
  { href: "/sohbetler", label: "Sohbetler", icon: MessagesSquare, keywords: "konuşma mesaj geçmiş" },
  { href: "/cevapsiz-sorular", label: "Cevapsız Sorular", icon: HelpCircle, keywords: "bilinmeyen eksik soru" },
  { href: "/ayarlar", label: "Ayarlar", icon: Settings, keywords: "asistan prompt model eşik" },
  { href: "/yoneticiler", label: "Yöneticiler", icon: Users, keywords: "admin kullanıcı şifre" },
];

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbsFor(pathname: string): Crumb[] {
  const root: Crumb = { label: "Sofya", href: "/" };
  if (pathname === "/") return [root, { label: "Dashboard" }];

  const section = NAV_ITEMS.find((item) => item.href !== "/" && pathname.startsWith(item.href));
  if (!section) return [root];

  const crumbs: Crumb[] = [root, { label: section.label, href: section.href }];
  const rest = pathname.slice(section.href.length).split("/").filter(Boolean);
  if (rest[0] === "yeni") crumbs.push({ label: "Yeni kayıt" });
  else if (rest.length > 0) crumbs.push({ label: section.href === "/sohbetler" ? "Sohbet detayı" : "Düzenle" });
  crumbs[crumbs.length - 1] = { label: crumbs[crumbs.length - 1].label };
  return crumbs;
}
