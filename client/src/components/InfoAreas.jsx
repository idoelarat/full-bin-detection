import React from "react"
import InfoBox from "./InfoBox";
const InfoAreas = ({filteredBins})=>{

    return (
        <div style={{flexDirection:'row',gap:'10px',padding:'4px',display:'flex'}}>
             <InfoBox 
            height="60px" 
            width="120px" 
            text={`Total Bins: ${filteredBins.length}`}
            textColor="#000" 
            textSize="16px"
            borderSize="1px" 
            borderColor="#03A6A1" 
            backgroundColor="#03A6A1" 
            
          />

          <InfoBox 
            height="60px" 
            width="120px" 
            text={`Full Bins: ${filteredBins.filter(b => String(b.bin_desc) === "1").length}`}
            textColor="#000" 
            textSize="16px"
            borderSize="1px" 
            borderColor="#FF4F0F" 
            backgroundColor="#FF4F0F" 

          />
        </div>
    )
}
export default InfoAreas;