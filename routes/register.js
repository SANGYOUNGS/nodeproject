import express from "express";
import UserModel from "../models/schema/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "이미 등록된 이메일 입니다" }] });
    }

    user = new UserModel({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.send("Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;

