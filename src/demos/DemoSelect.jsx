import {
  Children,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import "./DemoSelect.css";

// Shares the value/onChange interface of the demo's former native selects.
const DemoSelect = forwardRef(function DemoSelect(
  { children, value, onChange, onBlur, required, disabled, id, ...props },
  ref,
) {
  const trigger = useRef(null);
  const list = useRef(null);
  const generatedId = useId();
  const listId = `${id || generatedId}-options`;
  const options = Children.toArray(children).map((option) => ({
    value: String(option.props.value ?? option.props.children),
    label: option.props.children,
  }));
  const selected = options.findIndex(
    (option) => option.value === String(value),
  );
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(null);
  const search = useRef({ text: "", time: 0 });
  useImperativeHandle(ref, () => trigger.current);

  useLayoutEffect(() => {
    if (!open || disabled) return;
    function place() {
      const bounds = trigger.current.getBoundingClientRect();
      const width = Math.min(
        Math.max(bounds.width, 190),
        window.innerWidth - 24,
      );
      const below = window.innerHeight - bounds.bottom - 14;
      const above = bounds.top - 14;
      const desired = Math.min(options.length * 44 + 12, 280);
      const upwards = below < desired && above > below;
      const maxHeight = Math.max(44, Math.min(280, upwards ? above : below));
      setPosition({
        left: Math.max(
          12,
          Math.min(bounds.left, window.innerWidth - width - 12),
        ),
        width,
        maxHeight,
        ...(upwards
          ? { bottom: window.innerHeight - bounds.top + 6 }
          : { top: bounds.bottom + 6 }),
      });
    }
    place();
    const outside = (event) => {
      if (
        !trigger.current?.contains(event.target) &&
        !list.current?.contains(event.target)
      )
        setOpen(false);
    };
    const scroll = (event) => {
      if (!list.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [open, disabled, options.length]);
  useEffect(() => {
    if (!open || !position) return;
    const option = list.current?.children[active];
    if (!option) return;
    const menu = list.current;
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (
      option.offsetTop + option.offsetHeight >
      menu.scrollTop + menu.clientHeight
    )
      menu.scrollTop =
        option.offsetTop + option.offsetHeight - menu.clientHeight;
  }, [open, active, position]);

  function show(index = Math.max(0, selected)) {
    search.current = { text: "", time: 0 };
    setActive(index);
    setOpen(true);
  }
  function choose(index) {
    const option = options[index];
    if (!option) return;
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
    if (option.value !== String(value))
      onChange?.({
        target: { value: option.value },
        currentTarget: { value: option.value },
      });
  }
  function keyDown(event) {
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
      }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (event.key === "Home") {
        show(0);
        return;
      }
      if (event.key === "End") {
        show(options.length - 1);
        return;
      }
      if (!open) show();
      else
        setActive(
          (previous) =>
            (previous + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length,
        );
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else show();
      return;
    }
    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault();
      const normalize = (text) =>
        String(text)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const text =
        (Date.now() - search.current.time < 600 ? search.current.text : "") +
        normalize(event.key);
      search.current = { text, time: Date.now() };
      const match = options.findIndex((option) =>
        normalize(option.label).startsWith(text),
      );
      if (match >= 0) {
        setActive(match);
        setOpen(true);
      }
    }
  }
  return (
    <>
      <button
        {...props}
        id={id}
        ref={trigger}
        type="button"
        role="combobox"
        className={`demo-select-trigger ${props.className || ""}`}
        disabled={disabled}
        aria-required={required || undefined}
        aria-haspopup="listbox"
        aria-expanded={open && !disabled}
        aria-controls={open && !disabled ? listId : undefined}
        aria-activedescendant={
          open && !disabled ? `${listId}-${active}` : undefined
        }
        onKeyDown={keyDown}
        onClick={() => {
          if (open) setOpen(false);
          else show();
        }}
        onBlur={(event) => {
          setOpen(false);
          onBlur?.(event);
        }}
      >
        <span>{options[selected]?.label ?? "Selecciona una opción"}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open &&
        !disabled &&
        position &&
        createPortal(
          <div
            ref={list}
            id={listId}
            role="listbox"
            aria-label={props["aria-label"] || "Opciones disponibles"}
            className="demo-select-menu"
            style={position}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={selected === index}
                className={`demo-select-option ${active === index ? "is-active" : ""}`}
                onPointerDown={(event) => event.preventDefault()}
                onPointerMove={() => setActive(index)}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {selected === index && <Check size={15} aria-hidden="true" />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
});
export default DemoSelect;
