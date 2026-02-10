import React, { useEffect, useState } from "react";
import { getVolumes } from "../api/dockerApi";
import "./styles/Volumes.css";

const Volumes = () => {
  const [volumes, setVolumes] = useState([]);

  useEffect(() => {
    getVolumes()
      .then(res => setVolumes(res.data.Volumes || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="volumes-container">
      <h2 className="volumes-title">Docker Volumes</h2>

      <table className="volumes-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Driver</th>
            <th>Mountpoint</th>
          </tr>
        </thead>

        <tbody>
          {volumes.map(v => (
            <tr className="volumes-row" key={v.Name}>
              <td>{v.Name}</td>
              <td>{v.Driver}</td>
              <td>{v.Mountpoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Volumes;
