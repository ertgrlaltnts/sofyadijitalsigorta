"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SimpleSelect } from "@/components/simple-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { applyApiError } from "@/lib/form-errors";
import { useCategories } from "@/lib/queries";
import type { KnowledgeDetail } from "@/lib/types";

const MAX_BYTES = 5 * 1024 * 1024;

export function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  const [file, setFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: () => {
      const form = new FormData();
      form.append("file", file as File);
      form.append("categoryId", categoryId);
      return api<KnowledgeDetail>("admin/knowledge/upload", { method: "POST", body: form });
    },
    onSuccess: (entry) => {
      void queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      toast.success("Dosya içeriği doküman olarak eklendi.");
      onOpenChange(false);
      setFile(null);
      router.push(`/bilgi-tabani/${entry.id}`);
    },
    onError: (error) => applyApiError(error),
  });

  const choose = (selected: File | undefined) => {
    setFileError(null);
    if (!selected) return setFile(null);
    if (selected.size > MAX_BYTES) {
      setFile(null);
      return setFileError("Dosya en fazla 5 MB olabilir.");
    }
    setFile(selected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dosyadan doküman ekle</DialogTitle>
          <DialogDescription>.txt, .md veya .pdf dosyasındaki metin bir doküman kaydına dönüştürülür.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="upload-file">Dosya</Label>
            <label
              htmlFor="upload-file"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/50"
            >
              <FileUp className="size-5 text-primary" />
              <span>{file ? file.name : "Dosya seçmek için tıklayın"}</span>
            </label>
            <input id="upload-file" type="file" accept=".txt,.md,.pdf" className="sr-only" onChange={(e) => choose(e.target.files?.[0])} />
            {fileError && <p className="text-xs text-destructive">{fileError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-category">Kategori</Label>
            <SimpleSelect
              id="upload-category"
              value={categoryId}
              onValueChange={setCategoryId}
              placeholder="Kategori seçin"
              options={categories.map((category) => ({ value: category.id, label: category.name }))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button disabled={!file || !categoryId || upload.isPending} onClick={() => upload.mutate()}>
            {upload.isPending && <Loader2 className="animate-spin" />}
            Yükle ve indeksle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
