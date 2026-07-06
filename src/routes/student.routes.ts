import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { studentRegisterSchema } from "../validations/student.validation.js";
import { registerStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const studentRouter = Router();

studentRouter
.post("/register", authenticate([Role.SuperAdmin]), validate(studentRegisterSchema), registerStudentController);

export default studentRouter;