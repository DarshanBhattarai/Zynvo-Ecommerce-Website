const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
require("./models/dbConnection");
const authRouter = require("./routes/authRouter");
const cors = require("cors");

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
