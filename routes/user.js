import express from "express";
import User from "../models/schema/user.js";
import bcrypt from "bcrypt";

import {authenticationMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

// 정보 조회
router.get("/me", authenticationMiddleware, async (req, res, next) => {
  try {

    const user = await User.findById(res.locals.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// 정보 수정
router.put("/user/me", authenticationMiddleware, async (req, res, next) => {
  const userId = res.locals.user.id;

  try {
  if (!userId) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.statusCode = 404;
    return next(error);
  }

  //유효성검사
  const { name, email, password, address, phoneNumber } = req.body;

  const updateData = {};

  if(name !== undefined) {
  if(typeof name === 'string' || name.trim().length >= 2 ) {
    updateData.name = name;
  } else {
    const error = new Error("이름은 2글자 이상이어야 합니다.");
    error.statusCode = 400;
    throw error;
  }
}
  if(email !== undefined) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      updateData.email = email;
    } else {
      const error = new Error("이메일 형식이 옳바르지 않습니다.");
      error.statusCode = 400;
      throw error;
    }
  }

    if(password !== undefined) {
    if(typeof password === 'string' && password.length > 8) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    } else {
      const error = new Error("비밀번호는 8자 이상이어야 합니다.");
      error.statusCode = 400;
      throw error;
    }
  }

    if(address !== undefined) {
    if(typeof address === 'string' && address.trim().length >= 5) {
      updateData.address = address;
    } else {
      const error = new Error("유효한 주소를 입력하세요.");
      error.statusCode = 400;
      throw error;
    }
  }

    if(phoneNumber !== undefined) {
    const phoneRegex = /^\d{10,11}$/;
    if(phoneRegex.test(phoneNumber)) {
      updateData.phoneNumber = phoneNumber;
    } else {
      const error = new Error("유효한 핸드폰 번호를 입력하세요.");
      error.statusCode = 400;
      throw error;
    }
  }

    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, runValidators: true,
    });

    if (!updateUser) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    res.json({
      message: "사용자 정보가 업데이트되었습니다.",
      user: updateUser,
    });
  } catch (err) {
    next(err);
  }
});

// 정보 삭제
router.delete(
  "/me", 
  authenticationMiddleware, 
  async (req, res, next) => {
  const userId = res.locals.user.id;

  if (!userId) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.statusCode = 404;
    return next(error);
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "사용자 정보가 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
