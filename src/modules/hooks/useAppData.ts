import { useEffect, useMemo, useRef, useState } from "react";

export type SiteData = Record<string, any>;

const CACHE_PREFIX = "ty-app-data";
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes

type CachePayload = { timestamp: number; data: SiteData };

function readCache(url: string): SiteData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}:${url}`);
    if (!raw) return null;
    const payload = JSON.parse(raw) as CachePayload;
    if (!payload?.timestamp || !payload?.data) return null;
    if (Date.now() - payload.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(`${CACHE_PREFIX}:${url}`);
      return null;
    }
    return payload.data;
  } catch {
    return null;
  }
}

function writeCache(url: string, data: SiteData) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachePayload = { timestamp: Date.now(), data };
    sessionStorage.setItem(`${CACHE_PREFIX}:${url}`, JSON.stringify(payload));
  } catch {
    // Ignore quota exceeded
  }
}

export function useAppData() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const defaultUrl = `${base}/data/data.json`;

  const dataUrl = useMemo(() => String(import.meta.env.VITE_DATA_URL || defaultUrl), [defaultUrl]);

  const [data, setData] = useState<SiteData>({} as SiteData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hydratedFromCacheRef = useRef(false);

  useEffect(() => {
    const cached = readCache(dataUrl);
    if (cached) {
      setData(cached);
      setLoading(false);
      hydratedFromCacheRef.current = true;
    }
  }, [dataUrl]);

  async function load(signal?: AbortSignal, opts: { skipLoadingState?: boolean } = {}) {
    try {
      if (!opts.skipLoadingState) setLoading(true);
      setError(null);

      const res = await fetch(dataUrl, { cache: "no-store", signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const ct = res.headers.get("content-type") || "";
      const rawText = await res.text();
      const text = rawText.replace(/^\uFEFF/, "").trim();

      if (!/application\/json/i.test(ct) || /^\s*</.test(text)) {
        throw new Error("Not JSON (got HTML)");
      }

      const parsed = JSON.parse(text) as SiteData;
      setData(parsed);
      writeCache(dataUrl, parsed);
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message || "Failed to fetch data.json");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal, { skipLoadingState: hydratedFromCacheRef.current });
    hydratedFromCacheRef.current = false;
    return () => ac.abort();
  }, [dataUrl]);

  return { data, loading, error, reload: () => load(), dataUrl };
}
