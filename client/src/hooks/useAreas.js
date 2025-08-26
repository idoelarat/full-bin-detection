// src/hooks/useAreas.js

import { useState, useEffect } from "react";

const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [mapImage, setMapImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all areas from the API
  const fetchAreas = async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:3000/api/areas/");
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      const data = await response.json();
      setAreas(data);
      if (data.length > 0) {
        setSelectedAreaId(data[0].area_id);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      setError("Failed to load areas.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create a new area
  const createArea = async (payload) => {
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/areas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`POST /api/areas failed: ${res.status} ${t}`);
      }
      const createdArea = await res.json();
      // Update state with the newly created area and select it
      setAreas((currentAreas) => [...currentAreas, createdArea]);
      setSelectedAreaId(createdArea.area_id);
      return createdArea;
    } catch (err) {
      console.error("Create area failed:", err);
      setError("Failed to create area.");
      throw err; // Re-throw the error so the component can handle UI feedback
    }
  };

  // Function to delete an area
  const deleteArea = async (areaId) => {
    try {
      setError(null);
      const res = await fetch(`http://localhost:3000/api/areas/${areaId}`, {
        method: "DELETE",
      });
      if (res.status === 409) {
        const t = await res
          .text()
          .catch(() => "Cannot delete area because it has bins.");
        throw new Error(`Conflict: ${t}`);
      }
      if (!res.ok && res.status !== 204) {
        const t = await res.text().catch(() => "");
        throw new Error(`DELETE /api/areas/${areaId} failed: ${res.status} ${t}`);
      }
      // Update state by removing the deleted area
      setAreas((currentAreas) => {
        const newAreas = currentAreas.filter((area) => area.area_id !== areaId);
        // Re-select an area if the deleted one was selected
        if (selectedAreaId === areaId) {
          setSelectedAreaId(newAreas.length > 0 ? newAreas[0].area_id : null);
        }
        return newAreas;
      });
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
  }, []);

  // Update map image when selected area changes
  useEffect(() => {
    if (selectedAreaId && areas.length > 0) {
      const selectedArea = areas.find((area) => area.area_id === selectedAreaId);
      if (selectedArea && selectedArea.img_path) {
        // Use the img_path directly as the URL
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
  };
};

export default useAreas;