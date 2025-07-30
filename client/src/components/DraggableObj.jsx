// src/components/DraggableObj.jsx
import React, { useState, useRef, useEffect } from "react";
// Import your trash-bin.png image
import trashBinImage from '../assets/trash-bin.png'; // Make sure the path is correct

function DraggableObj({ initialX, initialY, containerRef }) {
  const [position, setPosition] = useState({ x: initialX || 0, y: initialY || 0 });
  const [isDragging, setIsDragging] = useState(false);

  const draggableRef = useRef(null);

  const objStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
    // Remove padding, background, border, and border-radius as these are for buttons
    // If you want a background or border for the draggable area around the image, you can add it here
    cursor: "grab",
    zIndex: 10,
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // Adjust width and height as needed for your image or let the image size dictate it
    // width: '50px',
    // height: '50px',
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    draggableRef.current.startX = e.clientX - position.x;
    draggableRef.current.startY = e.clientY - position.y;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current || !draggableRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const objRect = draggableRef.current.getBoundingClientRect();

    let newX = e.clientX - draggableRef.current.startX;
    let newY = e.clientY - draggableRef.current.startY;

    newX = Math.max(0, newX);
    newX = Math.min(newX, containerRect.width - objRect.width);
    newY = Math.max(0, newY);
    newY = Math.min(newY, containerRect.height - objRect.height);

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, position, containerRef]);

  return (
    <div
      ref={draggableRef}
      style={objStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Render the trash-bin.png image */}
      <img src={trashBinImage} alt="Trash Bin" style={{ width: '50px', height: '50px', pointerEvents: 'none' }} />
      {/* The children prop is no longer directly used for content if you're always showing the image.
          You could use it for an overlay or additional content if needed. */}
    </div>
  );
}

export default DraggableObj;