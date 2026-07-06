import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userLoginSchema, userRegisterSchema } from "../validations/user.validation.js";
import { loginUserController, registerUserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../types/role.type.js";

const userRouter = express.Router();

userRouter
.post("/register", validate(userRegisterSchema), registerUserController)
.post("/login", authenticate(Role.Student), validate(userLoginSchema), loginUserController)

export default userRouter;