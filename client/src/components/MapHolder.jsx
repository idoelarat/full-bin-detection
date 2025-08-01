import React, { useEffect, useRef, useState } from "react";
import DraggableObj from "./DraggableObj"; // Import the new component

function MapHolder() {
  const mapHolderRef = useRef(null); // Ref for the main square container
  const [bins, setBins] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/bins/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setBins(data);
      })
      .catch((error) => {
        console.error("Error fetching bins:", error);
      });
  }, []);

  // Inline styles for the main square container
  const mapHolderStyle = {
    width: "700px",
    height: "600px",
    border: "2px solid black",
    boxSizing: "border-box",
    position: "relative", // Essential for absolute positioning of children
    overflow: "hidden", // Ensures children don't go outside
    // Removed display: flex, justifyContent, alignItems if you want flexible content
  };

  return (
    <div
      ref={mapHolderRef}
      className="map-holder-container"
      style={mapHolderStyle}
    >
      {/* Render the DraggableObj component, passing the containerRef */}
      {/* <DraggableObj
        containerRef={mapHolderRef} // Pass the ref of the parent container
      /> */}
      {bins && bins?.length > 0
        ? bins?.map((bin) => {
            return (
              <DraggableObj
                key={bin.bin_id}
                id={bin.bin_id}
                containerRef={mapHolderRef} // Pass the ref of the parent container
              />
            );
          })
        : null}
      {/* {allCarsLocations?.map(carLocation => {
        return (
          <MapboxGL.MarkerView
            key={carLocation.rechevBaMesimaId}
            coordinate={[carLocation.longitude, carLocation.latitude]}
            onTouchStart={() =>
              setLocationDetails({
                myCarId: carLocation.rechevBaMesimaId,
                ...missions.find(mission => mission?.RechevBaMesima.find(car => car.id === carLocation.rechevBaMesimaId)),
              })
            }
            anchor={{x: 0.5, y: 1}}>
            <Image
              source={
                useCurrentTaskStoreState?.task?.RechevBaMesima.find(car => car.id === carLocation.carId)
                  ? require(selectedTruckIcon)
                  : require('@/assets/images/track_user.png')
              }
              style={{width: 60, height: 60}}
              resizeMode="contain"
            />
          </MapboxGL.MarkerView>
        );
      })} */}
      {/* You can add other elements here, e.g., your image */}
      {/* <img src={myImage} alt="Map Background" style={imageStyle} /> */}
    </div>
  );
}

export default MapHolder;
