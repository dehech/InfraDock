import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Containers from "./components/Containers";
import Images from "./components/Images";
import Volumes from "./components/Volumes";
import Networks from "./components/Networks";
import Monitoring from "./components/Monitoring";

import "./App.css";

function App() {
  const [page, setPage] = useState("containers");

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <Sidebar onSelect={setPage} />

      {/* Main content */}
      <main className="content">
        {page === "containers" && <Containers />}
        {page === "images" && <Images />}
        {page === "volumes" && <Volumes />}
        {page === "networks" && <Networks />}
        {page === "monitoring" && <Monitoring />}
      </main>

    </div>
  );
}

export default App;
