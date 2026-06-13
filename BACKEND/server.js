import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { adopterApp } from "./APIs/AdopterAPI.js";
import { rescuerApp } from "./APIs/RescuerAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";
import cookieParser from "cookie-parser";
import cors from "cors";
config();

const app = exp();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(exp.json());

app.use("/adopter-api", adopterApp);
app.use("/rescuer-api", rescuerApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB server connected");
    const port = process.env.PORT || 4001;
    app.listen(port, () => console.log(`server listening on ${port}..`));
  } catch (err) {
    console.log("err in db connect", err.message);
    process.exit(1);
  }
};

connectDB();

app.use((req, res, next) => {
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;
  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }
  res.status(500).json({ message: "Server side error occurred", error: err.message });
});
