import { useEffect, useMemo, useState } from "react";
import "./App.css";
import AreasControlButtons from "./components/AreasControlButtons";

function App() {
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/areas");
      if (!res.ok) throw new Error(`GET /api/areas failed: ${res.status}`);
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);

      if (!data.some(a => a.area_id === selectedAreaId)) {
        setSelectedAreaId(data[0]?.area_id ?? null);
      }
    } catch (e) {
      setError(e.message || "Failed to load areas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAreas(); }, []);

  const handleCreate = async (newArea) => {
    setAreas(prev => [...prev, newArea]);
    setSelectedAreaId(newArea.area_id ?? null);
    await loadAreas();
  };

  const handleDelete = async (areaId) => {
    setAreas(prev => {
      const next = prev.filter(a => a.area_id !== areaId);

      const nextSelected =
        next.length
          ? next.reduce((maxId, a) => (a.area_id > maxId ? a.area_id : maxId), next[0].area_id)
          : null;
      setSelectedAreaId(nextSelected);
      return next;
    });
    await loadAreas();
  };

  const selectedArea = useMemo(
    () => areas.find(a => a.area_id === selectedAreaId) ?? null,
    [areas, selectedAreaId]
  );

  const latestArea = useMemo(() => {
    if (areas.length === 0) return null;
    return areas.reduce((max, a) => (a.area_id > (max?.area_id ?? -Infinity) ? a : max), null);
  }, [areas]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Full Bin Detection System</h1>

      {isLoading && <p>Loading areas…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      <AreasControlButtons
        onCreate={handleCreate}
        onDelete={handleDelete}
        hasAreas={areas.length > 0}                 
        deleteTargetId={latestArea?.area_id ?? null} 
        deleteTargetArea={latestArea}               
      />
    </div>
  );
}

export default App;
