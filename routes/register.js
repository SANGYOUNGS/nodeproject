import express from "express";
import UserModel from "../models/schema/user.js";
import bcrypt from "bcryptjs";
import { registerValidator, formatValidationErrors } from "../middleware/registerValidator.js";

const router = express.Router();

router.post("/", registerValidator, formatValidationErrors, async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    // 이메일 중복 확인
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "이미 등록된 이메일 입니다." });
    }

    // 새로운 사용자 생성
    const newUser = new UserModel({
      name,
      email,
      password,
      phoneNumber
    });

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // 사용자 저장
    await newUser.save();

    res.status(201).json({ message: "회원가입이 완료 되었습니다." });
  } catch (error) {
    console.error("회원가입 에러:", error.message);
    res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
