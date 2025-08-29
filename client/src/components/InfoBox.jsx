//InfoBox.jsx
import React from "react";

const InfoBox = ({
  height,
  width,
  text,
  textColor = "#000",
  textSize = "16px",
  borderSize = "2px",
  borderColor = "#333",
  isFull = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 500,
        height,
        width,
        color: textColor,
        fontSize: textSize,
        border: `${borderSize} solid ${isFull ? "#c62828" : borderColor}`,
        background: isFull ? "#fff5f5" : undefined,
        boxShadow: isFull ? "0 0 0 2px rgba(198,40,40,0.2)" : "none",
        borderRadius: "8px",
        boxSizing: "border-box",
        padding: "8px",
        transition: "border-color .2s, box-shadow .2s, background .2s",
      }}
    >
      {text}
    </div>
  );
};

export default InfoBox;