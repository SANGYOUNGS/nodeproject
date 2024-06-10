import express from 'express';
import userService  from '../services/userService.js';
import errorHandler from '../middlewares/errorhandler.js';

const router = express.Router();

router.get('/user/:id', userService.getUser);
router.put('/user/:id', userService.updateUser);
router.delete('/user/:id', deleteUser);
router.post('/login', userService.signIn);
router.post('/logout', userService.logout);

router.use(errorHandler);

export default app;