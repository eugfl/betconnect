import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token e senha são necessários" },
        { status: 400 }
      );
    }

    const resetToken = await prisma.resetPasswordToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.resetPasswordToken.delete({ where: { token } });

    return NextResponse.json({ message: "Senha redefinida com sucesso" });
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir a senha" },
      { status: 500 }
    );
  }
}
