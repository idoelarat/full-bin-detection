import React, { useEffect, useRef, useState, useCallback } from "react";
import DraggableObj from "./DraggableObj";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;
const BIN_SIZE_PIXELS = 50;

const areaImages = import.meta.glob('../assets/areas/*.(png|jpg|jpeg|gif|svg|webp)', { eager: true });
console.log("Files found by Vite:", areaImages);

function MapHolder() {
  const mapHolderRef = useRef(null);
  const [bins, setBins] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [lastClickedBinId, setLastClickedBinId] = useState(null);
  const [mapImage, setMapImage] = useState(null);

  const updateBinPosition = useCallback(async (binId, newX, newY) => {
    const binToUpdate = bins.find(bin => bin.bin_id === binId);
    if (!binToUpdate) {
      console.error("Bin not found in state:", binId);
      return;
    }
    
    try {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBins(currentBins =>
        currentBins.map(bin =>
          bin.bin_id === binId ? { ...bin, x: newX, y: newY } : bin
        )
      );
    } catch (error) {
      console.error("Error updating bin position:", error);
    }
  }, [bins]);
  
  const handleDeleteBin = useCallback(async () => {
    if (!lastClickedBinId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this bin?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/bins/${lastClickedBinId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBins(currentBins => currentBins.filter(bin => bin.bin_id !== lastClickedBinId));
      setLastClickedBinId(null);
    } catch (error) {
      console.error("Error deleting bin:", error);
    }
  }, [lastClickedBinId]);

  const handleCreateNewBin = useCallback(async () => {
    if (!selectedAreaId) {
      alert("Please select an Area to create a new bin.");
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
      const response = await fetch("http://localhost:3000/api/bins/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBinData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newBin = await response.json();
      setBins(currentBins => [...currentBins, newBin]);
      setLastClickedBinId(newBin.bin_id);
    } catch (error) {
      console.error("Error creating new bin:", error);
    }
  }, [selectedAreaId]);

  const handleUpdateBinDesc = useCallback(async (newDesc) => {
    if (!lastClickedBinId) return;
    
    const binToUpdate = bins.find(bin => bin.bin_id === lastClickedBinId);
    if (!binToUpdate) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/bins/${lastClickedBinId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...binToUpdate,
          bin_desc: newDesc,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setBins(currentBins =>
        currentBins.map(bin =>
          bin.bin_id === lastClickedBinId ? { ...bin, bin_desc: newDesc } : bin
        )
      );
    } catch (error) {
      console.error("Error updating bin description:", error);
    }
  }, [lastClickedBinId, bins]);

  useEffect(() => {
    fetch("http://localhost:3000/api/bins/")
      .then((response) => response.json())
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
  
  useEffect(() => {
    fetch("http://localhost:3000/api/areas/")
      .then((response) => response.json())
      .then((data) => {
        setAreas(data);
        if (data.length > 0) {
          setSelectedAreaId(data[0].area_id);
        }
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
        setAreas([]);
      });
  }, []);
  
  useEffect(() => {
    if (selectedAreaId && areas.length > 0) {
      const selectedArea = areas.find(area => area.area_id === selectedAreaId);
      
      console.log("Selected Area Data:", selectedArea);
      
      if (selectedArea && selectedArea.img_path) {
        const filename = selectedArea.img_path.split(/[\\/]/).pop();
        
        console.log("Extracted Filename:", filename);

        const imagePath = `../assets/areas/${filename}`;
        const imageModule = areaImages[imagePath];
        
        console.log("Imported Image Module:", imageModule);

        if (imageModule) {
          setMapImage(imageModule.default);
        } else {
          console.error(`Image with filename '${filename}' not found in assets.`);
          setMapImage(null);
        }
      } else {
        setMapImage(null);
      }
    }
  }, [selectedAreaId, areas]);

  const mapHolderStyle = {
        width: `${MAP_WIDTH}px`,
    height: `${MAP_HEIGHT}px`,
    position: "relative",
    border: "2px solid black",
    boxSizing: "border-box",
    overflow: "hidden",
    backgroundImage: mapImage ? `url(${mapImage})` : 'none',
    
    // Change this line:
    backgroundSize: 'contain',
    
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  if (isLoading || areas.length === 0) {
    return <div>Loading bins and areas...</div>;
  }
  
  const filteredBins = selectedAreaId 
    ? bins.filter(bin => bin.area_id === selectedAreaId) 
    : bins;

  return (
    <>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div>
          <label htmlFor="area-select">בחר איזור: </label>
          <select
            id="area-select"
            value={selectedAreaId || ''}
            onChange={(e) => {
                setLastClickedBinId(null);
                setSelectedAreaId(parseInt(e.target.value, 10));
              }
            }
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
              // The responsive props are no longer passed
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