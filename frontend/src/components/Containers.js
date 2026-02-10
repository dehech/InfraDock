import React, { useEffect, useState } from "react";
import {
  getContainers,
  startContainer,
  stopContainer,
  removeContainer,
  createSimpleContainer
} from "../api/dockerApi";

import "./styles/Containers.css";
import { FaPlay, FaStop, FaTrash } from "react-icons/fa";

const Containers = () => {
  const [containers, setContainers] = useState([]);
  const [newType, setNewType] = useState("python");
  const [newName, setNewName] = useState("");

  const loadContainers = () => {
    getContainers()
      .then(res => setContainers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadContainers();
  }, []);

  const handleStart = (id) => startContainer(id).then(loadContainers);
  const handleStop = (id) => stopContainer(id).then(loadContainers);

  const handleDelete = (id) => {
    if (!window.confirm("Supprimer ce conteneur ?")) return;
    removeContainer(id).then(loadContainers);
  };

  const handleCreate = () => {
    if (!newName) return alert("Veuillez entrer un nom !");
    createSimpleContainer(newType, newName)
      .then(() => {
        loadContainers();
        setNewName("");
      })
      .catch(err => console.error(err));
  };

  const formatPorts = (ports) => {
    if (!ports || ports.length === 0) return "—";
    return ports
      .filter(p => p.PublicPort)
      .map(p => `${p.PublicPort}:${p.PrivatePort}`)
      .join(", ");
  };

  const getStatusBadge = (status) => {
    const st = status.toLowerCase();
    if (st.includes("running")) return "badge badge-running";
    if (st.includes("exited")) return "badge badge-stopped";
    return "badge badge-other";
  };

  const logos = {
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    go: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    rust: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  };

  const types = ["python", "node", "go", "rust", "java"];

  return (
    <div className="containers-card">

      <div className="containers-header">
        <h2>Containers</h2>
      </div>

      {/* TABLE DES CONTENEURS */}
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Status</th>
              <th>Ports</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {containers.map((c) => (
              <tr key={c.Id}>
                <td>{c.Names[0].replace("/", "")}</td>
                <td>{c.Image}</td>
                <td>
                  <span className={getStatusBadge(c.State)}>{c.State}</span>
                </td>
                <td>{formatPorts(c.Ports)}</td>

                <td className="actions">
                  {c.State === "running" ? (
                    <button className="btn stop" onClick={() => handleStop(c.Id)}>
                      <FaStop />
                    </button>
                  ) : (
                    <button className="btn start" onClick={() => handleStart(c.Id)}>
                      <FaPlay />
                    </button>
                  )}

                  <button className="btn delete" onClick={() => handleDelete(c.Id)}>
                    <FaTrash />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* FORMULAIRE DE CREATION AVEC LOGOS SELECTIONNABLES */}
      <div className="create-box">
        {/*<h3>Create Container</h3>*/}
        <h3 className="create-title">Create a new container</h3>
        <p className="create-subtitle">
          Select a technology, choose a name and deploy instantly
        </p>


        {/* Sélection des logos */}
        <div className="logo-selector">
          {types.map((type) => (
            <img
              key={type}
              src={logos[type]}
              alt={type}
              className={`logo-choice ${newType === type ? "selected" : ""}`}
              onClick={() => setNewType(type)}
            />
          ))}
        </div>

        {/* Nom du conteneur */}
        <input
          type="text"
          placeholder="Container name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="name-input"
        />

        {/* Bouton create */}
        <button className="btn start create-btn" onClick={handleCreate}>
          Create
        </button>
      </div>

    </div>
  );
};

export default Containers;
