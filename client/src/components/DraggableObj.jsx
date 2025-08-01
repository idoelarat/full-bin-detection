import React, { useState, useRef, useEffect, useCallback } from "react";
import trashBinImage from '../assets/trash-bin.png';

function DraggableObj({ 
  id, 
  containerRef, 
  initialX,
  initialY,
  onDragEnd, 
  onBinClick, 
  isClicked, 
  binDesc,
}) {
  const safeX = typeof initialX === 'number' ? initialX : 0;
  const safeY = typeof initialY === 'number' ? initialY : 0;

  const [position, setPosition] = useState({ x: safeX, y: safeY });
  const [isDragging, setIsDragging] = useState(false);

  const draggableRef = useRef(null);

  const binFilter = binDesc === "0"
    ? "invert(50%) sepia(100%) hue-rotate(90deg) saturate(200%)"
    : (binDesc === "1"
      ? "invert(20%) sepia(100%) saturate(1000%) hue-rotate(330deg)"
      : "none");

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

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    filter: binFilter,
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
      // We no longer need to scale the position
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
    // This effect now directly uses the pixel values from the DB
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