import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

// dotenv
dotenv.config();

// initialize express app
const app = express();

// global origin
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// export app
export default app;
