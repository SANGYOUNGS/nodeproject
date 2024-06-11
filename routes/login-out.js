import express from 'express';
import User from '../models/schema/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//로그인
router.post('/login', async (req, res, next) => {
  try{
    const { email, password } = req.body;
    //이메일 일치여부
    const user = await User.findOne({ email });
    if(!user) {
      const error = new Error('잘못된 이메일 또는 비밀번호입니다.');
      error.statusCode = 400;
      throw error;
    }

    //해쉬화된 비밀번호 일치여부
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect) {
    const error = new Error('잘못된 이메일 또는 비밀번호입니다.');
    error.statusCode = 400;
    throw error;
    }

    const token = jwt.sign(
      { email: user.email, role: user.role }, process.env.JWT_SECRET, {expriresIn: "1h" });
      if(user.role === 'admin') {
        res.cookie('adminCookie', token, {httpOnly: true, secure: true, path: '/admin'}).json('로그인 성공!');
      } else {
        res.cookie('userCookie', token, {httpOnly: true, secure: true}).json('로그인 성공!');
      }
  }catch(err) {
    next(err);
  }
});

//로그아웃
router.post('/logout', async(req, res, next) => {
    try {
      res.status(200).send('성공적으로 로그아웃되었습니다.');
    }catch(err) {
      next(err);
    }
  });

export default router;