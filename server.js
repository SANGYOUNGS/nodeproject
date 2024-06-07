const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { tls: true });
    console.log("DB 연결 성공");
  } catch (err) {
    console.error("DB 연결 실패:", err);
    throw err;
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT} 에서 서버 실행중`);
  });
};

app.get("/", (req, res) => {
  res.send("Welcome to the Clothes API

const init = async () => {
  try {
    await connectDB();
  } catch (err) {
  } finally {
    startServer();
  }
};

init();

module.exports = app;
