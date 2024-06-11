import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import registerRouter from "./routes/register.js";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import signRouter from "./routes/login-out.js";
import brandRouter from "./routes/brand.js";
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";

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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/register", registerRouter);
app.use("/api/login", signRouter);
app.use("/api/logout", signRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", userRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);

// 에러 핸들러
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "server error" });
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
