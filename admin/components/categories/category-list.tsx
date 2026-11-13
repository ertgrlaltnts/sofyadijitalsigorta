"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Shapes, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { applyApiError, errorMessage } from "@/lib/form-errors";
import type { Category } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2, "En az 2 karakter olmalı.").max(60, "En fazla 60 karakter olabilir."),
});
type FormValues = z.infer<typeof schema>;

function CategoryDialog({ category, open, onOpenChange }: { category: Category | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), values: { name: category?.name ?? "" } });

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      category
        ? api<Category>(`admin/categories/${category.id}`, { method: "PATCH", body: values })
        : api<Category>("admin/categories", { method: "POST", body: values }),
    onSuccess: () => {
      toast.success(category ? "Kategori güncellendi." : "Kategori eklendi.");
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      onOpenChange(false);
      reset({ name: "" });
    },
    onError: (error) => applyApiError(error, setError),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit((values) => save.mutate(values))} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>{category ? "Kategoriyi düzenle" : "Yeni kategori"}</DialogTitle>
            <DialogDescription>Kategoriler bilgi kayıtlarını gruplamak için kullanılır.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="category-name">Kategori adı</Label>
            <Input id="category-name" autoFocus aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />}
              Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryList() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ["categories"], queryFn: () => api<Category[]>("admin/categories") });
  const [dialog, setDialog] = useState<{ open: boolean; category: Category | null }>({ open: false, category: null });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => api<void>(`admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Kategori silindi.");
      setDeleteTarget(null);
      return queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (err) => {
      setDeleteTarget(null);
      toast.error(errorMessage(err));
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ from, to }: { from: number; to: number }) => {
      const next = [...(data ?? [])];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      await Promise.all(
        next.map((category, index) =>
          category.order === index ? null : api(`admin/categories/${category.id}`, { method: "PATCH", body: { order: index } }),
        ),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err) => toast.error(errorMessage(err)),
  });

  const categories = data ?? [];

  return (
    <>
      <PageHeader
        title="Kategoriler"
        description="Bilgi kayıtlarını gruplamak için kategorileri düzenleyin. Sıra, filtre ve form listelerinde kullanılır."
        actions={
          <Button onClick={() => setDialog({ open: true, category: null })}>
            <Plus /> Yeni kategori
          </Button>
        }
      />

      {isError ? (
        <EmptyState icon={Shapes} title="Kategoriler yüklenemedi" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Tekrar dene</Button>} />
      ) : !isPending && categories.length === 0 ? (
        <EmptyState
          icon={Shapes}
          title="Henüz kategori yok"
          description="Bilgi kayıtlarını düzenlemek için ilk kategoriyi ekleyin."
          action={<Button onClick={() => setDialog({ open: true, category: null })}>Kategori ekle</Button>}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-24">Sıra</TableHead>
                <TableHead>Ad</TableHead>
                <TableHead className="hidden sm:table-cell">Kısa ad (slug)</TableHead>
                <TableHead className="text-right">Kayıt sayısı</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            {isPending ? (
              <TableSkeleton columns={5} />
            ) : (
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon-xs" disabled={index === 0 || reorder.isPending} onClick={() => reorder.mutate({ from: index, to: index - 1 })} aria-label="Yukarı taşı">
                          <ArrowUp />
                        </Button>
                        <Button variant="ghost" size="icon-xs" disabled={index === categories.length - 1 || reorder.isPending} onClick={() => reorder.mutate({ from: index, to: index + 1 })} aria-label="Aşağı taşı">
                          <ArrowDown />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">{category.slug}</TableCell>
                    <TableCell className="tabular text-right">{category.entryCount}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setDialog({ open: true, category })} aria-label="Düzenle">
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(category)} aria-label="Sil">
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      <CategoryDialog category={dialog.category} open={dialog.open} onOpenChange={(open) => setDialog((current) => ({ ...current, open }))} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Kategoriyi sil"
        description={
          deleteTarget && deleteTarget.entryCount > 0
            ? `"${deleteTarget.name}" kategorisinde ${deleteTarget.entryCount} kayıt var. Önce kayıtları başka kategoriye taşımanız gerekir.`
            : `"${deleteTarget?.name}" kategorisi silinecek.`
        }
        confirmLabel="Sil"
        destructive
        loading={remove.isPending}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
    </>
  );
}
