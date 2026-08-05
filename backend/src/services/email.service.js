import { transporter } from "../config/nodeEmailer.js";

export async function sendEmail({
  to,
  subject,
  html,
}) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  return info;
}