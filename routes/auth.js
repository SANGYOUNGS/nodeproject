import express from "express";
import User from "../models/schema/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//회원가입
router.post("/", async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    if (typeof name !== "string" || name.trim().length < 2) {
      const error = new Error("이름은 2글자 이상이어야 합니다.");
      error.statusCode = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("이메일 형식이 옳바르지 않습니다.");
      error.statusCode = 400;
      throw error;
    }

    if (typeof password !== "string" || password.length < 7) {
      const error = new Error("비밀번호는 8자 이상이어야 합니다.");
      error.statusCode = 400;
      throw error;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      const error = new Error("유효한 핸드폰 번호를 입력하세요.");
      error.statusCode = 400;
      throw error;
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "이미 등록된 이메일 입니다." });
    }

    user = new User({
      name,
      email,
      password,
      phoneNumber,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Success" });
  } catch (err) {
    next(err);
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("이메일과 비밀번호를 입력하세요.");
      error.statusCode = 400;
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("유효한 이메일 주소를 입력하세요.");
      error.statusCode = 400;
      throw error;
    }

    if (typeof password !== "string" || password.length < 7) {
      const error = new Error("비밀번호는 8자 이상이어야 합니다.");
      error.statusCode = 400;
      throw error;
    }

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
      return;
    }
    res
      .cookie("userCookie", token, cookieOptions)
      .json({ message: "로그인 성공!", token });
  } catch (err) {
    next(err);
  }
});

// 로그아웃
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("adminCookie");
    res.clearCookie("userCookie");
    res.status(200).json({ message: "성공적으로 로그아웃되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
