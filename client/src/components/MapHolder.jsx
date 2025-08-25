import React, { useRef, useEffect } from "react";
import DraggableObj from "./DraggableObj";
import AreasControlButtons from "./AreasControlButtons";
import AreasSidebar from "./AreasSidebar"; // New: Import AreasSidebar
import useBins from "../hooks/useBins";
import useAreas from "../hooks/useAreas";

// This CSS is added to support the new AreasSidebar and AreaItem components.
const styles = `
.map-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.areas-sidebar {
  width: 250px; /* fixed width for the sidebar */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
`;

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const BIN_SIZE_PIXELS = 50;

function MapHolder() {
  const mapHolderRef = useRef(null);
  const { 
    areas, 
    selectedAreaId, 
    setSelectedAreaId, 
    mapImage, 
    isLoading,
    createArea,
    deleteArea,
  } = useAreas();
  
  const {
    bins,
    lastClickedBinId,
    setLastClickedBinId,
    updateBinPosition,
    handleDeleteBin,
    handleCreateNewBin,
    handleUpdateBinDesc,
  } = useBins(selectedAreaId, MAP_WIDTH, MAP_HEIGHT, BIN_SIZE_PIXELS);
  
  useEffect(() => {
    if (areas.length > 0 && selectedAreaId === null) {
      setSelectedAreaId(areas[0].area_id);
    }
  }, [areas, selectedAreaId, setSelectedAreaId]);
  
  const mapHolderStyle = {
    width: `${MAP_WIDTH}px`,
    height: `${MAP_HEIGHT}px`,
    position: "relative",
    border: "2px solid black",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundImage: mapImage ? `url(${mapImage})` : 'none',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (isLoading) {
    return <div>Loading bins and areas...</div>;
  }
  
  const filteredBins = selectedAreaId 
    ? bins.filter(bin => bin.area_id === selectedAreaId) 
    : [];

  return (
    <>
      <style>{styles}</style>
      <div className="map-container">
        {/* New component for area controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AreasControlButtons
            onCreate={createArea}
            onDelete={deleteArea}
            hasAreas={areas.length > 0}
            deleteTargetId={selectedAreaId}
            deleteTargetArea={areas.find(a => a.area_id === selectedAreaId)}
          />

          {/* New AreasSidebar component */}
          <AreasSidebar
            areas={areas}
            selectedId={selectedAreaId}
            onSelect={setSelectedAreaId}
            sortMode="id-asc" // You can change this to "name-asc", "name-desc", or "id-desc"
          />
        </div>

        {/* The map view */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* The rest of your existing UI elements */}
            <button 
              onClick={handleDeleteBin}
              disabled={!lastClickedBinId}
              style={{ cursor: lastClickedBinId ? 'pointer' : 'not-allowed' }}
            >
              מחק פח
            </button>
            <button 
              onClick={handleCreateNewBin}
              disabled={!selectedAreaId}
              style={{ cursor: selectedAreaId ? 'pointer' : 'not-allowed' }}
            >
              צור פח
            </button>
            <button 
              onClick={() => handleUpdateBinDesc("0")}
              disabled={!lastClickedBinId}
              style={{ cursor: lastClickedBinId ? 'pointer' : 'not-allowed', backgroundColor: 'green', color: 'white' }}
            >
              פח ריק
            </button>
            <button 
              onClick={() => handleUpdateBinDesc("1")}
              disabled={!lastClickedBinId}
              style={{ cursor: lastClickedBinId ? 'pointer' : 'not-allowed', backgroundColor: 'red', color: 'white' }}
            >
              פח מלא
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
