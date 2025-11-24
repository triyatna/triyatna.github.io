import React, { useEffect, useMemo, useState, Suspense, useRef } from "react";
import { SEO } from "../modules/components/SEO";
import { useTheme } from "../modules/hooks/useTheme";
import { useAppData } from "../modules/hooks/useAppData";
import { ThemeToggle } from "../modules/components/ThemeToggle";
import { Hero } from "../modules/sections/Hero";
import { Footer } from "../modules/sections/Footer";
import { Loader } from "../modules/components/Loader";
import type { ContactConfig } from "../modules/sections/Contact";

// Lazy load non-critical sections
const MatrixRain = React.lazy(() => import("../modules/components/MatrixRain").then(m => ({ default: m.MatrixRain })));
const About = React.lazy(() => import("../modules/sections/About").then(m => ({ default: m.About })));
const Resume = React.lazy(() => import("../modules/sections/Resume").then(m => ({ default: m.Resume })));
const Tech = React.lazy(() => import("../modules/sections/Tech").then(m => ({ default: m.Tech })));
const Projects = React.lazy(() => import("../modules/sections/Projects").then(m => ({ default: m.Projects })));
const Portfolio = React.lazy(() => import("../modules/sections/Portfolio").then(m => ({ default: m.Portfolio })));
const Contact = React.lazy(() => import("../modules/sections/Contact").then(m => ({ default: m.Contact })));

const Section: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <section id={id} className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 scroll-mt-24">
    {children}
  </section>
);

const ALLOWED_MODES = ["mailto", "formspree", "disabled"] as const;
type Mode = (typeof ALLOWED_MODES)[number];
function normalizeMode(x: unknown, fallback: Mode = "mailto"): Mode {
  return (ALLOWED_MODES as readonly string[]).includes(String(x)) ? (x as Mode) : fallback;
}

function getInitialSection() {
  if (typeof window === "undefined") return "hero";
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash || "hero";
}

export default function App() {
  const { theme } = useTheme();
  const { data, loading, error } = useAppData();

  const [boot, setBoot] = useState(true);
  useEffect(() => {
    const wait = Promise.all([
      (document as any).fonts?.ready?.catch(() => {}) ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 800)),
    ]);
    wait.finally(() => setBoot(false));
  }, []);

  // sinkronisasi progress untuk efek di konten
  const [loaderPct, setLoaderPct] = useState(0);
  const [loaderFinished, setLoaderFinished] = useState(false);

  const canFinishLoader = !boot && !loading; // data sudah siap + boot selesai
  const hasData = Object.keys(data).length > 0;
  const wantsLoader = hasData && (data as any)?.useLoader !== false;
  const showLoader = wantsLoader && !loaderFinished;

  const [active, setActive] = useState<string>(() => getInitialSection());
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  const hashAppliedRef = useRef(false);

  const contactCfg: ContactConfig = useMemo(() => {
    const raw = (data as any)?.contact ?? { form: { mode: "mailto" } };
    const mode = normalizeMode(raw.form?.mode);
    return {
      enabled: Boolean(raw.enabled ?? true),
      form: {
        mode,
        to: raw.form?.to || "",
        formspreeId: raw.form?.formspreeId || "",
      },
      contact_me: {
        address: raw.contact_me?.address || "",
        email: raw.contact_me?.email || raw.form?.to || "",
        website: raw.contact_me?.website || "",
      },
    };
  }, [data]);

  const navItems = useMemo(
    () =>
      [
        { id: "hero", label: "Home", show: true },
        { id: "about", label: "About", show: Boolean(data.about?.enabled) },
        { id: "resume", label: "Resume", show: Boolean(data.resume?.enabled) },
        { id: "tech", label: "Tech", show: Boolean(data.techStack?.enabled) },
        { id: "projects", label: "Projects", show: true },
        { id: "portfolio", label: "Portfolio", show: Boolean(data.portfolio?.enabled) },
        { id: "contact", label: "Contact", show: true },
      ].filter((n) => n.show),
    [data]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getSections = () =>
      navItems
        .map((n) => document.getElementById(n.id))
        .filter((el): el is HTMLElement => Boolean(el))
        .sort((a, b) => a.offsetTop - b.offsetTop || a.id.localeCompare(b.id));

    const pickCurrent = () => {
      const sections = getSections();
      if (!sections.length) return activeRef.current;

      const pivot = window.scrollY + window.innerHeight * 0.35;
      let currentId = sections[0].id;
      for (const section of sections) {
        if (section.offsetTop <= pivot) {
          currentId = section.id;
        } else {
          break;
        }
      }
      return currentId;
    };

    const update = () => {
      const next = pickCurrent();
      if (next && next !== activeRef.current) setActive(next);
    };

    let frame: number | null = null;
    const onScroll = () => {
      if (frame != null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    const mutationObserver = new MutationObserver(() => update());
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (frame != null) window.cancelAnimationFrame(frame);
      mutationObserver.disconnect();
    };
  }, [navItems]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || hashAppliedRef.current) return;
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (!hash) {
      hashAppliedRef.current = true;
      return;
    }
    if (!navItems.some((n) => n.id === hash)) return;

    const scrollToHash = () => {
      const target = document.getElementById(hash);
      if (!target) return false;
      const root = document.documentElement;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView();
      root.style.scrollBehavior = prevBehavior || "smooth";
      setActive(hash);
      hashAppliedRef.current = true;
      return true;
    };

    if (scrollToHash()) return;

    const observer = new MutationObserver(() => {
      if (scrollToHash()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const timeoutId = window.setTimeout(() => {
      observer.disconnect();
      scrollToHash();
    }, 5000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [navItems]);

  const veilT = showLoader ? loaderPct / 100 : 1;
  const contentStyle: React.CSSProperties = showLoader
    ? {
        opacity: Math.max(0.2, 0.3 + 0.7 * veilT),
        transform: `scale(${0.98 + 0.02 * veilT})`,
        filter: `blur(${Math.max(0, 6 - 6 * veilT)}px)`,
        transition: "filter .25s ease, opacity .25s ease, transform .25s ease",
      }
    : {};

  if (loading) {
    return <div className="min-h-screen bg-[color:var(--bg)]" />;
  }

  return (
    <>
      <SEO data={data as any} />

      <Loader
        show={showLoader}
        canFinish={canFinishLoader}
        onProgress={(p) => setLoaderPct(p)}
        onDone={() => setLoaderFinished(true)}
        minDurationMs={2000}
        logs={[
          "[BOOT] mounting modules…",
          loading ? "[NET]  fetching /data.json…" : "[NET]  cache hit /data.json",
          "[OK]   core:init ✓",
          "[OK]   shaders:compile (3 targets) ✓",
          "[OK]   assets:prefetch (svg, png, json) ✓",
          "[SEC]  CSP ok | sandbox ok",
          "[SYS]  cache primed | delta-ready",
          "[DONE]  running!",
        ]}
      />

      <div
        className="min-h-screen selection:bg-black/10 selection:text-current"
        style={contentStyle}
      >
        <Suspense fallback={null}>
          <MatrixRain />
        </Suspense>

        {error && (
          <div className="sticky top-0 z-50 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-y border-amber-500/20 px-4 py-2 text-sm">
            Failed to fetch data.json. Using fallback. ({error})
          </div>
        )}

        <header className="sticky top-4 z-40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between rounded-2xl border border-subtle bg-[color:var(--bg)]/55 backdrop-blur-xl shadow-md pl-3 pr-2 py-2">
              <a
                href="#"
                className="flex items-center gap-2 font-semibold tracking-tight focus-ring rounded"
              >
                <img
                  src={data.personal?.logo_path || "./assets/images/apple-touch-icon.png"}
                  alt={`${data.personal?.name || "Logo"}`}
                  className="h-8 w-8 rounded-lg object-cover"
                  width={32}
                  height={32}
                  loading="eager"
                  decoding="async"
                />
                <span className="brand-text hidden sm:inline">
                  {data.personal?.name || "My Portfolio"}
                </span>
              </a>

              <nav className="hidden md:flex items-center gap-1 text-sm">
                {navItems.map((n) => {
                  const isActive = active === n.id;
                  return (
                    <a
                      key={n.id}
                      href={`#${n.id}`}
                      onClick={() => setActive(n.id)}
                      className={`nav-link relative inline-flex items-center gap-2 rounded-lg px-3 py-1.5 transition focus-ring
                        ${isActive ? "nav-active" : "text-muted hover:text-[color:var(--accent)]"}
                      `}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="nav-led" aria-hidden="true" />
                      <span
                        className={`nav-bracket ${isActive ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      >
                        [&nbsp;
                      </span>
                      <span className="truncate">{n.label}</span>
                      <span
                        className={`nav-bracket ${isActive ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      >
                        &nbsp;]
                      </span>
                    </a>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main>
          <Section id="hero">
            <Hero data={data} />
          </Section>

          <Suspense fallback={<div className="py-20 text-center text-muted">Loading content...</div>}>
            {data.about?.enabled && (
              <Section id="about">
                <About markdown={data.about.markdown} />
              </Section>
            )}

            {data.resume?.enabled && (
              <Section id="resume">
                <Resume resume={data.resume} />
              </Section>
            )}

            {data.techStack?.enabled && (
              <Section id="tech">
                <Tech badges={data.techStack.badges || []} />
              </Section>
            )}

            <Section id="projects">
              <Projects config={data.projects} />
            </Section>

            {data.portfolio?.enabled && (
              <Section id="portfolio">
                <Portfolio config={data.portfolio} />
              </Section>
            )}

            <Section id="contact">
              <Contact config={contactCfg} displayName={data.personal?.name || "Anonymous"} />
            </Section>
          </Suspense>
        </main>

        <Footer socials={data.personal?.socials} name={data.personal?.name} />
      </div>

      <style>{`
        .brand-text {
          background: linear-gradient(90deg,
            color-mix(in oklch, var(--text) 100%, transparent) 0%,
            color-mix(in oklch, var(--accent) 70%, var(--text)) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .nav-link { position: relative; }
        .nav-led {
          position: absolute; left: 6px; top: 50%;
          transform: translateY(-50%) scaleY(.6);
          width: 2px; height: 60%; background: var(--accent); border-radius: 999px;
          opacity: 0; transition: opacity .18s ease, transform .18s ease;
          box-shadow: 0 0 12px color-mix(in oklch, var(--accent) 60%, transparent);
        }
        .nav-bracket { color: color-mix(in oklch, var(--accent) 75%, var(--text)); transition: opacity .18s ease; }
        .nav-active {
          color: var(--accent);
          background: color-mix(in oklch, var(--accent) 10%, transparent);
          box-shadow: 0 0 0 1px color-mix(in oklch, var(--accent) 25%, transparent) inset,
                      0 8px 22px -14px color-mix(in oklch, var(--accent) 50%, transparent);
        }
        .nav-active .nav-led { opacity: 1; transform: translateY(-50%) scaleY(1); }
        .nav-active::after {
          content: ""; position: absolute; left: 12%; right: 12%; bottom: 2px;
          height: 2px; border-radius: 999px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: .9; animation: navScan 2.2s linear infinite;
        }
        @keyframes navScan { 0% { transform: translateX(-8%); } 100% { transform: translateX(8%); } }
        @media (prefers-reduced-motion: reduce) { .nav-active::after { animation: none !important; } }
      `}</style>
    </>
  );
}
