const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();

// Stats pour tous les conteneurs
router.get("/containers", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });

    const statsPromises = containers.map(async (info) => {
      const container = docker.getContainer(info.Id);
      try {
        const s = await container.stats({ stream: false });

        // Calcul CPU %
        const cpuDelta = s.cpu_stats.cpu_usage.total_usage - s.precpu_stats.cpu_usage.total_usage;
        const systemDelta = s.cpu_stats.system_cpu_usage - s.precpu_stats.system_cpu_usage;
        const cpuPercent = systemDelta > 0
          ? (cpuDelta / systemDelta) * s.cpu_stats.cpu_usage.percpu_usage.length * 100
          : 0;

        // Calcul MEM %
        const memUsage = s.memory_stats.usage || 0;
        const memLimit = s.memory_stats.limit || 1;
        const memPercent = (memUsage / memLimit) * 100;

        return {
          id: info.Id,
          name: info.Names[0] || info.Id,
          state: info.State,
          cpuPercent: cpuPercent.toFixed(2),
          memPercent: memPercent.toFixed(2),
        };
      } catch (err) {
        return { id: info.Id, name: info.Names[0] || info.Id, error: err.message };
      }
    });

    const stats = await Promise.all(statsPromises);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
