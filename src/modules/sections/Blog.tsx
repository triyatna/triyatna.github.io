import React, { useEffect, useState } from "react";

type BlogConfig = { enabled: boolean; rssJson: string; max: number };

const BLOG_CACHE_PREFIX = "ty-blog-feed";
const BLOG_CACHE_TTL_MS = 1000 * 60 * 30;

type BlogCachePayload = { timestamp: number; items: any[] };

function readBlogCache(key: string): any[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${BLOG_CACHE_PREFIX}:${key}`);
    if (!raw) return null;
    const payload = JSON.parse(raw) as BlogCachePayload;
    if (!payload?.timestamp || !Array.isArray(payload.items)) return null;
    if (Date.now() - payload.timestamp > BLOG_CACHE_TTL_MS) {
      sessionStorage.removeItem(`${BLOG_CACHE_PREFIX}:${key}`);
      return null;
    }
    return payload.items;
  } catch {
    return null;
  }
}

function writeBlogCache(key: string, items: any[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: BlogCachePayload = { timestamp: Date.now(), items };
    sessionStorage.setItem(`${BLOG_CACHE_PREFIX}:${key}`, JSON.stringify(payload));
  } catch {
    // ignore quota errors
  }
}

export const Blog: React.FC<{ config: BlogConfig }> = ({ config }) => {
  const [items, setItems] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config?.enabled || !config?.rssJson) return;
    const controller = new AbortController();
    const cacheKey = `${config.rssJson}|${config.max}`;
    const cached = readBlogCache(cacheKey);
    if (cached) {
      setItems(cached);
    }
    async function load() {
      try {
        if (!cached) setItems(null);
        const res = await fetch(config.rssJson, { signal: controller.signal });
        const json = await res.json();
        const arr = json?.items || [];
        const next = arr.slice(0, config.max || 6);
        setItems(next);
        writeBlogCache(cacheKey, next);
      } catch (e) {
        setError("Failed to load blog feed.");
      }
    }
    load();
    return () => controller.abort();
  }, [config.enabled, config.rssJson, config.max]);

  if (!config?.enabled || error || !items || items.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Blog</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <a key={i} href={p.link} target="_blank" rel="noreferrer"
             className="rounded-xl border border-subtle bg-surface p-4 hover:shadow-md focus-ring block">
            <h3 className="font-medium">{p.title}</h3>
            <p className="mt-2 text-sm text-muted line-clamp-3">{p.description?.replace(/<[^>]+>/g, "")}</p>
            <span className="mt-3 block text-xs text-muted">{new Date(p.pubDate).toLocaleDateString()}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
