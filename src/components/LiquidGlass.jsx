import { useEffect, useId, useRef, useState } from "react";

// A static displacement map bends only the edges of the backdrop like a lens.
function createLensMap(width, height) {
  const edge = Math.min(18, height / 4);
  const map = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="l"><stop stop-color="#ff8080"/><stop offset="1" stop-color="#808080"/></linearGradient>
      <linearGradient id="r"><stop stop-color="#808080"/><stop offset="1" stop-color="#008080"/></linearGradient>
      <linearGradient id="t" x2="0" y2="1"><stop stop-color="#80ff80"/><stop offset="1" stop-color="#808080"/></linearGradient>
      <linearGradient id="b" x2="0" y2="1"><stop stop-color="#808080"/><stop offset="1" stop-color="#800080"/></linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#808080"/>
    <rect width="${edge}" height="${height}" fill="url(#l)"/>
    <rect x="${width - edge}" width="${edge}" height="${height}" fill="url(#r)"/>
    <rect width="${width}" height="${edge}" fill="url(#t)"/>
    <rect y="${height - edge}" width="${width}" height="${edge}" fill="url(#b)"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(map)}`;
}

export default function LiquidGlass({ className = "" }) {
  const surface = useRef(null);
  const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [size, setSize] = useState({ width: 1200, height: 76 });

  useEffect(() => {
    const element = surface.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.max(1, Math.round(entry.contentRect.width));
      const height = Math.max(1, Math.round(entry.contentRect.height));
      setSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={surface}
      className={`liquid-glass-surface ${className}`}
      aria-hidden="true"
    >
      <svg
        className="glass-filter-definitions"
        width="0"
        height="0"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={createLensMap(size.width, size.height)}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lens"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span className="glass-backdrop" />
      <span
        className="glass-refraction"
        style={{ "--glass-filter": `url("#${filterId}")` }}
      />
      <span className="glass-rim" />
    </div>
  );
}
