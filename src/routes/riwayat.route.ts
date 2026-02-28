import { Router } from "express";
import { RiwayatController } from "../controllers/riwayat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateRiwayatType } from "../models/riwayat.model";
import { RiwayatValidation } from "../validations/riwayat.validation";

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

// update riwayat pic
riwayatRouter.patch(
  "/update-riwayat-pic/:picId/:riwayatId",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateRiwayatType>(RiwayatValidation.UPDATE),
  RiwayatController.updateRiwayatPic,
);

export default riwayatRouter;
