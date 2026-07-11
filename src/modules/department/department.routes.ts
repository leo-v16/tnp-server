import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import Role from "../role/role.model.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { departmentRegisterSchema } from "./department.validation.js";
import { departmentRegisterController, getAllDepartmentController } from "./department.controller.js";


const departmentRoute = Router();

departmentRoute
.post("/register", authenticate(Role.SuperAdmin), validate(departmentRegisterSchema), departmentRegisterController)
.get("/", getAllDepartmentController)

export default departmentRoute;