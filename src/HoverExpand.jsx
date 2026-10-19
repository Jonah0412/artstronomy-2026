import { useEffect, useRef, useState } from "react";

const categoryColors = {
  "Web Design": ["#a886df", "#08150f"],
  Branding: ["#f7df36", "#08150f"],
  Publishing: ["#ef4c3c", "#f4f1df"],
  Advertising: ["#f4f1df", "#08150f"],
  "Mix Media": ["#5bc0be", "#08150f"],
  "3D Animation": ["#233b7d", "#f4f1df"],
  "2D Animation": ["#ff8f70", "#08150f"],
};

export function HoverExpand({ items, className = "", selection = null }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const cardRefs = useRef(new Map());
  const interacted = useRef(false);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!items.some((item) => item.id === activeId)) {
      setActiveId(items[0]?.id ?? null);
    }
  }, [activeId, items]);

  useEffect(() => {
    if (!selection?.id) return;
    interacted.current = true;
    setActiveId(selection.id);
    const timer = setTimeout(() => {
      const card=cardRefs.current.get(selection.id);
      card?.focus({preventScroll:true});
      card?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center',inline:'center'});
    }, 420);
    return () => clearTimeout(timer);
  }, [selection]);

  useEffect(() => {
    if (!interacted.current) return;
    const timer = window.setTimeout(() => {
      cardRefs.current.get(activeId)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest", inline: "center" });
    }, 380);
    return () => window.clearTimeout(timer);
  }, [activeId]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const move = (direction) => {
    if (items.length < 2) return;
    interacted.current = true;
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    setActiveId(items[nextIndex].id);
  };

  const compact = viewportWidth <= 720;
  const expandedWidth = compact ? 270 : Math.min(650, Math.round(viewportWidth * 0.48));
  const collapsedWidth = compact ? 52 : Math.min(120, Math.round(viewportWidth * 0.09));
  const cardHeight = compact ? 310 : Math.min(650, Math.round(viewportWidth * 0.48));

  return (
    <div
      className={`hover-expand ${items.length <= 6 ? "is-short" : ""} ${className}`.trim()}
    >
      <div className="hover-expand__header">
        <p>{items.length} creators · click or tap a name to expand · use the arrows to browse</p>
        <div className="hover-expand__controls" aria-label="Creator carousel controls">
          <button type="button" onClick={() => move(-1)} disabled={items.length < 2} aria-label="Previous creator">←</button>
          <button type="button" onClick={() => move(1)} disabled={items.length < 2} aria-label="Next creator">→</button>
        </div>
      </div>
      <div className="hover-expand__track" aria-live="polite">
        {items.map((item) => {
          const active = item.id === activeId;
          const [cardColor, cardInk] = categoryColors[item.category] ?? ["#a886df", "#08150f"];
          return (
            <button
              type="button"
              key={item.id}
              id={`creator-${item.id}`}
              ref={(node) => {
                if (node) cardRefs.current.set(item.id, node);
                else cardRefs.current.delete(item.id);
              }}
              className={`hover-expand__card ${active ? "is-active" : ""}`}
              style={{
                "--creator-card-color": cardColor,
                "--creator-card-ink": cardInk,
                width: active ? `${expandedWidth}px` : `${collapsedWidth}px`,
                height: `${cardHeight}px`,
              }}
              aria-current={active ? "true" : undefined}
              aria-expanded={active}
              aria-label={`${item.name}, ${item.category}`}
              onClick={() => {interacted.current = true;setActiveId(item.id);}}
            >
              <span className="hover-expand__name-only">{item.name}</span>
              <span className="hover-expand__profile">
                <img src={item.image} alt="" loading="lazy" decoding="async" />
                <span className="hover-expand__overlay">
                  <span>{item.name}</span>
                  <small>{item.category}</small>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
