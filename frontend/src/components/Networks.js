import React, { useEffect, useState } from "react";
import { getNetworks } from "../api/dockerApi";
import "./styles/Networks.css";

const Networks = () => {
  const [networks, setNetworks] = useState([]);

  useEffect(() => {
    getNetworks()
      .then(res => setNetworks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="networks-container">
      <h2 className="networks-title">Docker Networks</h2>

      <table className="networks-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Driver</th>
            <th>Scope</th>
          </tr>
        </thead>

        <tbody>
          {networks.map(n => (
            <tr className="networks-row" key={n.Id}>
              <td>{n.Name}</td>
              <td>{n.Driver}</td>
              <td>{n.Scope}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Networks;
