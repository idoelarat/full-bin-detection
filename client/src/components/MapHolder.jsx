import React, { useRef, useEffect } from "react";
import DraggableObj from "./DraggableObj";
import AreasControlButtons from "./AreasControlButtons"; // The new import
import useBins from "../hooks/useBins";
import useAreas from "../hooks/useAreas";

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
    createArea, // New: from the updated useAreas hook
    deleteArea, // New: from the updated useAreas hook
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

  // This useEffect ensures the first area is automatically selected
  // when the list of areas is loaded or a new area is created.
  useEffect(() => {
    // Check if there are areas and if no area is currently selected.
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

  // Only show loading message while data is being fetched
  if (isLoading) {
    return <div>Loading bins and areas...</div>;
  }

  const filteredBins = selectedAreaId
    ? bins.filter(bin => bin.area_id === selectedAreaId)
    : [];

  return (
    <>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* New component for area controls */}
        <AreasControlButtons
          onCreate={createArea}
          onDelete={deleteArea}
          hasAreas={areas.length > 0}
          deleteTargetId={selectedAreaId}
          deleteTargetArea={areas.find(a => a.area_id === selectedAreaId)}
        />

        {/* The rest of your existing UI elements */}
        <div>
          <label htmlFor="area-select">בחר איזור: </label>
          <select
            id="area-select"
            value={selectedAreaId || ''}
            onChange={(e) => {
              setLastClickedBinId(null);
              setSelectedAreaId(parseInt(e.target.value, 10));
            }}
          >
            {areas.map(area => (
              <option key={area.area_id} value={area.area_id}>
                {area.area_description}
              </option>
            ))}
          </select>
        </div>
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
    </>
  );
}

export default MapHolder;
