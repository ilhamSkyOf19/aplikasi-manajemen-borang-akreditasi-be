import { google } from "googleapis";
import { ENV } from "../utils/env";

const oauth2Client = new google.auth.OAuth2(
  ENV.CLIENT_ID,
  ENV.CLIENT_SECRET,
  ENV.REDIRECT_URI,
);

oauth2Client.setCredentials({ refresh_token: ENV.REFRESH_TOKEN });

const driveApi = google.drive({
  version: "v3",
  auth: oauth2Client,
});

export default driveApi;
