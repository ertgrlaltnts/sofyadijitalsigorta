import type { Metadata } from "next";
import { CategoryList } from "@/components/categories/category-list";

export const metadata: Metadata = { title: "Kategoriler" };

export default function CategoriesPage() {
  return <CategoryList />;
}
