const express = require("express");
const router = express.Router();


router.use("/containers", require("./containers"));
router.use("/images", require("./images"));
router.use("/volumes", require("./volumes"));
router.use("/networks", require("./networks"));
router.use("/system", require("./system"));
router.use("/monitoring", require("./monitoring"));
router.use((req, res, next) => {console.log("➡️ Gateway route:", req.method, req.originalUrl);
  next();
});

module.exports = router;
