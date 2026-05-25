import { Router } from "express";
import { zodValidation } from "../middlewares/validation.middleware";
import { ActivationCodeValidation } from "../validations/activationCode.validation";
import { ActivationCodeController } from "../controllers/activationCode.controller";
import LimiterMiddleware from "../middlewares/limiter.middleware";

const activationCodeRoute: Router = Router();

// create
activationCodeRoute.post(
  "/send-code",
  LimiterMiddleware.activation(),
  zodValidation<{ email: string }>(ActivationCodeValidation.CREATE),
  ActivationCodeController.create,
);

// resend
activationCodeRoute.post(
  "/resend-code",
  LimiterMiddleware.activation(),
  zodValidation<{ email: string }>(ActivationCodeValidation.CREATE),
  ActivationCodeController.resend,
);

// verify
activationCodeRoute.post(
  "/verify",
  LimiterMiddleware.activation(),
  zodValidation<{ email: string; code: number }>(
    ActivationCodeValidation.VERIFY,
  ),
  ActivationCodeController.verifyCode,
);

// exp
export default activationCodeRoute;
