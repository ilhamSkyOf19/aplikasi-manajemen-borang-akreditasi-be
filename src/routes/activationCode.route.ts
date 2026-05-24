import { Router } from "express";
import { zodValidation } from "../middlewares/validation.middleware";
import { ActivationCodeValidation } from "../validations/activationCode.validation";
import { ActivationCodeController } from "../controllers/activationCode.controller";

const activationCodeRoute: Router = Router();

// create
activationCodeRoute.post(
  "/reset-password",
  zodValidation<{ email: string }>(ActivationCodeValidation.CREATE),
  ActivationCodeController.create,
);

// resend
activationCodeRoute.post(
  "/resend",
  zodValidation<{ email: string }>(ActivationCodeValidation.CREATE),
  ActivationCodeController.resend,
);

// verify
activationCodeRoute.post(
  "/verify",
  zodValidation<{ email: string; code: number }>(
    ActivationCodeValidation.VERIFY,
  ),
  ActivationCodeController.verifyCode,
);

// exp
export default activationCodeRoute;
