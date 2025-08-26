import React, { useRef, useEffect, useState } from "react";
import DraggableObj from "./DraggableObj";
import AreasControlButtons from "./AreasControlButtons";
import AreasSidebar from "./AreasSidebar";
import useBins from "../hooks/useBins";
import useAreas from "../hooks/useAreas";

// This CSS now uses a combination of properties for fluid, aspect-ratio-locked sizing.
const styles = `
.map-container {
    display: flex;
    gap: 20px;
    flex-direction: row-reverse; /* Default for desktop */
    flex-wrap: wrap; /* Allows elements to wrap on smaller screens */
    justify-content: center; /* Centers content when wrapped */
}

/* Media query for small screens (e.g., mobile devices) */
@media (max-width: 768px) {
    .map-container {
        flex-direction: column; /* Stack elements vertically */
        align-items: center; /* Center them horizontally */
    }
}

.areas-sidebar-wrapper {
    flex-shrink: 0;
    width: 250px; /* fixed width for the sidebar on desktop */
}

.areas-sidebar {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    box-sizing: border-box; /* Ensures padding and border are included in the width */
}

@media (max-width: 768px) {
    .areas-sidebar-wrapper {
        width: 100%; /* Take full width on mobile */
    }
}

.area-button {
    width: 100%;
    padding: 12px;
    border: 1px solid transparent;
    background-color: transparent;
    text-align: right;
    cursor: pointer;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    color: #333;
    transition: all 0.2s ease-in-out;
    border-radius: 6px;
    box-sizing: border-box;
}

.area-button:hover,
.area-button:focus {
    background-color: #e0e0e0;
    border-color: #ccc;
    outline: none;
}

.area-button.is-selected {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}

.area-button.is-selected:hover,
.area-button.is-selected:focus {
    background-color: #0056b3;
}

.container-button {
    margin-bottom: 8px;
    border-radius: 6px;
}

/*
The map holder container is now fluid within its max dimensions,
maintaining a 10:8 aspect ratio.
*/
.map-holder-container {
    width: 100%;
    max-width: 1000px;
    max-height: 800px;
    aspect-ratio: 1000 / 800;
    position: relative;
    border: 2px solid black;
    box-sizing: border-box;
    overflow: hidden;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.map-view-wrapper {
    flex: 1; /* This wrapper now also takes up the remaining space */
    display: flex;
    flex-direction: column;
    gap: 10px;
}
`;

const BIN_SIZE_PIXELS = 50;
const ORIGINAL_WIDTH = 1000;
const ORIGINAL_HEIGHT = 800;

function MapHolder() {
  const mapHolderRef = useRef(null);

  // State to hold the dynamic dimensions of the map container
  const [mapDimensions, setMapDimensions] = useState({
    width: ORIGINAL_WIDTH,
    height: ORIGINAL_HEIGHT,
  });

  const {
    areas,
    selectedAreaId,
    setSelectedAreaId,
    mapImage,
    isLoading,
    createArea,
    deleteArea,
  } = useAreas();

  // Pass the dynamic dimensions to the useBins hook
  const {
    bins,
    lastClickedBinId,
    setLastClickedBinId,
    updateBinPosition,
    handleDeleteBin,
    handleCreateNewBin,
    handleUpdateBinDesc,
  } = useBins(selectedAreaId, ORIGINAL_WIDTH, ORIGINAL_HEIGHT, BIN_SIZE_PIXELS);

  // Effect to update dimensions on component mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (mapHolderRef.current) {
        setMapDimensions({
          width: mapHolderRef.current.offsetWidth,
          height: mapHolderRef.current.offsetHeight,
        });
      }
    };

    // Set initial dimensions
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateDimensions);

    // Clean up event listener
    return () => window.removeEventListener("resize", updateDimensions);
  }, []); 

  useEffect(() => {
    if (areas.length > 0 && selectedAreaId === null) {
      setSelectedAreaId(areas[0].area_id);
    }
  }, [areas, selectedAreaId, setSelectedAreaId]);

  const mapHolderStyle = {
    backgroundImage: mapImage ? `url(${mapImage})` : "none",
  };

  if (isLoading) {
    return <div>Loading bins and areas...</div>;
  }

  const filteredBins = selectedAreaId
    ? bins.filter((bin) => bin.area_id === selectedAreaId)
    : [];

  // This is the new function that sets both states
  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setLastClickedBinId(null);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="map-container">
        {/* New wrapper for area controls to manage flex-sizing */}
        <div
          className="areas-sidebar-wrapper"
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <AreasControlButtons
            onCreate={createArea}
            onDelete={deleteArea}
            hasAreas={areas.length > 0}
            deleteTargetId={selectedAreaId}
            deleteTargetArea={areas.find((a) => a.area_id === selectedAreaId)}
          />

          {/* Updated AreasSidebar component with the new handler */}
          <AreasSidebar
            areas={areas}
            selectedId={selectedAreaId}
            onSelect={handleSelectArea}
            sortMode="id-asc"
          />
        </div>

        {/* The map view wrapper that will fill available space */}
        <div className="map-view-wrapper">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => handleUpdateBinDesc("0")}
              disabled={!lastClickedBinId}
              style={{
                cursor: lastClickedBinId ? "pointer" : "not-allowed",
                backgroundColor: "green",
                color: "white",
              }}
            >
              פח ריק
            </button>
            <button
              onClick={() => handleUpdateBinDesc("1")}
              disabled={!lastClickedBinId}
              style={{
                cursor: lastClickedBinId ? "pointer" : "not-allowed",
                backgroundColor: "red",
                color: "white",
              }}
            >
              פח מלא
            </button>
            <button
              onClick={handleDeleteBin}
              disabled={!lastClickedBinId}
              style={{ cursor: lastClickedBinId ? "pointer" : "not-allowed" }}
            >
              מחק פח
            </button>
            <button
              onClick={handleCreateNewBin}
              disabled={!selectedAreaId}
              style={{ cursor: selectedAreaId ? "pointer" : "not-allowed" }}
            >
              צור פח
            </button>
          </div>
          <div
            ref={mapHolderRef}
            className="map-holder-container"
            style={mapHolderStyle}
            onMouseDown={() => setLastClickedBinId(null)}
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
                  onBinClick={() => setLastClickedBinId(bin.bin_id)}
                  isClicked={bin.bin_id === lastClickedBinId}
                  binDesc={bin.bin_desc}
                  mapDimensions={mapDimensions}
                />
              ))
            ) : (
              <div>לא נמצאו פחים באיזור</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MapHolder;
