import { Router } from "express";
import { getAllSkillController } from "../controllers/skill.controller.js";

const skillRoute = Router();

skillRoute
.get("/", getAllSkillController)

export default skillRoute;