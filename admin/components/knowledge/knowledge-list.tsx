"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, BookOpen, FilePlus2, FileUp, MoreHorizontal, Pencil, RefreshCw, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import { SimpleSelect } from "@/components/simple-select";
import { ActiveBadge, IndexBadge, TypeBadge } from "@/components/status-badge";
import { TableSkeleton } from "@/components/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadDialog } from "@/components/knowledge/upload-dialog";
import { api } from "@/lib/api";
import { errorMessage } from "@/lib/form-errors";
import { formatDateTime, formatRelative } from "@/lib/format";
import { useCategories } from "@/lib/queries";
import type { KnowledgeListItem, Page, ReindexSummary } from "@/lib/types";
import { useDebounced } from "@/lib/use-debounced";
import { cn } from "@/lib/utils";

type SortField = "updatedAt" | "title";
type BulkAction = "delete" | "activate" | "deactivate";

const ALL = "all";
const PAGE_SIZE = 15;

const TYPE_OPTIONS = [
  { value: ALL, label: "Tüm tipler" },
  { value: "faq", label: "SSS" },
  { value: "article", label: "Doküman" },
];
const STATUS_OPTIONS = [
  { value: ALL, label: "Tüm durumlar" },
  { value: "true", label: "Aktif" },
  { value: "false", label: "Pasif" },
];
const INDEX_OPTIONS = [
  { value: ALL, label: "Tüm indeksler" },
  { value: "indexed", label: "İndekslendi" },
  { value: "pending", label: "Bekliyor" },
  { value: "failed", label: "Başarısız" },
];

export function KnowledgeList() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [indexStatus, setIndexStatus] = useState(ALL);
  const [sort, setSort] = useState<SortField>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [deleteTarget, setDeleteTarget] = useState<KnowledgeListItem | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);
  const [reindexAllOpen, setReindexAllOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const debouncedSearch = useDebounced(search.trim());
  const filters = {
    search: debouncedSearch || undefined,
    categoryId: categoryId === ALL ? undefined : categoryId,
    type: type === ALL ? undefined : type,
    isActive: status === ALL ? undefined : status,
    indexStatus: indexStatus === ALL ? undefined : indexStatus,
    sort,
    order,
    page,
    limit: PAGE_SIZE,
  };

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["knowledge", filters],
    queryFn: () => api<Page<KnowledgeListItem>>("admin/knowledge", { query: filters }),
    placeholderData: keepPreviousData,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["knowledge"] });
  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
    setSelected(new Set());
  };

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api<KnowledgeListItem>(`admin/knowledge/${id}/active`, { method: "PATCH", body: { isActive } }),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["knowledge"] });
      const snapshots = queryClient.getQueriesData<Page<KnowledgeListItem>>({ queryKey: ["knowledge"] });
      queryClient.setQueriesData<Page<KnowledgeListItem>>({ queryKey: ["knowledge"] }, (current) =>
        current && { ...current, items: current.items.map((item) => (item.id === id ? { ...item, isActive } : item)) },
      );
      return { snapshots };
    },
    onError: (err, _vars, context) => {
      context?.snapshots.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(errorMessage(err));
    },
    onSettled: refresh,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api<void>(`admin/knowledge/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Kayıt silindi.");
      setDeleteTarget(null);
      return refresh();
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const reindexOne = useMutation({
    mutationFn: (id: string) => api<KnowledgeListItem>(`admin/knowledge/${id}/reindex`, { method: "POST" }),
    onSuccess: (entry) => {
      if (entry.indexStatus === "indexed") toast.success("Kayıt yeniden indekslendi.");
      else toast.error(entry.indexError ?? "İndeksleme başarısız oldu.");
      return refresh();
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const reindexAll = useMutation({
    mutationFn: () => api<ReindexSummary>("admin/knowledge/reindex-all", { method: "POST" }),
    onSuccess: (summary) => {
      setReindexAllOpen(false);
      if (summary.failed === 0) toast.success(`${summary.indexed} kayıt yeniden indekslendi.`);
      else toast.warning(`${summary.indexed} kayıt indekslendi, ${summary.failed} kayıt başarısız oldu.`);
      return refresh();
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const bulk = useMutation({
    mutationFn: (action: BulkAction) =>
      api<{ affected: number }>("admin/knowledge/bulk", { method: "POST", body: { ids: [...selected], action } }),
    onSuccess: ({ affected }, action) => {
      toast.success(`${affected} kayıt ${action === "delete" ? "silindi" : action === "activate" ? "aktifleştirildi" : "pasife alındı"}.`);
      setSelected(new Set());
      setBulkDelete(false);
      return refresh();
    },
    onError: (err) => toast.error(errorMessage(err)),
  });

  const items = data?.items ?? [];
  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const someSelected = selected.size > 0 && !allSelected;
  const hasFilters = !!debouncedSearch || categoryId !== ALL || type !== ALL || status !== ALL || indexStatus !== ALL;

  const toggleSort = (field: SortField) => {
    if (sort === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(field);
      setOrder(field === "title" ? "asc" : "desc");
    }
    setPage(1);
  };
  const sortIcon = (field: SortField) =>
    sort === field ? order === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" /> : null;

  const toggleRow = (id: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <>
      <PageHeader
        title="Bilgi Tabanı"
        description="Asistanın yanıtlarında kullandığı SSS ve doküman kayıtlarını yönetin."
        actions={
          <>
            <Button variant="outline" onClick={() => setReindexAllOpen(true)}>
              <RefreshCw /> Tümünü yeniden indeksle
            </Button>
            <Button variant="outline" onClick={() => setUploadOpen(true)}>
              <FileUp /> Dosya yükle
            </Button>
            <Link href="/bilgi-tabani/yeni" className={buttonVariants()}>
              <FilePlus2 /> Yeni kayıt
            </Link>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
            placeholder="Başlık, içerik veya etiket ara…"
            className="h-9 pl-8"
          />
        </div>
        <SimpleSelect
          className="h-9 w-44"
          value={categoryId}
          onValueChange={resetPage(setCategoryId)}
          options={[{ value: ALL, label: "Tüm kategoriler" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <SimpleSelect className="h-9 w-36" value={type} onValueChange={resetPage(setType)} options={TYPE_OPTIONS} />
        <SimpleSelect className="h-9 w-36" value={status} onValueChange={resetPage(setStatus)} options={STATUS_OPTIONS} />
        <SimpleSelect className="h-9 w-40" value={indexStatus} onValueChange={resetPage(setIndexStatus)} options={INDEX_OPTIONS} />
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-secondary/60 px-3 py-2 text-sm">
          <span className="font-medium tabular">{selected.size} kayıt seçili</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" disabled={bulk.isPending} onClick={() => bulk.mutate("activate")}>
              Aktifleştir
            </Button>
            <Button size="sm" variant="outline" disabled={bulk.isPending} onClick={() => bulk.mutate("deactivate")}>
              Pasife al
            </Button>
            <Button size="sm" variant="destructive" disabled={bulk.isPending} onClick={() => setBulkDelete(true)}>
              <Trash2 /> Sil
            </Button>
          </div>
        </div>
      )}

      {isError ? (
        <EmptyState
          icon={BookOpen}
          title="Kayıtlar yüklenemedi"
          description={errorMessage(error)}
          action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
        />
      ) : !isPending && items.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={hasFilters ? "Eşleşen kayıt yok" : "Henüz bilgi kaydı yok"}
          description={
            hasFilters ? "Filtreleri değiştirerek tekrar deneyin." : "Asistanın yanıt verebilmesi için ilk SSS veya dokümanı ekleyin."
          }
          action={
            !hasFilters && (
              <Link href="/bilgi-tabani/yeni" className={buttonVariants()}>
                <FilePlus2 /> İlk kaydı ekle
              </Link>
            )
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => setSelected(checked ? new Set(items.map((i) => i.id)) : new Set())}
                    aria-label="Tümünü seç"
                  />
                </TableHead>
                <TableHead>
                  <button className="inline-flex items-center gap-1 font-medium" onClick={() => toggleSort("title")}>
                    Başlık {sortIcon("title")}
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Tip</TableHead>
                <TableHead className="hidden lg:table-cell">Kategori</TableHead>
                <TableHead className="hidden xl:table-cell">Etiketler</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>İndeks</TableHead>
                <TableHead className="hidden lg:table-cell">
                  <button className="inline-flex items-center gap-1 font-medium" onClick={() => toggleSort("updatedAt")}>
                    Son güncelleme {sortIcon("updatedAt")}
                  </button>
                </TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            {isPending ? (
              <TableSkeleton columns={9} />
            ) : (
              <TableBody className={cn(!isPending && data === undefined && "opacity-60")}>
                {items.map((item) => (
                  <TableRow key={item.id} data-state={selected.has(item.id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(item.id)}
                        onCheckedChange={(checked) => toggleRow(item.id, checked)}
                        aria-label={`${item.title} seç`}
                      />
                    </TableCell>
                    <TableCell className="max-w-[320px]">
                      <Link href={`/bilgi-tabani/${item.id}`} className="block truncate font-medium hover:text-primary hover:underline">
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <TypeBadge type={item.type} />
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">{item.category?.name ?? "—"}</TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex max-w-[200px] flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="font-normal">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && <span className="text-xs text-muted-foreground">+{item.tags.length - 3}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          checked={item.isActive}
                          onCheckedChange={(isActive) => toggleActive.mutate({ id: item.id, isActive })}
                          aria-label={item.isActive ? "Pasife al" : "Aktifleştir"}
                        />
                        <ActiveBadge active={item.isActive} />
                      </div>
                    </TableCell>
                    <TableCell title={item.indexError ?? undefined}>
                      <IndexBadge status={item.indexStatus} />
                    </TableCell>
                    <TableCell className="tabular hidden text-muted-foreground lg:table-cell" title={formatDateTime(item.updatedAt)}>
                      {formatRelative(item.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="İşlemler" />}>
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={<Link href={`/bilgi-tabani/${item.id}`} />}>
                            <Pencil /> Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => reindexOne.mutate(item.id)}>
                            <RefreshCw /> Yeniden indeksle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(item)}>
                            <Trash2 /> Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      {data && data.total > 0 && <Pagination page={data.page} limit={data.limit} total={data.total} onPageChange={(p) => setPage(p)} />}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Kaydı sil"
        description={`"${deleteTarget?.title}" kaydı ve indeks verileri kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Sil"
        destructive
        loading={remove.isPending}
        onConfirm={() => deleteTarget && remove.mutate(deleteTarget.id)}
      />
      <ConfirmDialog
        open={bulkDelete}
        onOpenChange={setBulkDelete}
        title="Seçili kayıtları sil"
        description={`${selected.size} kayıt kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel="Sil"
        destructive
        loading={bulk.isPending}
        onConfirm={() => bulk.mutate("delete")}
      />
      <ConfirmDialog
        open={reindexAllOpen}
        onOpenChange={setReindexAllOpen}
        title="Tümünü yeniden indeksle"
        description="Tüm kayıtların embedding'leri yeniden üretilir. Kayıt sayısına bağlı olarak biraz sürebilir ve OpenAI kullanımı oluşturur."
        confirmLabel="Yeniden indeksle"
        loading={reindexAll.isPending}
        onConfirm={() => reindexAll.mutate()}
      />
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  );
}
