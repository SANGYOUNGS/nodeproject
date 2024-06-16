import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Guest from '../models/schema/guest.js';

const router = express.Router();

//비회원 로그인
router.post('/guests', async (req, res, next) => {
    try {
        const { guestEmail, guestPassword } = req.body;

        if(!guestEmail || !guestPassword) {
            const error = new Error('이메일과 비밀번호를 입력해 주세요.');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(guestPassword, 10);
        const guest = new Guest({ guestEmail, guestPassword: hashedPassword});

        await guest.save();

        const token = jwt.sign(
            { email: guest.guestEmail, role: 'guest' }, 
            process.env.JWT_SECRET, 
            {expiresIn: "10m" }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV ==="production",
            maxAge: 600000,  //10분
            sameSite: "Lax",
        };

        res.cookie('guestCookie', token, cookieOptions);

        if(role ==='guest') {
            res.status(200).json({ redirectUrl: '/orders'})
        } else {
            res.status(200).json({message: '로그인 성공!'});
        }
    }catch(err) {
        next(err);
    }
});

export default router;
