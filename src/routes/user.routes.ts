import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { userRegisterSchema } from "../validations/user.validation.js";

const userRouter = express.Router();

userRouter.post("/register", validate(userRegisterSchema), (req, res, next) => {})

export default userRouter;