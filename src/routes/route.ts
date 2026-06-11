import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";
import kriteriaRouter from "./kriteria.route";
import timAkreditasiRoute from "./timAkreditasi.route";
import LimiterMiddleware from "../middlewares/limiter.middleware";
import userRoute from "./dosen.route";
import riwayatRouter from "./riwayat.route";
import notifikasiRoute from "./notifikasi.route";
import dokumenBorangRoute from "./dokumenBorang.route";
import dosenRoute from "./dosen.route";
import kriteriaPicRouter from "./kriteriaPic.route";
import verifikasiRoute from "./verifikasi.route";
import dokumentasiBorangRoute from "./dokumentasiBorang.route";
import picKebutuhanDokumentasiRoute from "./picKebutuhanDokumentasi.route";
import namaKebutuhanDokumentasiRouter from "./namaKebutuhanDokumentasi.route";
import folderRouter from "./folder.route";
import fileDokumenRouter from "./fileDokumen.route";
import distribusiKebutuhanDokumentasiRouter from "./distribusiKebutuhanDokumentasi.route";
import statistikRoute from "./statistik.route";
import periodeRoute from "./periode.route";
import timelineRoute from "./timeline.route";
import dokumenPanduanRoute from "./dokumenPanduan.route";
import activationCodeRoute from "./activationCode.route";
import kebutuhanDokumentasiRoute from "./kebutuhanDokumentasi.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// middleate limiter
appRoute.use(LimiterMiddleware.apiRegular());

// auth router
appRoute.use("/api/auth", authRoute);

// // user route
appRoute.use("/api/dosen", dosenRoute);

// // periode route
appRoute.use("/api/periode", periodeRoute);

// // kriteria router
appRoute.use("/api/kriteria", kriteriaRouter);

// kriteria pic router
appRoute.use("/api/kriteria-pic", kriteriaPicRouter);

// kebutuhan dokumentasi pic router
appRoute.use("/api/kebutuhan-dokumentasi", kebutuhanDokumentasiRoute);

// verifikasi route
appRoute.use("/api/verifikasi", verifikasiRoute);

// dokumentasi borang route
appRoute.use("/api/dokumentasi-borang", dokumentasiBorangRoute);

// pic kebutuhan dokumentasi route
appRoute.use("/api/pic-kebutuhan-dokumentasi", picKebutuhanDokumentasiRoute);

// nama kebutuhan route
appRoute.use("/api/nama-kebutuhan-dokumentasi", namaKebutuhanDokumentasiRouter);

// folder route
appRoute.use("/api/folder", folderRouter);

// file route
appRoute.use("/api/file-dokumen", fileDokumenRouter);

// file route
appRoute.use(
  "/api/distribusi-kebutuhan-dokumentasi",
  distribusiKebutuhanDokumentasiRouter,
);

// statistik route
appRoute.use("/api/statistik", statistikRoute);

// timeline route
appRoute.use("/api/timeline", timelineRoute);

// dokumen panduan route
appRoute.use("/api/dokumen-panduan", dokumenPanduanRoute);

// activation route
appRoute.use("/api/activation-code", activationCodeRoute);

// riwayat router
appRoute.use("/api/riwayat", riwayatRouter);

// notifikasi router
appRoute.use("/api/notifikasi", notifikasiRoute);

// // dokumen borang router
// appRoute.use("/api/dokumen-borang", dokumenBorangRoute);

export default appRoute;
