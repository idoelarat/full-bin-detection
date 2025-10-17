import React, { useRef, useEffect, useState } from "react";
import DraggableObj from "./DraggableObj";
import AreasControlButtons from "./AreasControlButtons";
import AreasSidebar from "./AreasSidebar";
import useBins from "../hooks/useBins";
import useAreas from "../hooks/useAreas";
import InfoAreas from "./InfoAreas";
import "../styles/MapHolder.css";

const BIN_SIZE_PIXELS = 50;
const ORIGINAL_WIDTH = 1000;
const ORIGINAL_HEIGHT = 800;

function MapHolder() {
  const mapHolderRef = useRef(null);
  const [mapDimensions, setMapDimensions] = useState({
    width: ORIGINAL_WIDTH,
    height: ORIGINAL_HEIGHT,
  });

<<<<<<< HEAD

  const [sizeByArea, setSizeByArea] = useState({});
=======
  // 🆕 state לניהול גודל הפחים
  const [binSize, setBinSize] = useState("Medium");
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f

  const {
    areas,
    selectedAreaId,
    setSelectedAreaId,
    mapImage,
    isLoading,
    createArea,
    deleteArea,
    updateArea,
  } = useAreas();

  const {
    bins,
    lastClickedBinId,
    setLastClickedBinId,
    updateBinPosition,
    handleDeleteBin,
    handleCreateNewBin,
    handleUpdateBinDesc,
  } = useBins(selectedAreaId, ORIGINAL_WIDTH, ORIGINAL_HEIGHT, BIN_SIZE_PIXELS);

  useEffect(() => {
    const updateDimensions = () => {
      if (mapHolderRef.current) {
        setMapDimensions({
          width: mapHolderRef.current.offsetWidth,
          height: mapHolderRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (areas.length > 0 && selectedAreaId === null) {
      setSelectedAreaId(areas[0].area_id);
    }
  }, [areas, selectedAreaId, setSelectedAreaId]);

  const filteredBins = selectedAreaId
    ? bins.filter((bin) => bin.area_id === selectedAreaId)
    : [];

  const handleSelectArea = (areaId) => {
    setSelectedAreaId(areaId);
    setLastClickedBinId(null);
  };

<<<<<<< HEAD

  const handleSizeChangeForSelectedArea = (newSize) => {
    if (!selectedAreaId) return;
    setSizeByArea((prev) => ({ ...prev, [selectedAreaId]: newSize }));
  };

=======
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
  if (isLoading) {
    return <div>Loading bins and areas...</div>;
  }

  const selectedArea = areas.find((area) => area.area_id === selectedAreaId);

  return (
    <div className="map-container">
      <div className="left-side-container">
        <div className="areas-sidebar-wrapper">
          <AreasControlButtons
            onCreate={createArea}
            onDelete={deleteArea}
            onEdit={updateArea}
            hasAreas={areas.length > 0}
            deleteTargetId={selectedAreaId}
            deleteTargetArea={areas.find((a) => a.area_id === selectedAreaId)}
<<<<<<< HEAD

            onSizeChange={handleSizeChangeForSelectedArea}
=======
            onSizeChange={setBinSize}   
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
          />
          <AreasSidebar
            areas={areas}
            selectedId={selectedAreaId}
            onSelect={handleSelectArea}
            onUpdate={updateArea}
            sortMode="name-asc"
          />
        </div>
        <div className="map-buttons-wrapper">
          <button
            className="mui-button-style full-bin"
            onClick={() => handleUpdateBinDesc("1")}
            disabled={!lastClickedBinId}
          >
            Full Bin
          </button>
          <button
            className="mui-button-style empty-bin"
            onClick={() => handleUpdateBinDesc("0")}
            disabled={!lastClickedBinId}
          >
            Empty Bin
          </button>
          <button
            className="mui-button-style delete-bin"
            onClick={handleDeleteBin}
            disabled={!lastClickedBinId}
          >
            Delete Bin
          </button>
          <button
            className="mui-button-style create-bin"
            onClick={handleCreateNewBin}
            disabled={!selectedAreaId}
          >
            Create Bin
          </button>
        </div>
      </div>

      <div className="map-view-wrapper">
        <div className="info-area-row">
          <div className="area-name-column">
            {selectedArea && <h1>{selectedArea.area_name}</h1>}
            {selectedArea && <h2>{selectedArea.area_description}</h2>}
          </div>
          <div className="info-box-column">
            <InfoAreas filteredBins={filteredBins} />
          </div>
        </div>
        <div
          ref={mapHolderRef}
          className="map-holder-container"
          style={{
            backgroundImage: mapImage ? `url(${mapImage})` : "none",
          }}
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
                originalWidth={ORIGINAL_WIDTH}
                originalHeight={ORIGINAL_HEIGHT}
<<<<<<< HEAD
                
                binSize={sizeByArea[bin.area_id] ?? "Medium"}
=======
                binSize={binSize}  
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
              />
            ))
          ) : (
            <div id="noBins">No bins found in this area</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MapHolder;
