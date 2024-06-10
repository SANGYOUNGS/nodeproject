import express from 'express';
import User from '../models/schema/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//로그인
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

    try{
      const user = await User.findOne({ email });
      if(!user) {
      const error = new Error('잘못된 이메일 또는 비밀번호입니다.');
      error.statusCode = 400;
      throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
    const error = new Error('잘못된 이메일 또는 비밀번호입니다.');
    error.statusCode = 400;
    throw error;
    }
    const secretKey = process.env.JWT_SECRET_KEY || 'jwt-secret-key';
    const token = jwt.sign(
      { em: "team2@gmail.com",
        ro: "user" 
      }, 
        secretKey, 
        {expriresIn: "1h" }
      );

    res.json({ token });
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