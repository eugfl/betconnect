import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Redefinição de Senha",
    text: `Clique no link para redefinir sua senha: ${resetUrl}`,
    html: `<p>Clique no link para redefinir sua senha: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail de redefinição de senha enviado com sucesso.");
  } catch (error) {
    console.error("Erro ao enviar e-mail de redefinição de senha:", error);
  }
}
