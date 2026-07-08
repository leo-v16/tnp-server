import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { studentIdParamSchema, studentRegisterSchema, studentUpdateAdminSchema, studentUpdateSchema } from "../validations/student.validation.js";
import { getStudentController, registerStudentController, studentDashboardController, studentUpdateAdminController, updateStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const studentRouter = Router();

studentRouter
.post("/register", authenticate([Role.SuperAdmin]), validate(studentRegisterSchema), registerStudentController)
.put("/update", authenticate(Role.Student), validate(studentUpdateSchema), updateStudentController)
.put("/update/:user_id", authenticate(Role.SuperAdmin), validate(studentUpdateAdminSchema.extend(studentIdParamSchema)), studentUpdateAdminController)
.get("/", authenticate(Role.SuperAdmin), getStudentController)
.get("/dashboard", authenticate(Role.Student), studentDashboardController);

export default studentRouter;