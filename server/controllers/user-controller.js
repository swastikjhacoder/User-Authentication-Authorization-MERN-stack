import User from "../models/user-model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || email.trim() == "") {
      res.status(402).json({ message: "Email is required!" });
    }
    if (!password || password.trim() == "") {
      res.status(402).json({ message: "Password is required!" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).json({ message: "User is already exist!" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser
      .save()
      .then(() =>
        res.status(200).json({ message: "User added successfully! 👍🏻" })
      )
      .catch((error) =>
        res
          .status(500)
          .json({ message: `Error adding new user! Error: ${error.message}` })
      );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) return res.status(404).json({ message: "User not found!" });
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return res.status(401).json({ message: "Wrong credentials!" });
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .cookie("auth_token", token, { httpOnly: true })
      .status(200)
      .json({ validUser, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("auth_token");
    res.status(200).json({ message: "User has been logged out successfully!" });
  } catch (error) {
    console.log(`${error.message}`);
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
