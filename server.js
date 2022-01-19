const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const authMiddleWare = require("./middleware/authMiddleWare");
require("dotenv").config();
const myrouter = require("./routes/auth.router");
const loadsRouter = require("./routes/loads.router");
const trucksRouter = require("./routes/trucks.router");
const userRouter = require("./routes/user.router");
const errorHandlerMiddleware = require("./utils/defaultErrorHandle");
const morgan = require("morgan");
const app = express();
const logFile = path.resolve(__dirname, "logs.txt");
if (!fs.existsSync(logFile)) {
  try {
    fs.appendFileSync(logFile, "logs\n", "utf-8");
  } catch (e) {
    console.log(e);
  }
}
const myStream = fs.createWriteStream(logFile, { flags: "a" });

app.use(morgan("combined", { stream: myStream }));
app.use(cors());
app.use(express.json());
app.use("/api/auth", myrouter);
app.use(authMiddleWare);
app.use("/api/users/me", userRouter);
app.use("/api/trucks", trucksRouter);
app.use("/api/loads", loadsRouter);
app.use(errorHandlerMiddleware);
app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});
const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(port, () => console.log("connected AND listens..."));
  } catch (error) {
    console.log(error);
  }
};

start();
