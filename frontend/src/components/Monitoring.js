import React, { useEffect, useState } from "react";
import { getMonitoring } from "../api/dockerApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./styles/Monitoring.css";

const Monitoring = () => {
  const [stats, setStats] = useState([]);

  const fetchStats = () => {
    getMonitoring()
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="monitoring-container">
      <h2 className="monitoring-title">Monitoring — CPU & RAM Usage</h2>

      <div className="monitoring-card">
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={stats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cpuPercent" fill="#6366f1" name="CPU %" />
              <Bar dataKey="memPercent" fill="#34d399" name="RAM %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
