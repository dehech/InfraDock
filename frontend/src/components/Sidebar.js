import React from "react";
import "./styles/Sidebar.css";

const Sidebar = ({ onSelect }) => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">InfraDock</h2>

      <ul className="sidebar-menu">
        <li onClick={() => onSelect("containers")}>Containers</li>
        <li onClick={() => onSelect("images")}>Images</li>
        <li onClick={() => onSelect("volumes")}>Volumes</li>
        <li onClick={() => onSelect("networks")}>Networks</li>
        <li onClick={() => onSelect("monitoring")}>Monitoring</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
