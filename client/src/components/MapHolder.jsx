import React, { useRef } from "react";
import DraggableObj from "./DraggableObj"; // Import the new component

function MapHolder() {
  const mapHolderRef = useRef(null); // Ref for the main square container

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
    <div ref={mapHolderRef} className="map-holder-container" style={mapHolderStyle}>
      {/* Render the DraggableObj component, passing the containerRef */}
      <DraggableObj
        initialX={50} // Optional: initial X position
        initialY={50} // Optional: initial Y position
        containerRef={mapHolderRef} // Pass the ref of the parent container
      />
      {/* You can add other elements here, e.g., your image */}
      {/* <img src={myImage} alt="Map Background" style={imageStyle} /> */}
    </div>
  );
}

export default MapHolder;