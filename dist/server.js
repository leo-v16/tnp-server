import app from "./app.js";
import pool from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Database Connected Successfully");
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server Running at Port: ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Database Connection Error: ${error.cause}`);
        }
        console.error(`Database Connection Error: ${error}`);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map