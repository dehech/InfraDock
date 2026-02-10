const express = require("express");
const docker = require("../lib/docker");
const router = express.Router();


// Liste des conteneurs
router.get("/", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.json(containers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrer un conteneur
router.post("/start/:id", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.start();
    res.json({ message: "Container started" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Arrêter un conteneur
router.post("/stop/:id", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.stop();
    res.json({ message: "Container stopped" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un conteneur
router.delete("/:id", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    await container.remove({ force: true });
    res.json({ message: "Container removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logs conteneur
router.get("/:id/logs", async (req, res) => {
  try {
    const container = docker.getContainer(req.params.id);
    const logs = await container.logs({
      stdout: true,
      stderr: true,
      tail: 200
    });
    res.send(logs.toString());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * Vérifie si une image existe déjà localement
 */
async function imageExistsLocally(imageName) {
  const images = await docker.listImages();
  return images.some(img =>
    img.RepoTags && img.RepoTags.includes(imageName)
  );
}

// Créer un conteneur simple
router.post("/create", async (req, res) => {
  console.log("📥 POST /containers/create reçu");
  console.log("📦 Body reçu :", req.body);

  // Sécurité : body vide
  if (!req.body) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const { type, name } = req.body;

  if (!type) {
    return res.status(400).json({ error: "type is required" });
  }

  const templates = {
    python: {
      Image: "python:3.10",
      Cmd: ["python3", "-m", "http.server", "8000"],
      ExposedPorts: { "8000/tcp": {} },
      HostConfig: {
        PortBindings: { "8000/tcp": [{ HostPort: "8000" }] }
      }
    },
    node: {
      Image: "node:18",
      Cmd: ["node", "-e", "console.log('Node container running'); setInterval(()=>{},1000)"]
    },
    go: {
      Image: "golang:1.22",
      Cmd: ["bash", "-c", "while true; do echo 'Go container'; sleep 2; done"]
    },
    rust: {
      Image: "rust:latest",
      Cmd: ["bash", "-c", "while true; do echo 'Rust container'; sleep 2; done"]
    },
    java: {
      Image: "eclipse-temurin:17-jdk-alpine",
      Cmd: ["sh", "-c", "while true; do echo 'Java container'; sleep 2; done"]
    }
  };

  // Vérifier le type
  if (!templates[type]) {
    console.error("❌ Type inconnu :", type);
    return res.status(400).json({ error: "Unknown container type" });
  }

  const config = {
    name: name || `${type}-container`,
    ...templates[type]
  };

  console.log("🛠 Configuration finale :", config);

  try {
    // 1️⃣ Vérifier image locale
    console.log("🔍 Vérification image locale :", config.Image);
    const exists = await imageExistsLocally(config.Image);

    if (!exists) {
      console.log("⬇️ Image absente → téléchargement :", config.Image);

      await new Promise((resolve, reject) => {
        docker.pull(config.Image, (err, stream) => {
          if (err) return reject(err);

          docker.modem.followProgress(stream, () => {
            console.log("✔️ Image téléchargée :", config.Image);
            resolve();
          });
        });
      });
    } else {
      console.log("✅ Image déjà présente localement :", config.Image);
    }

    // 2️⃣ Créer le conteneur
    console.log("📦 Création du conteneur…");
    const container = await docker.createContainer(config);
    console.log("✔️ Conteneur créé ID :", container.id);

    // 3️⃣ Démarrer
    console.log("🚀 Démarrage du conteneur…");
    await container.start();
    console.log("✔️ Conteneur démarré");

    res.json({
      message: `${type} container created`,
      id: container.id,
      imageDownloaded: !exists
    });

  } catch (err) {
    console.error("💥 Erreur /containers/create :", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
