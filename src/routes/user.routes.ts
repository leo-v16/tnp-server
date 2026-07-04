import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userRegisterSchema } from "../validations/user.validation.js";
import { registerUserController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", validate(userRegisterSchema), registerUserController);

export default userRouter;