import React from "react"
import InfoBox from "./InfoBox";
const InfoAreas = ({filteredBins})=>{

    return (
        <div style={{flexDirection:'row',gap:'48px',padding:'4px',display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
             <InfoBox 
            height="60px" 
            width="120px" 
            text={`Total Bins: ${filteredBins.length}`}
            textColor="#000" 
            textSize="16px"
            borderSize="1px" 
            borderColor="#2563eb" 
            backgroundColor="#c4d3f5ff"
            boxShadow="#217ea554"
            
          />

          <InfoBox 
            height="60px" 
            width="120px" 
            text={`Full Bins: ${filteredBins.filter(b => String(b.bin_desc) === "1").length}`}
            textColor="#000" 
            textSize="16px"
            borderSize="1px" 
            borderColor="#dc2626" 
            backgroundColor="#fec3c3ff"
            boxShadow="#fd795154"

          />
        </div>
    )
}
export default InfoAreas;