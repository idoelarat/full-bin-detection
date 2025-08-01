import React, { useState, useRef, useEffect, useCallback } from "react";
import trashBinImage from '../assets/trash-bin.png';

function DraggableObj({ id, containerRef, initialX, initialY, onDragEnd, onBinClick, isClicked, binDesc }) {
  const safeX = typeof initialX === 'number' ? initialX : 0;
  const safeY = typeof initialY === 'number' ? initialY : 0;

  const [position, setPosition] = useState({ x: safeX, y: safeY });
  const [isDragging, setIsDragging] = useState(false);

  const draggableRef = useRef(null);

  // Define the filter to apply based on the binDesc
  const binFilter = binDesc === "0"
    ? "invert(50%) sepia(100%) hue-rotate(90deg) saturate(200%)" // Green filter
    : (binDesc === "1"
      ? "invert(20%) sepia(100%) saturate(1000%) hue-rotate(330deg)" // Red filter
      : "none"); // No filter for other values

  const objStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 20 : 10,
    userSelect: "none",
    border: isClicked ? "2px dashed blue" : "none",
    width: "50px",
    height: "50px",
    boxSizing: "border-box",
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: binFilter, // Apply the color filter here
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    draggableRef.current.startX = e.clientX - position.x;
    draggableRef.current.startY = e.clientY - position.y;
    onBinClick(id);
  };

  const handleMouseMove = useCallback((e) => {
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
  }, [containerRef, isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd(id, position.x, position.y);
    }
  }, [isDragging, id, position, onDragEnd]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  return (
    <div
      ref={draggableRef}
      style={objStyle}
      onMouseDown={handleMouseDown}
    >
      <img src={trashBinImage} alt="Trash Bin" style={imgStyle} />
    </div>
  );
}

export default DraggableObj;