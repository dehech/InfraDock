const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const images = await docker.listImages();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une image
router.delete("/:id", async (req, res) => {
  try {
    const image = docker.getImage(req.params.id);
    await image.remove({ force: true });
    res.json({ message: "Image removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
