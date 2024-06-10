import express from 'express';
import userService  from '../services/userService.js';

const router = express.Router();

router.get('/user/:id', userService.getUser);
router.put('/user/:id', userService.updateUser);
router.delete('/user/:id', userService.deleteUser);

export default router;