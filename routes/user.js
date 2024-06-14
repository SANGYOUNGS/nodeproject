import express from "express";
import User from "../models/schema/user.js";
import bcrypt from "bcrypt";

import { authenticationMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// 정보 조회
router.get("/me", authenticationMiddleware, async (req, res, next) => {
  try {
    console.log("첫 번째 사용자 조회 시도 중");

    const user = await User.findById(res.locals.user.id).select("-password");
    if (!user) {
      console.log("사용자를 찾을 수 없습니다.");
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("서버 에러:", err.message);
    next(err);
  }
});

// 정보 수정
router.put("/user/:id", authenticationMiddleware, async (req, res, next) => {
  const userId = req.params.id;
  if (!userId) {
    const error = new Error("사용자를 찾을 수 없습니다.");
    error.statusCode = 404;
    return next(error);
  }
  const { name, email, password, address, phoneNumber } = req.body;
  try {
    const updateData = { name, email, address, phoneNumber };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
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
  "/api/delete/:id",
  authenticationMiddleware,
  async (req, res, next) => {
    const userId = req.params.id;

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
  }
);

export default router;
