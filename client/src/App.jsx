import { useState } from "react";
import "./App.css";
import AreasSidebar from "./components/areas/AreasSidebar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="app-container">
        <div><AreasSidebar buildingNum="1" floor="1" /></div>
        <div><AreasSidebar buildingNum="1" floor="2" /></div>
        <div><AreasSidebar buildingNum="4" floor="2" /></div>
      </div>
      <h1>Full Bin Detection System</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
