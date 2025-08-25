// App.jsx (Demo for testing)
import { useState } from "react";
import "./App.css";
import AreasSidebar from "./components/AreasSidebar.jsx";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const areas = [
    { area_id: 1, area_name: "בניין 4 | קומה 2" },
    { area_id: 2, area_name: "בניין 100 | קומה 1" },
    { area_id: 3, area_name: "בניין 12 | קומה 2" },
    { area_id: 4, area_name: "בניין 41 | קומה 2" },
    { area_id: 5, area_name: "בניין 1000 | קומה 1" },
    { area_id: 6, area_name: "בניין 16 | קומה 2" },
    { area_id: 7, area_name: "בניין 47 | קומה 2" },
    { area_id: 8, area_name: "בניין 9 | קומה 1" },
    { area_id: 9, area_name: "בניין 17 | קומה 2" },
  ];

  return (
    <div className="app-container" dir="rtl">
      <AreasSidebar
        areas={areas} 
        selectedId={selectedId} 
        onSelect={(id) => setSelectedId(Number(id))}
        sortMode="name-asc"         // name-asc | name-desc | id-asc | id-desc
      />
      <div style={{ marginTop: 12 }}>נבחר: {selectedId ?? "—"}</div>
    </div>
  );
}
