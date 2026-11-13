"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { applyApiError, errorMessage } from "@/lib/form-errors";
import type { Settings } from "@/lib/types";

const number = (min: number, max: number, label: string) =>
  z.number({ error: "Geçerli bir sayı girin." }).min(min, `${label} en az ${min} olmalı.`).max(max, `${label} en fazla ${max} olabilir.`);

const schema = z.object({
  assistantName: z.string().trim().min(2, "En az 2 karakter olmalı.").max(60),
  welcomeMessage: z.string().trim().min(1, "Karşılama mesajı boş olamaz.").max(500, "En fazla 500 karakter olabilir."),
  suggestedQuestions: z.array(z.string().trim().max(120, "En fazla 120 karakter olabilir.")).max(6),
  systemPrompt: z.string().min(20, "Sistem promptu en az 20 karakter olmalı.").max(8000, "En fazla 8000 karakter olabilir."),
  similarityThreshold: number(0.2, 0.95, "Eşik"),
  topK: number(1, 10, "Değer").pipe(z.int("Tam sayı girin.")),
  historyLimit: number(0, 20, "Değer").pipe(z.int("Tam sayı girin.")),
  temperature: number(0, 2, "Sıcaklık"),
  allowGeneralAnswers: z.boolean(),
  fallbackMessage: z.string().trim().min(1, "Yönlendirme mesajı boş olamaz.").max(500),
  quoteUrl: z.string().trim().refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Geçerli bir bağlantı girin (https://...)."),
  contactPhone: z.string().trim().max(30),
  contactWhatsapp: z.string().trim().max(30),
  contactEmail: z.string().trim().refine((v) => v === "" || /^\S+@\S+\.\S+$/.test(v), "Geçerli bir e-posta girin."),
  chatModel: z.string().trim().max(80),
});
type FormValues = z.infer<typeof schema>;

function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor?: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function QuestionListEditor({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((question, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={question}
            placeholder="Örn. Kasko nedir?"
            onChange={(e) => onChange(value.map((q, i) => (i === index ? e.target.value : q)))}
            aria-label={`Öneri sorusu ${index + 1}`}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Soruyu kaldır">
            <X />
          </Button>
        </div>
      ))}
      {value.length < 6 && (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, ""])}>
          <Plus /> Soru ekle
        </Button>
      )}
    </div>
  );
}

function SliderField({ value, onChange, min, max, step }: { value: number; onChange: (value: number) => void; min: number; max: number; step: number }) {
  return (
    <div className="flex items-center gap-4">
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : (next as number))}
        className="flex-1"
      />
      <span className="tabular w-12 text-right text-sm font-semibold">{value.toFixed(2)}</span>
    </div>
  );
}

function SettingsFormInner({ settings }: { settings: Settings }) {
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: settings });

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      api<Settings>("admin/settings", { method: "PATCH", body: { ...values, suggestedQuestions: values.suggestedQuestions.filter((q) => q.trim()) } }),
    onSuccess: (saved) => {
      queryClient.setQueryData(["settings"], saved);
      reset(saved);
      toast.success("Ayarlar kaydedildi.");
    },
    onError: (error) => applyApiError(error, setError),
  });

  return (
    <form onSubmit={handleSubmit((values) => save.mutate(values))} noValidate className="pb-24">
      <PageHeader title="Ayarlar" description="Asistanın kişiliğini, yanıt davranışını ve iletişim bilgilerini yapılandırın. Değişiklikler kaydedildiği anda geçerli olur." />

      <div className="space-y-6">
        <Section title="Asistan" description="Ziyaretçilerin chat penceresinde göreceği bilgiler.">
          <Field label="Asistan adı" htmlFor="assistantName" error={errors.assistantName?.message}>
            <Input id="assistantName" aria-invalid={!!errors.assistantName} {...register("assistantName")} />
          </Field>
          <Field label="Karşılama mesajı" htmlFor="welcomeMessage" error={errors.welcomeMessage?.message}>
            <Textarea id="welcomeMessage" rows={3} aria-invalid={!!errors.welcomeMessage} {...register("welcomeMessage")} />
          </Field>
          <Field label="Önerilen başlangıç soruları" hint="En fazla 6 soru. Ziyaretçilere hızlı başlangıç butonları olarak gösterilir.">
            <Controller control={control} name="suggestedQuestions" render={({ field }) => <QuestionListEditor value={field.value} onChange={field.onChange} />} />
          </Field>
        </Section>

        <Section title="Sistem promptu" description="Asistanın kişiliğini ve temel kurallarını belirler. Her yanıtta kullanılır.">
          <Field label="Sistem promptu / asistan kişiliği" htmlFor="systemPrompt" error={errors.systemPrompt?.message}>
            <Textarea id="systemPrompt" rows={14} className="font-mono text-[13px] leading-relaxed" aria-invalid={!!errors.systemPrompt} {...register("systemPrompt")} />
          </Field>
        </Section>

        <Section title="Bilgi arama" description="Yanıtın bilgi tabanına dayanıp dayanmayacağını bu değerler belirler.">
          <Field label="Benzerlik eşiği" hint="Yüksek değer daha seçici olur: yalnızca çok yakın eşleşmeler bilgi tabanından yanıtlanır." error={errors.similarityThreshold?.message}>
            <Controller control={control} name="similarityThreshold" render={({ field }) => <SliderField value={field.value} onChange={field.onChange} min={0.2} max={0.95} step={0.01} />} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Kullanılacak kayıt sayısı (top-K)" htmlFor="topK" hint="1 – 10" error={errors.topK?.message}>
              <Input id="topK" type="number" min={1} max={10} aria-invalid={!!errors.topK} {...register("topK", { valueAsNumber: true })} />
            </Field>
            <Field label="Geçmiş mesaj sayısı" htmlFor="historyLimit" hint="Modele gönderilen önceki mesaj sayısı (0 – 20)" error={errors.historyLimit?.message}>
              <Input id="historyLimit" type="number" min={0} max={20} aria-invalid={!!errors.historyLimit} {...register("historyLimit", { valueAsNumber: true })} />
            </Field>
          </div>
          <Field label="Temperature" hint="Düşük değer daha tutarlı, yüksek değer daha yaratıcı yanıtlar üretir. Bazı modeller yalnızca varsayılan değeri destekler; bu durumda değer yok sayılır." error={errors.temperature?.message}>
            <Controller control={control} name="temperature" render={({ field }) => <SliderField value={field.value} onChange={field.onChange} min={0} max={2} step={0.1} />} />
          </Field>
        </Section>

        <Section title="Genel yanıtlar" description="Bilgi tabanında karşılığı olmayan sorularda asistanın nasıl davranacağını seçin.">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <Label htmlFor="allowGeneralAnswers">Genel yanıtlara izin ver</Label>
              <p className="text-xs text-muted-foreground">Kapalıysa, bilgi bulunamayan sorulara aşağıdaki yönlendirme mesajı verilir.</p>
            </div>
            <Controller control={control} name="allowGeneralAnswers" render={({ field }) => <Switch id="allowGeneralAnswers" checked={field.value} onCheckedChange={field.onChange} />} />
          </div>
          <Field label="Bilgi yoksa gösterilecek yönlendirme mesajı" htmlFor="fallbackMessage" error={errors.fallbackMessage?.message}>
            <Textarea id="fallbackMessage" rows={3} aria-invalid={!!errors.fallbackMessage} {...register("fallbackMessage")} />
          </Field>
        </Section>

        <Section title="İletişim ve teklif" description="Asistan uygun yerlerde ziyaretçiyi bu kanallara yönlendirir. Boş bırakılan alanlar kullanılmaz.">
          <Field label="Teklif al sayfası" htmlFor="quoteUrl" error={errors.quoteUrl?.message}>
            <Input id="quoteUrl" placeholder="https://…" aria-invalid={!!errors.quoteUrl} {...register("quoteUrl")} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="İletişim telefonu" htmlFor="contactPhone" error={errors.contactPhone?.message}>
              <Input id="contactPhone" {...register("contactPhone")} />
            </Field>
            <Field label="WhatsApp" htmlFor="contactWhatsapp" error={errors.contactWhatsapp?.message}>
              <Input id="contactWhatsapp" {...register("contactWhatsapp")} />
            </Field>
          </div>
          <Field label="E-posta" htmlFor="contactEmail" error={errors.contactEmail?.message}>
            <Input id="contactEmail" type="email" aria-invalid={!!errors.contactEmail} {...register("contactEmail")} />
          </Field>
        </Section>

        <Section title="Model" description="Sohbet yanıtlarında kullanılacak OpenAI modeli.">
          <Field label="Chat modeli" htmlFor="chatModel" hint="Boş bırakılırsa sunucudaki OPENAI_CHAT_MODEL değeri kullanılır." error={errors.chatModel?.message}>
            <Input id="chatModel" placeholder="Örn. gpt-4o-mini" {...register("chatModel")} />
          </Field>
        </Section>
      </div>

      <div
        className={`fixed right-0 bottom-0 left-0 z-20 border-t bg-background/90 backdrop-blur transition-transform duration-200 md:left-[72px] lg:left-64 ${isDirty ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!isDirty}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">Kaydedilmemiş değişiklikler var.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => reset(settings)} disabled={save.isPending}>
              Sıfırla
            </Button>
            <Button type="submit" disabled={save.isPending || !isDirty}>
              {save.isPending && <Loader2 className="animate-spin" />}
              Kaydet
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function SettingsForm() {
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ["settings"], queryFn: () => api<Settings>("admin/settings") });

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="font-medium">Ayarlar yüklenemedi</p>
        <p className="mt-1 text-sm text-muted-foreground">{errorMessage(error)}</p>
        <Button className="mt-4" onClick={() => refetch()}>
          Tekrar dene
        </Button>
      </div>
    );
  }
  return <SettingsFormInner settings={data} />;
}
