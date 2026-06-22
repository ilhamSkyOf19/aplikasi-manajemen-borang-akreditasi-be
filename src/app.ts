import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import appRoute from "./routes/route";
import { errorMiddleware } from "./middlewares/error.middleware";

// dotenv
dotenv.config();

// initialize express app
const app = express();

// global origin
app.use(
  cors({
    origin: ["https://borangfikom.my.id", "http://localhost:5173"],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// static
app.use(express.static("public"));

// cek waktu sudah deploy
// app.use((req, res, next) => {
//   console.log({
//     ip: req.ip,
//     forwarded: req.headers["x-forwarded-for"],
//     remote: req.socket.remoteAddress,
//   });

//   next();
// });

// routes
app.use("/", appRoute);

// error handle
app.use(errorMiddleware);

// export app
export default app;
