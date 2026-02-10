const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const volumes = await docker.listVolumes();
    res.json(volumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un volume
router.delete("/:name", async (req, res) => {
  try {
    const volume = docker.getVolume(req.params.name);
    await volume.remove();
    res.json({ message: "Volume removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
