import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import registerRouter from "./routes/register.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";

// 환경 변수 로드
dotenv.config();

const app = express();

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

app.use(express.json()); // JSON 본문 파싱 미들웨어 추가
app.use("/", registerRouter, adminRouter);
app.use("/api/orders", ordersRouter);




app.get("/", (req, res) => {
  res.send("Welcome to the Clothes API");
});

const init = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("초기화 중 오류 발생:", err);
  } finally {
    startServer();
  }
};

init();

export default app;
