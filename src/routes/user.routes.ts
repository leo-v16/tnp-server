import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userLoginSchema, userRegisterSchema } from "../validations/user.validation.js";
import { loginUserController, registerUserController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter
.post("/register", validate(userRegisterSchema), registerUserController)
.post("/login", validate(userLoginSchema), loginUserController)

export default userRouter;