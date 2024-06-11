import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import registerRouter from "./routes/register.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import usersRouter from "./routes/user.js";
import signRouter from "./routes/login-out.js";
import guestRouter from "./routes/guests.js";


dotenv.config();

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {});
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

app.use(cors());
app.use(express.json());
app.use("/api/register", registerRouter);
app.use("/api/login", signRouter);
app.use("/api/logout", signRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/guests", guestRouter);

//에러 핸들러
app.use ((err, req, res, next)=> {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'server error'});
return;
});

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
