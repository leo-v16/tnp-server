import { Router } from "express";
import { getAllGenderController } from "../controllers/gender.controller.js";

const genderRoute = Router();

genderRoute
.get("/", getAllGenderController)

export default genderRoute;