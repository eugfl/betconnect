import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";
import { generateResetToken } from "@/lib/token";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é necessário" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const token = generateResetToken();
    await prisma.resetPasswordToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({
      message: "Email de recuperação enviado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de recuperação:", error);
    return NextResponse.json(
      { error: "Erro ao enviar e-mail de recuperação" },
      { status: 500 }
    );
  }
}
