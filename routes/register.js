import express from "express";
import UserModel from "../models/schema/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "이미 등록된 이메일 입니다" }] });
    }

    user = new UserModel({
      name,
      email,
      password,
      phoneNumber
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: "Success" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
