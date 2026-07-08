import { Router } from "express";
import { getAllDepartmentController } from "../controllers/department.controller.js";

const departmentRoute = Router();

departmentRoute
.get("/", getAllDepartmentController)

export default departmentRoute;