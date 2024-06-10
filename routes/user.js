import express from 'express';
import userService  from '../services/userService.js';

const router = express.Router();

router.get('/user/:id', userService.getUser);
router.put('/user/:id', userService.updateUser);
router.delete('/user/:id', userService.deleteUser);
router.post('/login', userService.signIn);
router.post('/logout', userService.logout);

export default router;