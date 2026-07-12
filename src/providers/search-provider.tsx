"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (value: string) => void;
  resetQuery: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const value = useMemo<SearchContextValue>(
    () => ({
      query,
      setQuery,
      resetQuery: () => setQuery(""),
    }),
    [query],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}

export function matchesSearch(value: string | null | undefined, query: string): boolean {
  if (!query.trim()) return true;
  if (!value) return false;
  return value.toLowerCase().includes(query.trim().toLowerCase());
}

export function matchesAnySearch(values: Array<string | null | undefined>, query: string): boolean {
  if (!query.trim()) return true;
  return values.some((value) => matchesSearch(value, query));
}
