import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { TimAkreditasiController } from "../controllers/timAkreditasi.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import {
  CreateTimAkreditasiType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";
import { TimAkreditasiValidation } from "../validations/timAkreditasi.validation";

const timAkreditasiRoute: Router = Router();

// create
timAkreditasiRoute.post(
  "/",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateTimAkreditasiType>(TimAkreditasiValidation.CREATE),
  TimAkreditasiController.create,
);

// read by id
timAkreditasiRoute.get(
  "/:id",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  TimAkreditasiController.readById,
);

// read all
timAkreditasiRoute.get(
  "/",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  TimAkreditasiController.readAll,
);

// read choose
timAkreditasiRoute.get(
  "/choose",
  [authMiddleware, aclMiddleware(["wakil_dekan_1", "kaprodi"])],
  TimAkreditasiController.readChoose,
);

// update
timAkreditasiRoute.patch(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateTimAkreditasiType>(TimAkreditasiValidation.UPDATE),
  TimAkreditasiController.update,
);

// delete by id
timAkreditasiRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  TimAkreditasiController.delete,
);

// export
export default timAkreditasiRoute;
