const Docker = require("dockerode");

const docker = new Docker({
  host: "127.0.0.1",   // ou "localhost"
  port: 2375           // port TCP Docker (non sécurisé)
});

module.exports = docker;
