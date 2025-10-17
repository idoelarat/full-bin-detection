import React from "react";
import "./InfoBox.css";

const InfoBox = ({
  height,
  width,
  text,            
  textSize = "16px",
  borderSize = "2px",
  borderColor = "#333",
  backgroundColor ="fff",
  boxShadow,
  
}) => {
  return (
    <div
      className="info-box"
      style={{
        height,
        width,
        color: 'white' ,
        fontSize: textSize,
        border: `${borderSize} solid ${borderColor}`,
        background:  `${backgroundColor}` ,
        boxShadow:  `0 0 0 2px ${boxShadow} ` ,
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
