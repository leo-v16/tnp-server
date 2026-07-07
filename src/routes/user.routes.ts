import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userIdParamSchema, userLoginSchema, userRegisterSchema } from "../validations/user.validation.js";
import { getOneUserController, getUserController, loginUserController, registerUserController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const userRouter = express.Router();

userRouter
.post("/register", validate(userRegisterSchema), registerUserController)
.post("/login", validate(userLoginSchema), loginUserController)
.get("/", authenticate(Role.SuperAdmin), getUserController)
.get("/:user_id", authenticate(Role.SuperAdmin), validate(userIdParamSchema), getOneUserController)

export default userRouter;