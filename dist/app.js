import express, { application } from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import trainingApplicationRouter from "./routes/training_application.routes.js";
import studentRouter from "./routes/student.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/training-application", trainingApplicationRouter);
app.use("/student", studentRouter);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map