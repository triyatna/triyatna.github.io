import React, { useEffect, useRef } from "react";

export const MatrixRain: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReduced) return;

    // Configuration
    const fontSize = 14;
    const colWidth = 16;
    const chars = "0123456789ABCDEF"; // Hex characters for "tech" feel
    
    // State
    let wCss = 0;
    let hCss = 0;
    let columns = 0;
    let drops: number[] = [];
    
    // Colors
    let bg = "#0D1117";
    let accent = "#58a6ff";

    const updateColors = () => {
      const style = getComputedStyle(document.documentElement);
      bg = style.getPropertyValue("--bg").trim() || "#0D1117";
      accent = style.getPropertyValue("--accent").trim() || "#58a6ff";
    };

    const setupSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      wCss = window.innerWidth;
      hCss = window.innerHeight;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = Math.max(1, Math.floor(wCss * dpr));
      canvas.height = Math.max(1, Math.floor(hCss * dpr));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      
      ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "top";

      const newColumns = Math.max(1, Math.floor(wCss / colWidth));
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      }
    };

    // Initial setup
    updateColors();
    setupSize();

    const draw = () => {
      // Fade out effect
      ctx.fillStyle = bg;
      ctx.globalAlpha = 0.05;
      ctx.fillRect(0, 0, wCss, hCss);
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = accent;

      for (let i = 0; i < columns; i++) {
        const d = drops[i];
        if (d === undefined) continue; // TS safety

        const x = i * colWidth;
        const y = d * fontSize;

        // Random character
        const ch = chars[Math.floor(Math.random() * chars.length)] || "0";
        
        // Draw character
        if (y > -fontSize) {
            ctx.fillText(ch, x, y);
        }

        // Reset or move down
        if (y > hCss && Math.random() > 0.98) {
          drops[i] = Math.floor(Math.random() * -20);
        } else {
          drops[i] = d + 1;
        }
      }

      if (visible) raf = requestAnimationFrame(draw);
    };

    // Observers
    const resizeObs = new ResizeObserver(() => setupSize());
    resizeObs.observe(document.body);

    const themeObs = new MutationObserver(() => updateColors());
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style", "class"],
    });

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Start loop
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      resizeObs.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas id="matrix-canvas" ref={ref} aria-hidden="true" />;
};
