const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();

router.get("/info", async (req, res) => {
  try {
    const info = await docker.info();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/version", async (req, res) => {
  try {
    const version = await docker.version();
    res.json(version);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
