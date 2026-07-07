import { Router } from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { studentRegisterSchema, studentUpdateSchema } from "../validations/student.validation.js";
import { getStudentController, registerStudentController } from "../controllers/student.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import Role from "../models/role.model.js";

const studentRouter = Router();

studentRouter
.post("/register", authenticate([Role.SuperAdmin]), validate(studentRegisterSchema), registerStudentController)
// .put("/update", authenticate(Role.Student), validate(studentUpdateSchema), updateStudentController)
// .put("/update/:id", authenticate(Role.SuperAdmin), validate(studentUpdateSchema), updateStudentController)
.get("/", authenticate(Role.SuperAdmin), getStudentController)

export default studentRouter;