import React, { useState, useRef, useEffect, useCallback } from "react";
import trashBinImage from '../assets/trash-bin.png';

// This is a "dumb" or presentational component responsible for a single UI element: a draggable bin.
// It receives all its data and behavior from its parent component via props.
function DraggableObj({ 
  id, 
  containerRef, 
  initialX,
  initialY,
  onDragEnd, 
  onBinClick, 
  isClicked, 
  binDesc,
  mapDimensions, // Added mapDimensions prop
}) {
  // A safety check to ensure initial coordinates are numbers, defaulting to 0 if not.
  const safeX = typeof initialX === 'number' ? initialX : 0;
  const safeY = typeof initialY === 'number' ? initialY : 0;

  // Manages the live position of the draggable object as the user moves it.
  const [position, setPosition] = useState({ x: safeX, y: safeY });
  // Tracks the dragging state to conditionally change cursor and z-index.
  const [isDragging, setIsDragging] = useState(false);

  // A ref to get a direct reference to the DOM element for calculating its position and dimensions.
  // It also stores the initial mouse position (startX, startY) relative to the object.
  const draggableRef = useRef(null);

  // Defines the original dimensions of the map for calculating relative positions.
  const ORIGINAL_MAP_WIDTH = 1000;
  const ORIGINAL_MAP_HEIGHT = 800;

  // This effect recalculates the bin's position whenever the map's dimensions change.
  // It uses the bin's initial pixel position to find its equivalent percentage position,
  // then converts that back to pixels based on the new map size.
  useEffect(() => {
    if (mapDimensions.width > 0 && mapDimensions.height > 0) {
      // Calculate the new position based on the ratio of the initial position to the original map size.
      const newX = (safeX / ORIGINAL_MAP_WIDTH) * mapDimensions.width;
      const newY = (safeY / ORIGINAL_MAP_HEIGHT) * mapDimensions.height;
      setPosition({ x: newX, y: newY });
    }
  }, [safeX, safeY, mapDimensions]); // Depend on initial coords and map dimensions

  // Determines the CSS filter to apply to the trash bin image based on its 'binDesc' value.
  // This changes the color of the bin (e.g., green for "0", red for "1").
  const binFilter = binDesc === "0"
    ? "invert(50%) sepia(100%) hue-rotate(90deg) saturate(200%)"
    : (binDesc === "1"
      ? "invert(20%) sepia(100%) saturate(1000%) hue-rotate(330deg)"
      : "none");

  // An object containing inline CSS styles for the draggable element's container.
  // Styles like position, cursor, and z-index are dynamic based on state.
  const objStyle = {
    position: "absolute",
    top: `${position.y}px`,
    left: `${position.x}px`,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 20 : 10,
    userSelect: "none",
    border: isClicked ? "2px dashed blue" : "none",
    width: "50px",
    height: "50px",
    boxSizing: "border-box",
  };

  // Inline styles for the trash bin image itself.
  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: binFilter,
  };

  // Handles the mouse down event to initiate dragging.
  const handleMouseDown = (e) => {
    // Prevents default browser drag-and-drop behavior and stops event from bubbling up.
    e.preventDefault();
    e.stopPropagation();

    // Sets the dragging state to true.
    setIsDragging(true);
    // Stores the initial mouse position relative to the element's top-left corner.
    draggableRef.current.startX = e.clientX - position.x;
    draggableRef.current.startY = e.clientY - position.y;
    // Calls the parent's function to update the `lastClickedBinId` state.
    onBinClick(id);
  };

  // Handles the mouse move event while dragging.
  const handleMouseMove = useCallback((e) => {
    // Stops if not dragging or if the refs are not available.
    if (!isDragging || !containerRef.current || !draggableRef.current) return;

    // Gets the dimensions and position of the container and the draggable object.
    const containerRect = containerRef.current.getBoundingClientRect();
    const objRect = draggableRef.current.getBoundingClientRect();

    // Calculates the new X and Y coordinates based on mouse movement.
    let newX = e.clientX - draggableRef.current.startX;
    let newY = e.clientY - draggableRef.current.startY;

    // Clamps the new position to ensure the object stays within the container's bounds.
    newX = Math.max(0, newX);
    newX = Math.min(newX, containerRect.width - objRect.width);
    newY = Math.max(0, newY);
    newY = Math.min(newY, containerRect.height - objRect.height);

    // Updates the local state with the new position.
    setPosition({ x: newX, y: newY });
  }, [containerRef, isDragging]);

  // Handles the mouse up event to end dragging.
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Resets the dragging state.
      setIsDragging(false);
      // Calls the parent's function with the final position to persist the changes to the database.
      onDragEnd(id, position.x, position.y);
    }
  }, [isDragging, id, position, onDragEnd]);

  // This effect manages adding and removing global event listeners.
  useEffect(() => {
    // Adds the mousemove and mouseup listeners to the entire document.
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // This cleanup function runs when the component unmounts.
    return () => {
      // Removes the event listeners to prevent memory leaks.
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  // Renders the draggable element.
  return (
    <div
      ref={draggableRef} // Attaches the ref to the div.
      style={objStyle} // Applies the dynamic styles.
      onMouseDown={handleMouseDown} // Starts the dragging process on click.
    >
      <img src={trashBinImage} alt="Trash Bin" style={imgStyle} />
    </div>
  );
}

export default DraggableObj;
