// ./components/areas/AreaItem.jsx
import React from "react";

/**
 * Props:
 * - area: { area_id: number, area_name: string, ... }
 * - isSelected: boolean
 * - onClick: () => void
 * - tabIndex?: number        // לברירת מחדל 0/-1 לפי Sidebar
 * - buttonRef?: (el: HTMLButtonElement | null) => void
 */
export default function AreaItem({ area, isSelected = false, onClick, tabIndex = -1, buttonRef }) {
  return (
    <div className={`container-button${isSelected ? " is-selected" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`area-button${isSelected ? " is-selected" : ""}`}
        onClick={onClick}
        aria-pressed={isSelected}
        role="option"
        aria-selected={isSelected}
        tabIndex={tabIndex}
      >
        {area.area_name}
      </button>
    </div>
  );
}
