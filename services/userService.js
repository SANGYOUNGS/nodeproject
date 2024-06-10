import User from "../models/schema/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 로그인
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("잘못된 이메일 또는 비밀번호입니다.");
      error.statusCode = 401;
      throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("잘못된 이메일 또는 비밀번호입니다.");
      error.statusCode = 401;
      throw error;
    }
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// 이메일로 사용자 조회
const getFirstUser = async (req, res, next) => {
  try {
    console.log("첫 번째 사용자 조회 시도 중");

    const user = await User.findOne().sort({ _id: 1 }); // 첫 번째 사용자 조회
    console.log(`조회된 사용자: ${user}`);

    if (!user) {
      const error = new Error("사용자를 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// 유저 정보 수정
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    if (updateData.currentPassword && updateData.newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        updateData.currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        throw new Error("비밀번호가 일치하지 않습니다.");
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
};

// 사용자 정보 삭제
const deleteUser = async (req, res, next) => {
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
};

// 로그아웃
const logout = async (req, res, next) => {
  try {
    res.status(200).send("성공적으로 로그아웃되었습니다.");
  } catch (err) {
    next(err);
  }
};

export default {
  signIn,
  getFirstUser,
  updateUser,
  deleteUser,
  logout,
};
