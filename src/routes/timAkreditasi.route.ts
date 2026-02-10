import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { TimAkreditasiController } from "../controllers/timAkreditasi.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import {
  CreateTimAkreditasiType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";
import { TimAkreditasivalidation } from "../validations/timAkreditasi.validation";

const timAkreditasiRoute: Router = Router();

// create
timAkreditasiRoute.post(
  "/create",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateTimAkreditasiType>(TimAkreditasivalidation.CREATE),
  TimAkreditasiController.create,
);

// read by id
timAkreditasiRoute.get(
  "/read-by-id/:id",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  TimAkreditasiController.readById,
);

// read all
timAkreditasiRoute.get(
  "/read-all",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  TimAkreditasiController.readAll,
);

// update
timAkreditasiRoute.patch(
  "/update/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateTimAkreditasiType>(TimAkreditasivalidation.UPDATE),
  TimAkreditasiController.update,
);

// delete by id
timAkreditasiRoute.delete(
  "/delete/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  TimAkreditasiController.delete,
);

// export
export default timAkreditasiRoute;
