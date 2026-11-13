import type { Metadata } from "next";
import { AdminList } from "@/components/admins/admin-list";

export const metadata: Metadata = { title: "Yöneticiler" };

export default function AdminsPage() {
  return <AdminList />;
}
