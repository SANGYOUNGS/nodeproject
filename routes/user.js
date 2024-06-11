import express from "express";
import User from "../models/schema/user.js";
import bcrypt from "bcrypt";
import { authenticationMiddleware } from "../middleware/authMiddleware.js";
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
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    if (updateData.currentPassword && updateData.newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updateData.currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        const error = new Error("비밀번호가 일치하지 않습니다.");
        error.statusCode = 401;
        throw error;
      }
      const newPasswordHash = await bcrypt.hash(updateData.newPassword, 10);
      updateData.password = newPasswordHash;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// 정보 삭제
router.delete("/user/:id", authenticationMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).send("성공적으로 삭제되었습니다.");
  } catch (err) {
    next(err);
  }
});

export default router;
