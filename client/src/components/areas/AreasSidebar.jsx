import React from "react";

function AreasSidebar(props) {
    return (
        <div className="container-button">
            <bottun onClick={() => console.log(`נלחץ: בניין ${props.buildingNum} קומה ${props.floor}`)}>בניין {props.buildingNum} קומה {props.floor}</bottun>
        </div>
    )
}

export default AreasSidebar;