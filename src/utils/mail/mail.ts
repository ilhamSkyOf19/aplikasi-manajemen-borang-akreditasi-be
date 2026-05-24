import nodemailer from "nodemailer";
import { ENV } from "../env";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  service: ENV.EMAIL_SMTP_SERVICE_NAME,
  host: ENV.EMAIL_SMTP_HOST,
  port: ENV.EMAIL_SMTP_PORT,
  secure: ENV.EMAIL_SMTP_SECURE,
  auth: {
    user: ENV.EMAIL_SMTP_USER,
    pass: ENV.EMAIL_SMTP_PASS,
  },
  requireTLS: true,
});

export interface ISendEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// send email
export const sendEmail = async ({ from, to, subject, html }: ISendEmail) => {
  try {
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

// render ejs
export const renderMailHtml = async (params: {
  template: string;
  data: any;
}): Promise<string> => {
  const { template, data } = params;
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}`),
    data,
  );

  return content as string;
};
