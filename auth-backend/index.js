import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import "./models/dbConnection.js"; // make sure to add .js if using ES modules
import authRouter from "./routes/authRouter.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth Backend is running");
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
