// ./components/areas/AreasSidebar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import AreaItem from "./AreaItem.jsx";

/**
 * Props:
 * - areas: Array<{ area_id: number, area_description: string, ... }>
 * - selectedId: number | null
 * - onSelect: (area_id: number) => void
 * - sortMode?: "description-asc" | "description-desc" | "id-asc" | "id-desc"
 */
export default function AreasSidebar({
  areas = [],
  selectedId = null,
  onSelect = () => {},
  sortMode = "description-asc",
}) {
  // Basic validation: area_description is required
  useEffect(() => {
    for (const a of areas) {
      if (
        !a ||
        a.area_id == null ||
        typeof a.area_description !== "string" ||
        !a.area_description.trim()
      ) {
        // Don't stop the app, just warn to show what's missing
        console.warn(
          "AreasSidebar: Each item must include area_id and a non-empty area_description:",
          a
        );
      }
    }
  }, [areas]);

  // Sort based on sortMode, without modifying the original array
  const sorted = useMemo(() => {
    const copy = [...areas];
    const cmpDescAsc = (x, y) =>
      x.area_description.localeCompare(y.area_description, "he", {
        numeric: true,
        sensitivity: "base",
      });
    const cmpDescDesc = (x, y) => -cmpDescAsc(x, y);
    const cmpIdAsc = (x, y) => (x.area_id ?? 0) - (y.area_id ?? 0);
    const cmpIdDesc = (x, y) => -cmpIdAsc(x, y);

    switch (sortMode) {
      case "description-desc":
        return copy.sort(cmpDescDesc);
      case "id-asc":
        return copy.sort(cmpIdAsc);
      case "id-desc":
        return copy.sort(cmpIdDesc);
      case "description-asc":
      default:
        return copy.sort(cmpDescAsc);
    }
  }, [areas, sortMode]);

  // Manage focus (roving tabindex): ↑/↓ moves focus, Enter selects
  const itemRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  // When selectedId changes externally – update the focus to the selected item (if it exists)
  useEffect(() => {
    const idx = sorted.findIndex((a) => a.area_id === selectedId);
    if (idx >= 0) {
      setFocusIndex(idx);
      // Don't force automatic focus to avoid "jumping" for the user; just update the index
    }
  }, [selectedId, sorted]);

  // If the list changes (sorting/data) ensure the index is valid
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
        <div style={{color:'black'}}>אין אזורים</div>
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
