import express from "express";
import {
  register,
  login,
  logout,
  getUser
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post( "/logout", logout );
userRouter.get( '/:userId/role', getUser );

export default userRouter;
