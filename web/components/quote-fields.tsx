"use client";

import { useEffect, useState, type ReactNode } from "react";
import { fetchRef, type RefItem } from "@/lib/quote-api";
import type { Option } from "@/lib/quote-options";
import { useScoped } from "./quote-scope";

export const inputClass =
  "h-12 w-full rounded-xl border bg-white px-4 text-[1rem] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/55 focus:border-gold focus:shadow-[0_0_0_4px_rgba(226,184,106,0.22)] disabled:cursor-not-allowed disabled:bg-pearl disabled:text-ink-soft";
export const labelClass = "mb-1.5 block text-[0.8125rem] font-semibold text-ink";
const chipClass =
  "inline-flex h-10 items-center rounded-full border border-ink/15 px-4 text-[0.9375rem] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-gold hover:border-ink/40";

export const borderOf = (error?: string) => (error ? "border-red-500/70" : "border-ink/15");
export const digits = (value: string, max: number) => value.replace(/\D/g, "").slice(0, max);

export function ErrorText({ error }: { error?: string }) {
  return error ? (
    <p role="alert" className="mt-1.5 text-[0.8125rem] text-red-600">
      {error}
    </p>
  ) : null;
}

export function Chips<T extends string | number>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  hint?: string;
  name: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input type="radio" name={name} checked={value === option.value} onChange={() => onChange(option.value)} className="peer sr-only" />
            <span className={chipClass}>{option.label}</span>
          </label>
        ))}
      </div>
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">{hint}</p>}
      <ErrorText error={error} />
    </fieldset>
  );
}

export function Toggle({ title, hint, checked, onChange }: { title: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink/15 px-4 py-3 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold">
      <span>
        <span className="block text-[0.9375rem] font-semibold">{title}</span>
        <span className="block text-[0.8125rem] text-ink-soft">{hint}</span>
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-ink/20 transition-colors peer-checked:bg-gold-deep after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

export function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  const scoped = useScoped();
  return (
    <div>
      <label htmlFor={scoped(id)} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">{hint}</p>}
      <ErrorText error={error} />
    </div>
  );
}

/** A text input with the form's look; `onValue` receives the typed text. */
export function TextField({
  id,
  label,
  hint,
  error,
  value,
  onValue,
  placeholder,
  inputMode,
  autoComplete = "off",
  upper,
  disabled,
  autoFocus,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onValue: (value: string) => void;
  placeholder?: string;
  inputMode?: "numeric" | "tel" | "text";
  autoComplete?: string;
  upper?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const scoped = useScoped();
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      <input
        id={scoped(id)}
        value={value}
        onChange={(event) => onValue(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        disabled={disabled}
        aria-invalid={!!error}
        className={`${inputClass} ${borderOf(error)} ${upper ? "uppercase" : ""}`}
      />
    </Field>
  );
}

/** A list read from the quote API (provinces, brands, address steps...), loaded while the component is in use. */
export function useRefList(kind: string, params: Record<string, string> = {}, enabled = true) {
  const key = JSON.stringify([kind, params]);
  const [state, setState] = useState<{ key: string; items: RefItem[]; failed: boolean } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const [listKind, listParams] = JSON.parse(key) as [string, Record<string, string>];
    fetchRef(listKind, listParams, controller.signal)
      .then((items) => setState({ key, items, failed: false }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ key, items: [], failed: true });
      });
    return () => controller.abort();
  }, [key, enabled]);

  const ready = enabled && state?.key === key;
  return { items: ready ? state.items : [], loading: enabled && !ready, failed: ready && state.failed };
}

type SelectProps = {
  id: string;
  label: string;
  value: string;
  onValue: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
};

/** A drop-down over fixed options. */
export function SelectField({ options, ...props }: SelectProps & { options: readonly Option[] }) {
  const scoped = useScoped();
  return (
    <Field id={props.id} label={props.label} hint={props.hint} error={props.error}>
      <select
        id={scoped(props.id)}
        value={props.value}
        onChange={(event) => props.onValue(event.target.value)}
        disabled={props.disabled}
        aria-invalid={!!props.error}
        className={`${inputClass} ${borderOf(props.error)}`}
      >
        <option value="">{props.placeholder ?? "Seçin"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

/** A drop-down over a list from the quote API, showing "Yükleniyor…" or a failure while it loads. */
export function RefSelect({
  kind,
  params,
  enabled = true,
  format,
  ...props
}: SelectProps & {
  kind: string;
  params?: Record<string, string>;
  enabled?: boolean;
  /** Pick the only item automatically. */
  autoPickSingle?: boolean;
  /** How an item reads in the list; defaults to its name. */
  format?: (item: RefItem) => string;
  /** Receives the whole chosen item (for lists whose items carry more than a code). */
  onItem?: (item: RefItem | undefined) => void;
}) {
  const { items, loading, failed } = useRefList(kind, params, enabled);
  const { autoPickSingle, onItem, ...selectProps } = props;
  const single = autoPickSingle && items.length === 1 ? items[0].code : "";
  const { value, onValue } = selectProps;

  useEffect(() => {
    if (single && value !== single) onValue(single);
  }, [single, value, onValue]);

  const placeholder = !enabled ? (props.placeholder ?? "Seçin") : loading ? "Yükleniyor…" : failed ? "Liste alınamadı" : (props.placeholder ?? "Seçin");
  return (
    <SelectField
      {...selectProps}
      onValue={(code) => {
        selectProps.onValue(code);
        onItem?.(items.find((item) => item.code === code));
      }}
      placeholder={placeholder}
      disabled={props.disabled || !enabled || loading || failed}
      error={selectProps.error ?? (failed ? "Liste şu an alınamıyor, sayfayı yenileyip tekrar deneyin." : undefined)}
      options={items.map((item) => ({ value: item.code, label: format ? format(item) : item.name }))}
    />
  );
}
