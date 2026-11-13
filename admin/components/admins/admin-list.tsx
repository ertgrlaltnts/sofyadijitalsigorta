"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ActiveBadge } from "@/components/status-badge";
import { TableSkeleton } from "@/components/table-skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { applyApiError, errorMessage } from "@/lib/form-errors";
import { formatDateTime } from "@/lib/format";
import { useMe } from "@/lib/hooks";
import type { AdminUser } from "@/lib/types";

const passwordRule = z.string().min(8, "Şifre en az 8 karakter olmalı.").max(100, "Şifre en fazla 100 karakter olabilir.");
const createSchema = z.object({
  name: z.string().trim().min(2, "En az 2 karakter olmalı.").max(80),
  email: z.string().min(1, "E-posta gerekli.").email("Geçerli bir e-posta girin."),
  password: passwordRule,
});
const passwordSchema = z.object({ password: passwordRule });
type CreateValues = z.infer<typeof createSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CreateAdminDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateValues>({ resolver: zodResolver(createSchema) });

  const create = useMutation({
    mutationFn: (values: CreateValues) => api<AdminUser>("admin/admins", { method: "POST", body: values }),
    onSuccess: () => {
      toast.success("Yönetici eklendi.");
      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      onOpenChange(false);
      reset();
    },
    onError: (error) => applyApiError(error, setError),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit((values) => create.mutate(values))} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Yeni yönetici</DialogTitle>
            <DialogDescription>Eklenen yönetici bu e-posta ve şifre ile panele giriş yapabilir.</DialogDescription>
          </DialogHeader>
          <Field label="Ad soyad" id="admin-name" error={errors.name?.message}>
            <Input id="admin-name" autoFocus aria-invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field label="E-posta" id="admin-email" error={errors.email?.message}>
            <Input id="admin-email" type="email" autoComplete="off" aria-invalid={!!errors.email} {...register("email")} />
          </Field>
          <Field label="Şifre" id="admin-password" error={errors.password?.message}>
            <Input id="admin-password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending && <Loader2 className="animate-spin" />}
              Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({ admin, onClose }: { admin: AdminUser | null; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) });

  const change = useMutation({
    mutationFn: (values: PasswordValues) => api<void>(`admin/admins/${admin?.id}/password`, { method: "PATCH", body: values }),
    onSuccess: () => {
      toast.success("Şifre güncellendi.");
      onClose();
      reset();
    },
    onError: (error) => applyApiError(error, setError),
  });

  return (
    <Dialog open={!!admin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={handleSubmit((values) => change.mutate(values))} noValidate className="space-y-4">
          <DialogHeader>
            <DialogTitle>Şifre sıfırla</DialogTitle>
            <DialogDescription>{admin?.name} için yeni bir şifre belirleyin.</DialogDescription>
          </DialogHeader>
          <Field label="Yeni şifre" id="reset-password" error={errors.password?.message}>
            <Input id="reset-password" type="password" autoComplete="new-password" autoFocus aria-invalid={!!errors.password} {...register("password")} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Vazgeç
            </Button>
            <Button type="submit" disabled={change.isPending}>
              {change.isPending && <Loader2 className="animate-spin" />}
              Şifreyi güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminList() {
  const queryClient = useQueryClient();
  const { data: me } = useMe();
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ["admins"], queryFn: () => api<AdminUser[]>("admin/admins") });
  const [createOpen, setCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);

  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api<AdminUser>(`admin/admins/${id}`, { method: "PATCH", body: { isActive } }),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["admins"] });
      const previous = queryClient.getQueryData<AdminUser[]>(["admins"]);
      queryClient.setQueryData<AdminUser[]>(["admins"], (current) => current?.map((a) => (a.id === id ? { ...a, isActive } : a)));
      return { previous };
    },
    onError: (err, _vars, context) => {
      queryClient.setQueryData(["admins"], context?.previous);
      toast.error(errorMessage(err));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
  });

  const admins = data ?? [];

  return (
    <>
      <PageHeader
        title="Yöneticiler"
        description="Panele erişebilen yöneticileri ekleyin, pasife alın veya şifrelerini sıfırlayın."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus /> Yönetici ekle
          </Button>
        }
      />

      {isError ? (
        <EmptyState icon={Users} title="Yöneticiler yüklenemedi" description={errorMessage(error)} action={<Button onClick={() => refetch()}>Tekrar dene</Button>} />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Yönetici</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="hidden md:table-cell">Son giriş</TableHead>
                <TableHead className="hidden lg:table-cell">Eklenme</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            {isPending ? (
              <TableSkeleton columns={5} rows={3} />
            ) : (
              <TableBody>
                {admins.map((admin) => {
                  const isSelf = admin.id === me?.id;
                  return (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="font-medium">
                          {admin.name}
                          {isSelf && <span className="ml-2 text-xs font-normal text-muted-foreground">(siz)</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{admin.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            size="sm"
                            checked={admin.isActive}
                            disabled={isSelf}
                            onCheckedChange={(isActive) => toggle.mutate({ id: admin.id, isActive })}
                            aria-label={admin.isActive ? "Pasife al" : "Aktifleştir"}
                          />
                          <ActiveBadge active={admin.isActive} />
                        </div>
                      </TableCell>
                      <TableCell className="tabular hidden text-muted-foreground md:table-cell">
                        {admin.lastLoginAt ? formatDateTime(admin.lastLoginAt) : "Henüz giriş yapmadı"}
                      </TableCell>
                      <TableCell className="tabular hidden text-muted-foreground lg:table-cell">{formatDateTime(admin.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => setResetTarget(admin)} aria-label="Şifre sıfırla" title="Şifre sıfırla">
                          <KeyRound />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </div>
      )}

      <CreateAdminDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ResetPasswordDialog admin={resetTarget} onClose={() => setResetTarget(null)} />
    </>
  );
}
