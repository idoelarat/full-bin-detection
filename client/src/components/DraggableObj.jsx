import React, { useState, useRef, useEffect, useCallback } from "react";
import trashBinImage from '../assets/trash-bin.png';

// The component now accepts the onDragEnd callback as a prop
function DraggableObj({ id, containerRef, initialX, initialY, onDragEnd }) {
  // Use a default value of 0 if initialX or initialY are not numbers
  const safeX = typeof initialX === 'number' ? initialX : 0;
  const safeY = typeof initialY === 'number' ? initialY : 0;

  const [position, setPosition] = useState({ x: safeX, y: safeY });
  const [isDragging, setIsDragging] = useState(false);

  const draggableRef = useRef(null);

  const objStyle = {
    position: "absolute",
    top: position.y,
    left: position.x,
    cursor: "grab",
    zIndex: 10,
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    draggableRef.current.startX = e.clientX - position.x;
    draggableRef.current.startY = e.clientY - position.y;
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
      // Call the onDragEnd prop to send the new position to the parent
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
      <img src={trashBinImage} alt="Trash Bin" style={{ width: '50px', height: '50px', pointerEvents: 'none' }} />
    </div>
  );
}

export default DraggableObj;