import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/utils/errorHandler.js";
import adminRouter from "./src/api/v1/admin/routes/adminRouter.js";
import "./src/config/database.js";
import authRouter from "./src/api/v1/auth/routes/authRouter.js";
import userRouter from "./src/api/v1/user/routes/userRoute.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Auth Backend is running");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);
