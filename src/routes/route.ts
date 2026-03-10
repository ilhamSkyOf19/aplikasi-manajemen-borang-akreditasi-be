import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";
import kriteriaRouter from "./kriteria.route";
import timAkreditasiRoute from "./timAkreditasi.route";
import LimiterMiddleware from "../middlewares/limiter.middleware";
import userRoute from "./user.route";
import kebutuhanDokumenRoute from "./kebutuhanDokumen.route";
import picRouter from "./pic.route";
import riwayatRouter from "./riwayat.route";
import notifikasiRoute from "./notifikasi.route";
import dokumenBorangRoute from "./dokumenBorang.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// middleate limiter
appRoute.use(LimiterMiddleware.apiRegular());

// auth router
appRoute.use("/api/auth", authRoute);

// user route
appRoute.use("/api/user", userRoute);

// kriteria router
appRoute.use("/api/kriteria", kriteriaRouter);

// kebutuhan dokumen
appRoute.use("/api/kebutuhan-dokumen", kebutuhanDokumenRoute);

// tim akreditasi router
appRoute.use("/api/tim-akreditasi", timAkreditasiRoute);

// pic router
appRoute.use("/api/pic", picRouter);

// riwayat router
appRoute.use("/api/riwayat", riwayatRouter);

// notifikasi router
appRoute.use("/api/notifikasi", notifikasiRoute);

// dokumen borang router
appRoute.use("/api/dokumen-borang", dokumenBorangRoute);

export default appRoute;
