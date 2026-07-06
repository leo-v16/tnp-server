import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { studentRegisterSchema } from "../validations/student.validation.js";
import { registerStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { Role } from "../types/role.type.js";

const studentRouter = Router();

studentRouter
.post("/register", validate(studentRegisterSchema), authenticate(Role.SuperAdmin), registerStudentController);

export default studentRouter;