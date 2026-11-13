"use client";

import { createContext, useContext } from "react";

/** Prefix for the DOM ids of a quote form, so two forms on one page (the product page's and the chat's) never share an id. */
export const QuoteScope = createContext("");

/** Returns a function that turns a field's id into its scoped id. */
export function useScoped(): (id: string) => string {
  const prefix = useContext(QuoteScope);
  return (id) => prefix + id;
}
