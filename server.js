import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import ordersRouter from "./routes/orders.js";
import adminRouter from "./routes/admin.js";
import usersRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import brandRouter from "./routes/brand.js";
import categoryRouter from "./routes/category.js";
import productRouter from "./routes/product.js";
import variantRouter from "./routes/variant.js";

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

app.use(cookieParser());
app.use(express.json());

app.use("/api/register", authRouter);
app.use("/api/login", authRouter);
app.use("/api/logout", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);
app.use("/api/brand", brandRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/variant", variantRouter);

// 에러 핸들러
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "server error" });
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
