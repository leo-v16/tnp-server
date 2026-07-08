import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { studentIdParamSchema, studentRegisterSchema, studentUpdateAdminSchema, studentUpdateSchema } from "../validations/student.validation.js";
import { getStudentController, registerStudentController, studentDashboardController, studentUpdateAdminController, updateStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const studentRouter = Router();

studentRouter
.post("/", authenticate([Role.SuperAdmin]), validate(studentRegisterSchema), registerStudentController)
.put("/me", authenticate(Role.Student), validate(studentUpdateSchema), updateStudentController)
.put("/:user_id", authenticate(Role.SuperAdmin), validate(studentUpdateAdminSchema.extend(studentIdParamSchema.shape)), studentUpdateAdminController)
.get("/", authenticate(Role.SuperAdmin), getStudentController)
.get("/me/dashboard", authenticate(Role.Student), studentDashboardController);

export default studentRouter;