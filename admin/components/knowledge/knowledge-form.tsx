"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Markdown } from "@/components/markdown";
import { PageHeader } from "@/components/page-header";
import { SimpleSelect } from "@/components/simple-select";
import { IndexBadge } from "@/components/status-badge";
import { TagInput } from "@/components/tag-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { applyApiError, errorMessage } from "@/lib/form-errors";
import { formatDateTime } from "@/lib/format";
import { useCategories } from "@/lib/queries";
import type { KnowledgeDetail } from "@/lib/types";

const schema = z.object({
  title: z.string().trim().min(3, "En az 3 karakter olmalı.").max(200, "En fazla 200 karakter olabilir."),
  type: z.enum(["faq", "article"]),
  categoryId: z.string().min(1, "Kategori seçin."),
  tags: z.array(z.string()).max(20, "En fazla 20 etiket eklenebilir."),
  content: z.string().trim().min(1, "İçerik boş olamaz.").max(100_000, "İçerik çok uzun."),
  isActive: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const TYPE_OPTIONS = [
  { value: "faq", label: "SSS (soru – cevap)" },
  { value: "article", label: "Doküman (uzun metin)" },
];

interface KnowledgeFormProps {
  entry?: KnowledgeDetail;
  prefillTitle?: string;
  unansweredId?: string;
}

function KnowledgeForm({ entry, prefillTitle, unansweredId }: KnowledgeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: entry?.title ?? prefillTitle ?? "",
      type: entry?.type ?? "faq",
      categoryId: entry?.category?.id ?? "",
      tags: entry?.tags ?? [],
      content: entry?.content ?? "",
      isActive: entry?.isActive ?? true,
    },
  });

  const type = useWatch({ control, name: "type" });
  const content = useWatch({ control, name: "content" });
  const isFaq = type === "faq";

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      entry
        ? api<KnowledgeDetail>(`admin/knowledge/${entry.id}`, { method: "PATCH", body: values })
        : api<KnowledgeDetail>("admin/knowledge", { method: "POST", body: values }),
    onSuccess: async (saved) => {
      if (unansweredId && !entry) {
        await api(`admin/unanswered/${unansweredId}`, { method: "PATCH", body: { status: "resolved", resolvedEntryId: saved.id } }).catch(
          () => toast.warning("Kayıt eklendi ancak soru çözüldü olarak işaretlenemedi."),
        );
        void queryClient.invalidateQueries({ queryKey: ["unanswered"] });
      }
      void queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      if (saved.indexStatus === "failed") toast.warning(`Kayıt kaydedildi ancak indekslenemedi: ${saved.indexError ?? "bilinmeyen hata"}`);
      else toast.success(entry ? "Kayıt güncellendi ve yeniden indekslendi." : "Kayıt eklendi ve indekslendi.");
      if (entry) queryClient.setQueryData(["knowledge", entry.id], saved);
      else router.replace(`/bilgi-tabani/${saved.id}`);
    },
    onError: (error) => applyApiError(error, setError),
  });

  const remove = useMutation({
    mutationFn: () => api<void>(`admin/knowledge/${entry?.id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Kayıt silindi.");
      void queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      router.replace("/bilgi-tabani");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const reindex = useMutation({
    mutationFn: () => api<KnowledgeDetail>(`admin/knowledge/${entry?.id}/reindex`, { method: "POST" }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["knowledge", updated.id], updated);
      void queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      if (updated.indexStatus === "indexed") toast.success("Kayıt yeniden indekslendi.");
      else toast.error(updated.indexError ?? "İndeksleme başarısız oldu.");
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <form onSubmit={handleSubmit((values) => save.mutate(values))} noValidate>
      <PageHeader
        title={entry ? "Kaydı düzenle" : "Yeni kayıt"}
        description={entry ? `Son güncelleme: ${formatDateTime(entry.updatedAt)}` : "Kaydedildiğinde içerik otomatik olarak indekslenir."}
        actions={
          <>
            {entry && (
              <Button type="button" variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 /> Sil
              </Button>
            )}
            <Link href="/bilgi-tabani" className={buttonVariants({ variant: "outline" })}>
              Vazgeç
            </Link>
            <Button type="submit" disabled={save.isPending || (!!entry && !isDirty)}>
              {save.isPending && <Loader2 className="animate-spin" />}
              {save.isPending ? "İndeksleniyor…" : "Kaydet"}
            </Button>
          </>
        }
      />

      {unansweredId && !entry && (
        <p className="mb-4 rounded-lg border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
          Bu kayıt, cevapsız sorular listesinden oluşturuluyor. Kaydettiğinizde soru <strong className="text-foreground">çözüldü</strong> olarak
          işaretlenecek.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">{isFaq ? "Soru" : "Başlık"}</Label>
              <Input
                id="title"
                aria-invalid={!!errors.title}
                placeholder={isFaq ? "Örn. Kasko nedir?" : "Örn. Konut sigortası rehberi"}
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{isFaq ? "Cevap" : "İçerik"} (Markdown)</Label>
              <Tabs defaultValue="write">
                <TabsList>
                  <TabsTrigger value="write">Yaz</TabsTrigger>
                  <TabsTrigger value="preview">Önizleme</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    aria-invalid={!!errors.content}
                    rows={16}
                    className="min-h-80 font-mono text-[13px] leading-relaxed"
                    placeholder={isFaq ? "Sorunun cevabını yazın…" : "Doküman metnini yazın. Paragraflar boş satırla ayrılır."}
                    {...register("content")}
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <div className="min-h-80 rounded-lg border bg-background p-4">
                    {content.trim() ? <Markdown>{content}</Markdown> : <p className="text-sm text-muted-foreground">Önizlenecek içerik yok.</p>}
                  </div>
                </TabsContent>
              </Tabs>
              {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="type">Tip</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => <SimpleSelect id="type" value={field.value} onValueChange={field.onChange} options={TYPE_OPTIONS} />}
                />
                <p className="text-xs text-muted-foreground">
                  {isFaq ? "Soru ve cevap tek parça olarak indekslenir." : "Metin ~1500 karakterlik parçalara bölünerek indekslenir."}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <SimpleSelect
                      id="categoryId"
                      value={field.value}
                      onValueChange={field.onChange}
                      invalid={!!errors.categoryId}
                      placeholder="Kategori seçin"
                      options={categories.map((c) => ({ value: c.id, label: c.name }))}
                    />
                  )}
                />
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Etiketler</Label>
                <Controller control={control} name="tags" render={({ field }) => <TagInput id="tags" value={field.value} onChange={field.onChange} />} />
                {errors.tags && <p className="text-xs text-destructive">{errors.tags.message}</p>}
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <Label htmlFor="isActive">Aktif</Label>
                  <p className="text-xs text-muted-foreground">Pasif kayıtlar yanıtlarda kullanılmaz.</p>
                </div>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => <Switch id="isActive" checked={field.value} onCheckedChange={field.onChange} />}
                />
              </div>
            </CardContent>
          </Card>

          {entry && (
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">İndeks durumu</span>
                  <IndexBadge status={entry.indexStatus} />
                </div>
                {entry.indexStatus === "failed" && (
                  <p className="flex gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                    {entry.indexError ?? "İndeksleme başarısız oldu."}
                  </p>
                )}
                <Button type="button" variant="outline" className="w-full" disabled={reindex.isPending} onClick={() => reindex.mutate()}>
                  {reindex.isPending ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                  Yeniden indeksle
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Kaydı sil"
        description="Bu kayıt ve indeks verileri kalıcı olarak silinecek. Bu işlem geri alınamaz."
        confirmLabel="Sil"
        destructive
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </form>
  );
}

export function NewKnowledgeForm(props: { prefillTitle?: string; unansweredId?: string }) {
  return <KnowledgeForm {...props} />;
}

export function EditKnowledgeForm({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["knowledge", id],
    queryFn: () => api<KnowledgeDetail>(`admin/knowledge/${id}`),
    refetchInterval: (query) => (query.state.data?.indexStatus === "pending" ? 2000 : false),
  });

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-medium">Kayıt yüklenemedi</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage(error)}</p>
        <Link href="/bilgi-tabani" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
          Listeye dön
        </Link>
      </div>
    );
  }
  return <KnowledgeForm key={data.updatedAt} entry={data} />;
}
