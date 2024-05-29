const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Voeg je routes hier toe
app.get("/api/user", (req, res) => {
  res.json([{ Name: "Homerus" }, { Name: "Somar" }]);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
