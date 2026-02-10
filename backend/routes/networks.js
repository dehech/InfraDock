const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();

// Liste des réseaux
router.get("/", async (req, res) => {
  try {
    const networks = await docker.listNetworks();
    res.json(networks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un réseau
router.delete("/:id", async (req, res) => {
  try {
    const network = docker.getNetwork(req.params.id);
    await network.remove();
    res.json({ message: "Network removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
