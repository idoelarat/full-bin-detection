import React, { useEffect, useMemo, useRef, useState } from "react";
import AreaItem from "./AreaItem.jsx";

export default function AreasSidebar({
  areas = [],
  selectedId = null,
  onSelect = () => {},
  onUpdate = () => {},
  sortMode = "name-asc",
}) {
  // A state to manage the currently edited area's ID
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

<<<<<<< HEAD
  
  
=======
  // This effect ensures that if the 'areas' prop changes while we are editing,
  // we update our local editing state to reflect the latest data.
  // This is a defensive measure to prevent old data from being shown in the form.
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
  useEffect(() => {
    if (editingId) {
      const areaToEdit = areas.find(area => area.area_id === editingId);
      if (areaToEdit) {
        setEditingName(areaToEdit.area_name || "");
        setEditingDesc(areaToEdit.area_description || "");
      } else {
        // If the area was deleted while we were editing, cancel the edit.
        setEditingId(null);
      }
    }
  }, [areas, editingId]);

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

  // Function to start editing
  const handleEditClick = (area) => {
    setEditingId(area.area_id);
    setEditingName(area.area_name || "");
    setEditingDesc(area.area_description || "");
  };

  // Function to save the changes
  const handleSaveEdit = async () => {
    if (editingId != null) {
      try {
        await onUpdate(editingId, {
          area_name: editingName,
          area_description: editingDesc,
        });
        setEditingId(null);
      } catch (err) {
        console.error("Failed to save area:", err);
      }
    }
  };

  // Function to cancel the edit
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <aside
      className="areas-sidebar"
      dir="ltr"
      role="listbox"
      aria-label="Areas"
      onKeyDown={handleKeyDown}
      style={{ maxHeight: "800px", overflowY: "auto"}}
    >
      {sorted.length === 0 ? (
        <div style={{ fontFamily: "Fira Sans" , color:'#FF4F0F' }}>No areas</div>

      ) : (
        sorted.map((area, i) => {
          const id = Number(area.area_id ?? area.id);
          const isSelected = Number(selectedId) === id;
          
          if (editingId === id) {
            // Show the edit form
            return (
              <div key={id} className="area-edit-form">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <textarea
                  value={editingDesc}
                  onChange={(e) => setEditingDesc(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            );
          }

          return (
            <AreaItem
              key={id}
              area={area}
              isSelected={isSelected}
              onClick={() => onSelect(id)}
              onDoubleClick={() => handleEditClick(area)}
              tabIndex={i === focusIndex ? 0 : -1}
              buttonRef={(el) => (itemRefs.current[i] = el)}
            />
          );
        })
      )}
    </aside>
  );
}
