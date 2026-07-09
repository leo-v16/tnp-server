import express, { application } from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import trainingApplicationRouter from "./routes/training_application.routes.js";
import studentRouter from "./routes/student.routes.js";
import trainingRouter from "./routes/training.routes.js";
import organizationRouter from "./routes/organization.routes.js";
import departmentRoute from "./routes/department.routes.js";
import skillRoute from "./routes/skill.routes.js";
import categoryRoute from "./routes/category.routes.js";
import divisionRoute from "./routes/division.routes.js";
import genderRoute from "./routes/gender.routes.js";
import semesterRoute from "./routes/semester.routes.js";
import placementRouter from "./routes/placement.routes.js";
import placementApplicationRouter from "./routes/placement_application.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/training-applications", trainingApplicationRouter);
app.use("/students", studentRouter);
app.use("/trainings", trainingRouter);
app.use("/organizations", organizationRouter);
app.use("/departments", departmentRoute);
app.use("/skills", skillRoute);
app.use("/categories", categoryRoute);
app.use("/divisions", divisionRoute);
app.use("/genders", genderRoute);
app.use("/semesters", semesterRoute);
app.use("/placements", placementRouter);
app.use("/placement-applications", placementApplicationRouter);
app.use("/dashboards", dashboardRouter);

app.use(errorHandler);

export default app;
