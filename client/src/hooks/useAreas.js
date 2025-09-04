import { useState, useEffect, useCallback } from "react";

const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetchAreas function.
  const fetchAreas = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:3000/api/areas/");
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      // Check for an empty response body before parsing
      const data = response.status === 204 ? [] : await response.json();
      setAreas(data);
      if (data.length > 0) {
        // Keep the selection if it still exists, otherwise select the first area.
        setSelectedAreaId(prevId => data.some(area => area.area_id === prevId) ? prevId : data[0].area_id);
      } else {
        setSelectedAreaId(null);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      setError("Failed to load areas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an area by performing a PUT request and then updating the local state.
  const updateArea = async (areaId, payload) => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:3000/api/areas/${areaId}`, {
        method: "PUT", // Changed to PUT to match the server
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`PUT /api/areas/${areaId} failed: ${res.status} - ${t}`);
      }

      // OPTIMISTIC UPDATE: Update the local state directly without re-fetching all areas.
      setAreas(prevAreas => 
        prevAreas.map(area =>
          area.area_id === areaId ? { ...area, ...payload } : area
        )
      );
      
      return true;
    } catch (err) {
      console.error("Update area failed:", err);
      setError("Failed to update area.");
      throw err;
    }
  };

  // Refactored to use an optimistic update after a successful create operation.
  const createArea = async (payload) => {
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/areas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (res.status === 409) {
          const t = await res.text().catch(() => "Duplicate area name.");
          throw new Error(`Conflict: ${t}`);
        }
        const t = await res.text().catch(() => "");
        throw new Error(`POST /api/areas failed: ${res.status} ${t}`);
      }
      // Optimistically add the new area to the state
      const createdArea = await res.json();
      setAreas(prevAreas => [...prevAreas, createdArea]);
      // Select the newly created area
      setSelectedAreaId(createdArea.area_id);
      return createdArea;
    } catch (err) {
      console.error("Create area failed:", err);
      setError("Failed to create area.");
      throw err;
    }
  };

  // Refactored to use an optimistic update after a successful delete operation.
  const deleteArea = async (areaId) => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:3000/api/areas/${areaId}`, {
        method: "DELETE",
      });
      if (res.status === 409) {
        const t = await res.text().catch(() => "Cannot delete area because it has bins.");
        throw new Error(`Conflict: ${t}`);
      }
      if (!res.ok && res.status !== 204) {
        const t = await res.text().catch(() => "");
        throw new Error(`DELETE /api/areas/${areaId} failed: ${res.status} ${t}`);
      }
      // Optimistically remove the deleted area from the state
      setAreas(prevAreas => prevAreas.filter(area => area.area_id !== areaId));
      // Deselect the area if it was the selected one
      if (selectedAreaId === areaId) {
        setSelectedAreaId(null);
      }
      return true;
    } catch (err) {
      console.error("Delete area failed:", err);
      setError("Failed to delete area.");
      throw err;
    }
  };

  // Fetch areas on initial render
  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  // Update map image when selected area changes
  useEffect(() => {
    if (selectedAreaId && areas.length > 0) {
      const selectedArea = areas.find((area) => area.area_id === selectedAreaId);
      if (selectedArea && selectedArea.img_path) {
        setMapImage(selectedArea.img_path);
      } else {
        setMapImage(null);
      }
    } else {
      setMapImage(null);
    }
  }, [selectedAreaId, areas]);

  return {
    areas,
    selectedAreaId,
    setSelectedAreaId,
    mapImage,
    isLoading,
    error,
    createArea,
    deleteArea,
    updateArea, // Return the new update function
    refreshAreas: fetchAreas, // Also return fetchAreas as a named refresh function for convenience
  };
};

export default useAreas;
