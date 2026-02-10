const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// gateway
app.use("/api", require("./routes/gateway"));

app.get("/", (req, res) => {
  res.json({ message: "InfraDock Backend Running 🚀" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
