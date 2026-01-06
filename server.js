const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("enaika's server is amazing");
});

app.listen(3000, () => {
  console.log("server is running");
});
