//InfoAreas.jsx
import React from "react"
import InfoBox from "./InfoBox";
const InfoAreas = ({filteredBins})=>{

    return (
        <div style={{flexDirection:'row',gap:'48px',padding:'4px',display:'flex',justifyContent:'center',alignItems:'center',height:'100%'}}>
             <InfoBox 
            height="120px" 
            width="200px" 
            text={`סה"כ פחים: ${filteredBins.length}`}
            textColor="#2563eb" 
            textSize="20px"
            borderSize="1px" 
            borderColor="#2563eb" 
          />

          <InfoBox 
            height="120px" 
            width="200px" 
            text={`פחים מלאים: ${filteredBins.filter(b => String(b.bin_desc) === "1").length}`}
            textColor="#dc2626" 
            textSize="20px"
            borderSize="1px" 
            borderColor="#dc2626" 
            isFull={true}
          />
        </div>
    )
}
export default InfoAreas;

