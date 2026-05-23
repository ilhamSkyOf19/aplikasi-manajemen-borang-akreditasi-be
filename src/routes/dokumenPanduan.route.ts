import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { DokumenPanduanController } from "../controllers/dokumenPanduan.controller";
import { FileService } from "../services/file.service";
import { distribusiMiddleware } from "../middlewares/distribusi.middleware";

const dokumenPanduanRoute: Router = Router();

// upload
const upload = FileService.uploadFile({
  allowedMimeTypes: /pdf/,
});

// create
dokumenPanduanRoute.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  upload.single("dokumen_panduan"),
  DokumenPanduanController.create,
);

// update
dokumenPanduanRoute.patch(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  upload.single("dokumen_panduan"),
  DokumenPanduanController.update,
);

// find
dokumenPanduanRoute.get(
  "/",
  [authMiddleware, periodeMiddleware],
  DokumenPanduanController.find,
);

// download
dokumenPanduanRoute.get(
  "/download",
  [authMiddleware, periodeMiddleware],
  DokumenPanduanController.download,
);

// preview
dokumenPanduanRoute.get(
  "/preview",
  [
    authMiddleware,
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1]),
  ],
  DokumenPanduanController.preview,
);

// exp
export default dokumenPanduanRoute;
