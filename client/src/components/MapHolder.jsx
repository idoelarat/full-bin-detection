import React, { useEffect, useRef, useState, useCallback } from "react";
import DraggableObj from "./DraggableObj";

function MapHolder() {
  const mapHolderRef = useRef(null);
  const [bins, setBins] = useState([]);
  const [areas, setAreas] = useState([]); // New state to hold area data
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState(null);

  // Use useCallback to memoize the function and ensure it has access to the latest state
  const updateBinPosition = useCallback(
    async (binId, newX, newY) => {
      const binToUpdate = bins.find((bin) => bin.bin_id === binId);

      if (!binToUpdate) {
        console.error("Bin not found in state:", binId);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/bins/${binId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bin_desc: binToUpdate.bin_desc,
              area_id: binToUpdate.area_id,
              x: newX,
              y: newY,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setBins((currentBins) =>
          currentBins.map((bin) =>
            bin.bin_id === binId ? { ...bin, x: newX, y: newY } : bin
          )
        );
      } catch (error) {
        console.error("Error updating bin position:", error);
      }
    },
    [bins]
  );

  // useEffect for fetching bins
  useEffect(() => {
    fetch("http://localhost:3000/api/bins/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const sanitizedData = data.map((bin) => ({
          ...bin,
          x: typeof bin.x === "number" ? bin.x : 0,
          y: typeof bin.y === "number" ? bin.y : 0,
        }));
        setBins(sanitizedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bins:", error);
        setBins([]);
        setIsLoading(false);
      });
  }, []);

  // New useEffect for fetching areas
  useEffect(() => {
    fetch("http://localhost:3000/api/areas/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAreas(data);
        if (data.length > 0) {
          // Set the initial selected area ID to the first one in the list
          setSelectedAreaId(data[0].area_id);
        }
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
        setAreas([]);
      });
  }, []);

  const mapHolderStyle = {
    width: "700px",
    height: "600px",
    border: "2px solid black",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
  };

  // Wait for both bins and areas to be loaded
  if (isLoading || areas.length === 0) {
    return <div>Loading bins and areas...</div>;
  }

  // Filter the bins based on the selectedAreaId
  const filteredBins = selectedAreaId
    ? bins.filter((bin) => bin.area_id === selectedAreaId)
    : bins;

  return (
    <>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="area-select">Filter by Area: </label>
        <select
          id="area-select"
          value={selectedAreaId || ""}
          onChange={(e) => setSelectedAreaId(parseInt(e.target.value, 10))}
        >
          {areas.map((area) => (
            <option key={area.area_id} value={area.area_id}>
              {area.area_description}{" "}
              {/* This is where the area description is displayed */}
            </option>
          ))}
        </select>
      </div>
      <div
        ref={mapHolderRef}
        className="map-holder-container"
        style={mapHolderStyle}
      >
        {filteredBins.length > 0 ? (
          filteredBins.map((bin) => (
            <DraggableObj
              key={bin.bin_id}
              id={bin.bin_id}
              initialX={bin.x}
              initialY={bin.y}
              containerRef={mapHolderRef}
              onDragEnd={updateBinPosition}
            />
          ))
        ) : (
          <div>No bins found for this area.</div>
        )}
      </div>
    </>
  );
}

export default MapHolder;
