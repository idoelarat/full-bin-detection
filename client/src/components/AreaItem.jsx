// ./components/areas/AreaItem.jsx
import React from "react";

/**
 * Props:
 * - area: { area_id: number, area_name: string, area_description: string, ... }
 * - isSelected: boolean
 * - onClick: () => void
 * - tabIndex?: number     // For default 0/-1 based on Sidebar
 * - buttonRef?: (el: HTMLButtonElement | null) => void
 */
export default function AreaItem({
  area,
  isSelected = false,
  onClick,
  tabIndex = -1,
  buttonRef,
}) {
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "right",
          }}
        >
          <span
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              color: isSelected ? "#fff" : "#333",
            }}
          >
            {area.area_name}
          </span>
          <span
            style={{ fontSize: "0.8em", color: isSelected ? "#fff" : "#666" }}
          >
            {area.area_description}
          </span>
        </div>
      </button>
    </div>
  );
}