export const ENV = {
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY!,
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  REDIRECT_URI: process.env.REDIRECT_URI!,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN!,
  GOOGLE_DRIVE_FOLDER_MIME_TYPE: process.env.GOOGLE_DRIVE_FOLDER_MIME_TYPE!,
  ROOT_FOLDER_ID: process.env.ROOT_FOLDER_ID!,

  // email config
  EMAIL_SMTP_SECURE: Boolean(process.env.EMAIL_SMTP_SECURE) || false,
  EMAIL_SMTP_PASS: process.env.EMAIL_SMTP_PASS || "",
  EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || "",
  EMAIL_SMTP_PORT: Number(process.env.EMAIL_SMTP_PORT) || 587,
  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || "",
  EMAIL_SMTP_SERVICE_NAME: process.env.EMAIL_SMTP_SERVICE_NAME || "",
};
