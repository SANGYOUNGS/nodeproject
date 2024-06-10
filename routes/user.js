import express from "express";
import userService from "../services/userService.js";

const router = express.Router();

router.get("/me", userService.getUserByToken);
router.put("/user/:id", userService.updateUser);
router.delete("/user/:id", userService.deleteUser);
router.post("/login", userService.signIn);
router.post("/logout", userService.logout);

export default router;
