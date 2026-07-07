import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userLoginSchema, userRegisterSchema } from "../validations/user.validation.js";
import { getUserController, loginUserController, registerUserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const userRouter = express.Router();

userRouter
.post("/register", validate(userRegisterSchema), registerUserController)
.post("/login", validate(userLoginSchema), loginUserController)
.get("/", authenticate(Role.SuperAdmin), getUserController);

export default userRouter;