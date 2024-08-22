import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { fullName, email, phone } = await req.json();
  const updateData: any = {};

  if (fullName) updateData.fullName = fullName;
  if (email) {
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email,
        id: {
          not: id,
        },
      },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Este email já está em uso." },
        { status: 400 }
      );
    }

    updateData.email = email;
  }
  if (phone) updateData.phone = phone;

  try {
    const cliente = await prisma.customer.update({
      where: { id: String(id) },
      data: updateData,
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao atualizar o cliente. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "ID do cliente não fornecido." },
      { status: 400 }
    );
  }

  try {
    await prisma.customer.delete({
      where: { id: String(id) },
    });

    return NextResponse.json(
      { message: "Cliente excluído com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);

    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao excluir o cliente. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
