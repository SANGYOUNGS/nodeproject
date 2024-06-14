import express from "express";
import User from "../models/schema/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("잘못된 이메일 또는 비밀번호입니다.");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("잘못된 이메일 또는 비밀번호입니다.");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "Lax",
    };

    if (user.role === "admin") {
      res
        .cookie("adminCookie", token, cookieOptions)
        .json({ message: "로그인 성공!", token });
    } else {
      res
        .cookie("userCookie", token, cookieOptions)
        .json({ message: "로그인 성공!", token });
    }
  } catch (err) {
    next(err);
  }
});

// 로그아웃
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("adminCookie");
    res.clearCookie("userCookie");
    res.status(200).send("성공적으로 로그아웃되었습니다.");
  } catch (err) {
    next(err);
  }
});

export default router;
