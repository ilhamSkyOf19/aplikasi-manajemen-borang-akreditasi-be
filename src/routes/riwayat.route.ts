import { Router } from "express";
import { RiwayatController } from "../controllers/riwayat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";

const riwayatRouter: Router = Router();

// read all by pic id
riwayatRouter.get(
  "/read-all-by-pic-id/:picId",
  [
    authMiddleware,
    aclMiddleware(["kaprodi", "wakil_dekan_1", "tim_akreditasi"]),
  ],
  RiwayatController.readAllByPicId,
);

export default riwayatRouter;
