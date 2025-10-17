import React, { useState, useRef, useEffect, useCallback } from "react";
import trashBinImage from '../assets/trash-bin.png';

const BIN_SIZE_PIXELS = 50;
const ORIGINAL_MAP_WIDTH = 1000;
const ORIGINAL_MAP_HEIGHT = 800;

function DraggableObj({
  id,
  containerRef,
  initialX,
  initialY,
  onDragEnd,
  onBinClick,
  isClicked,
  binDesc,
  binSize = "Medium",
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const draggableRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const calculateSize = (selectedSize) => {
    let multiplier = 1;
    if (selectedSize === "Small") multiplier = 0.7;
    if (selectedSize === "Big") multiplier = 1.5;

    const binWidthPercent = ((BIN_SIZE_PIXELS * multiplier) / ORIGINAL_MAP_WIDTH) * 100;
    const binHeightPercent = ((BIN_SIZE_PIXELS * multiplier) / ORIGINAL_MAP_HEIGHT) * 100;

    return { width: binWidthPercent, height: binHeightPercent };
  };

  useEffect(() => {
    // Calculate position as a percentage of the original map dimensions
    const initialXPercent = (initialX / ORIGINAL_MAP_WIDTH) * 100;
    const initialYPercent = (initialY / ORIGINAL_MAP_HEIGHT) * 100;
    setPosition({ x: initialXPercent, y: initialYPercent });

    setSize(calculateSize(binSize));
  }, [initialX, initialY]);

  useEffect(() => {
    setSize(calculateSize(binSize));
  }, [binSize]);

  const binFilter =
    binDesc === "0"
      ? "invert(50%) sepia(100%) hue-rotate(90deg) saturate(200%)"
      : binDesc === "1"
      ? "invert(20%) sepia(100%) saturate(1000%) hue-rotate(330deg)"
      : "none";

  const objStyle = {
    position: "absolute",
    top: `${position.y}%`,
    left: `${position.x}%`,
    width: `${size.width}%`,
    height: `${size.height}%`,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 20 : 10,
    userSelect: "none",
    border: isClicked ? "2px dashed blue" : "none",
    boxSizing: "border-box",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    filter: binFilter,
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    const rect = draggableRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    onBinClick(id);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current || !draggableRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const objRect = draggableRef.current.getBoundingClientRect();

      let newX = e.clientX - containerRect.left - offsetRef.current.x;
      let newY = e.clientY - containerRect.top - offsetRef.current.y;

      newX = Math.max(0, Math.min(newX, containerRect.width - objRect.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - objRect.height));

      const newXPercent = (newX / containerRect.width) * 100;
      const newYPercent = (newY / containerRect.height) * 100;

      setPosition({ x: newXPercent, y: newYPercent });
    },
    [isDragging, containerRef]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      const finalX = (position.x / 100) * ORIGINAL_MAP_WIDTH;
      const finalY = (position.y / 100) * ORIGINAL_MAP_HEIGHT;

      onDragEnd(id, finalX, finalY);
    }
  }, [isDragging, id, onDragEnd, position, containerRef]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div ref={draggableRef} style={objStyle} onMouseDown={handleMouseDown}>
      <img src={trashBinImage} alt="Trash Bin" style={imgStyle} />
    </div>
  );
}

export default DraggableObj;