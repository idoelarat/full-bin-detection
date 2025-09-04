import { useState, useEffect, useCallback } from "react";

const useBins = (selectedAreaId, MAP_WIDTH, MAP_HEIGHT, BIN_SIZE_PIXELS) => {
  const [bins, setBins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastClickedBinId, setLastClickedBinId] = useState(null);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        setError(null);
        const response = await fetch("http://localhost:3000/api/bins/");
        if (!response.ok) {
          const t = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${t}`);
        }
        const data = await response.json();
        const sanitizedData = data.map((bin) => ({
          ...bin,
          x: typeof bin.x === "number" ? bin.x : 0,
          y: typeof bin.y === "number" ? bin.y : 0,
        }));
        setBins(sanitizedData);
      } catch (error) {
        console.error("Error fetching bins:", error);
        setError("Failed to load bins.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBins();
  }, []);

  const updateBinPosition = useCallback(async (binId, newX, newY) => {
    const binToUpdate = bins.find(bin => bin.bin_id === binId);
    if (!binToUpdate) {
      console.error("Bin not found in state:", binId);
      return;
    }
    
    try {
      setError(null);
      const response = await fetch(`http://localhost:3000/api/bins/${binId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bin_desc: binToUpdate.bin_desc, 
          area_id: binToUpdate.area_id,
          x: newX,
          y: newY,
        }),
      });
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      setBins(currentBins =>
        currentBins.map(bin =>
          bin.bin_id === binId ? { ...bin, x: newX, y: newY } : bin
        )
      );
    } catch (error) {
      console.error("Error updating bin position:", error);
      setError("Failed to update bin position.");
    }
  }, [bins]);
  
  const handleDeleteBin = useCallback(async () => {
    if (!lastClickedBinId) return;

    // We no longer use window.confirm here
    // The UI component calling this function should handle the confirmation
    
    try {
      setError(null);
      const response = await fetch(`http://localhost:3000/api/bins/${lastClickedBinId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      setBins(currentBins => currentBins.filter(bin => bin.bin_id !== lastClickedBinId));
      setLastClickedBinId(null);
    } catch (error) {
      console.error("Error deleting bin:", error);
      setError("Failed to delete bin.");
    }
  }, [lastClickedBinId]);

  const handleCreateNewBin = useCallback(async () => {
    if (!selectedAreaId) {
      // The UI component calling this function should handle the check
      console.warn("Please select an Area to create a new bin.");
      return;
    }
    
    const initialX = MAP_WIDTH / 2 - BIN_SIZE_PIXELS / 2;
    const initialY = MAP_HEIGHT / 2 - BIN_SIZE_PIXELS / 2;
    const newBinData = {
      area_id: selectedAreaId,
      bin_desc: "0",
      x: initialX,
      y: initialY,
    };

    try {
      setError(null);
      const response = await fetch("http://localhost:3000/api/bins/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBinData),
      });
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      const newBin = await response.json();
      setBins(currentBins => [...currentBins, newBin]);
      setLastClickedBinId(newBin.bin_id);
    } catch (error) {
      console.error("Error creating new bin:", error);
      setError("Failed to create new bin.");
    }
  }, [selectedAreaId, MAP_WIDTH, MAP_HEIGHT, BIN_SIZE_PIXELS]);

  const handleUpdateBinDesc = useCallback(async (newDesc) => {
    if (!lastClickedBinId) return;
    
    const binToUpdate = bins.find(bin => bin.bin_id === lastClickedBinId);
    if (!binToUpdate) return;
    
    try {
      setError(null);
      const response = await fetch(`http://localhost:3000/api/bins/${lastClickedBinId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...binToUpdate,
          bin_desc: newDesc,
        }),
      });
      if (!response.ok) {
        const t = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${t}`);
      }
      setBins(currentBins =>
        currentBins.map(bin =>
          bin.bin_id === lastClickedBinId ? { ...bin, bin_desc: newDesc } : bin
        )
      );
    } catch (error) {
      console.error("Error updating bin description:", error);
      setError("Failed to update bin description.");
    }
  }, [lastClickedBinId, bins]);

  return {
    bins,
    isLoading,
    error,
    lastClickedBinId,
    setLastClickedBinId,
    updateBinPosition,
    handleDeleteBin,
    handleCreateNewBin,
    handleUpdateBinDesc,
  };
};

export default useBins;
