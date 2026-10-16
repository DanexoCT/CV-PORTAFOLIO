import { Children, useEffect, useId, useRef, useState } from "react";
import { motion as Motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import "./InterfaceMotion.css";

export function SelectionPill({ active, group }) {
  const reduced = useReducedMotion();
  return active ? (
    <Motion.span
      className="selection-pill"
      layoutId={group}
      aria-hidden="true"
      transition={
        reduced
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 36 }
      }
    />
  ) : null;
}

export function Collapsible({ open, children, className = "", ...props }) {
  return (
    <div
      {...props}
      className={`animated-collapse ${open ? "is-open" : ""} ${className}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="animated-collapse-clip">{children}</div>
    </div>
  );
}

export function AnimatedDetails({ children, className = "" }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const parts = Children.toArray(children);
  const summary = parts.find((child) => child.type === "summary");
  return (
    <div className={className}>
      <button
        type="button"
        id={`${id}-trigger`}
        className="animated-details-toggle"
        aria-expanded={open}
        aria-controls={`${id}-content`}
        onClick={() => setOpen((previous) => !previous)}
      >
        {summary?.props.children}
        <ChevronDown
          size={16}
          className="animated-details-chevron"
          aria-hidden="true"
        />
      </button>
      <Collapsible
        id={`${id}-content`}
        aria-labelledby={`${id}-trigger`}
        open={open}
      >
        {parts.filter((child) => child !== summary)}
      </Collapsible>
    </div>
  );
}

// Keep panels mounted (and their form state intact) while easing the frame height.
export function SmoothHeight({ children, className = "" }) {
  const content = useRef(null);
  const [height, setHeight] = useState(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!("ResizeObserver" in window)) return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.height;
      if (next > 0) setHeight(next);
    });
    observer.observe(content.current);
    return () => observer.disconnect();
  }, []);
  return (
    <Motion.div
      className={`smooth-height ${className}`}
      initial={false}
      animate={{ height: height ?? "auto" }}
      transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div ref={content} className="smooth-height-content">
        {children}
      </div>
    </Motion.div>
  );
}
