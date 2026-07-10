import { Router } from "express";
import { getAllCategoryController } from "../controllers/category.controller.js";

const categoryRoute = Router();

categoryRoute
.get("/", getAllCategoryController)

export default categoryRoute;