// ./components/AreasSidebar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import AreaItem from "./AreaItem.jsx";

/**
 * Props:
 * - areas: Array<{ area_id: number, area_name?: string, area_description?: string, ... }>
 * - selectedId: number | null
 * - onSelect: (area_id: number) => void
 * - sortMode?: "name-asc" | "name-desc" | "id-asc" | "id-desc"
 */
export default function AreasSidebar({
  areas = [],
  selectedId = null,
  onSelect = () => {},
  sortMode = "name-asc",
}) {
  // Basic validation: must include area_id
  useEffect(() => {
    for (const a of areas) {
      if (!a || a.area_id == null) {
        console.warn("AreasSidebar: each item must include area_id:", a);
      }
    }
  }, [areas]);

  // Sorting logic
  const sorted = useMemo(() => {
    const copy = [...areas];

    const cmpNameAsc = (x, y) =>
      (x.area_name || "").localeCompare(y.area_name || "", "en", {
        numeric: true,
        sensitivity: "base",
      });
    const cmpNameDesc = (x, y) => -cmpNameAsc(x, y);

    const cmpIdAsc = (x, y) => (x.area_id ?? 0) - (y.area_id ?? 0);
    const cmpIdDesc = (x, y) => -cmpIdAsc(x, y);

    switch (sortMode) {
      case "name-desc":
        return copy.sort(cmpNameDesc);
      case "id-asc":
        return copy.sort(cmpIdAsc);
      case "id-desc":
        return copy.sort(cmpIdDesc);
      case "name-asc":
      default:
        return copy.sort(cmpNameAsc);
    }
  }, [areas, sortMode]);

  // Focus management
  const itemRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    const idx = sorted.findIndex((a) => a.area_id === selectedId);
    if (idx >= 0) setFocusIndex(idx);
  }, [selectedId, sorted]);

  useEffect(() => {
    if (sorted.length === 0) {
      setFocusIndex(0);
      return;
    }
    if (focusIndex > sorted.length - 1) {
      setFocusIndex(sorted.length - 1);
    }
  }, [sorted, focusIndex]);

  const handleKeyDown = (e) => {
    if (sorted.length === 0) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const next = (focusIndex + delta + sorted.length) % sorted.length;
      setFocusIndex(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusIndex(0);
      itemRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = sorted.length - 1;
      setFocusIndex(last);
      itemRefs.current[last]?.focus();
    } else if (e.key === "Enter") {
      const id = sorted[focusIndex]?.area_id;
      if (id != null) onSelect(id);
    }
  };

  return (
    <aside
      className="areas-sidebar"
      dir="rtl"
      role="listbox"
      aria-label="Areas"
      onKeyDown={handleKeyDown}
      style={{ maxHeight: "800px", overflowY: "auto" }}
    >
      {sorted.length === 0 ? (
        <div style={{ color: "black" }}>No areas</div>
      ) : (
        sorted.map((area, i) => {
          const id = Number(area.area_id ?? area.id);
          const isSelected = Number(selectedId) === id;
          return (
            <AreaItem
              key={id}
              area={area}
              isSelected={isSelected}
              onClick={() => onSelect(id)}
              tabIndex={i === focusIndex ? 0 : -1}
              buttonRef={(el) => (itemRefs.current[i] = el)}
            />
          );
        })
      )}
    </aside>
  );
}
