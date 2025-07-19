import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware.js";
import adminRouter from "./routes/adminRouter.js";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(errorHandler);

import "./config/dbConnection.js"; // make sure to add .js if using ES modules
import authRouter from "./routes/authRouter.js";


const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth Backend is running");
});



app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
