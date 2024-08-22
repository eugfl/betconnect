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
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;

  try {
    const contact = await prisma.contact.update({
      where: { id: String(id) },
      data: updateData,
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao atualizar o contato. Tente novamente mais tarde.",
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
      { error: "ID do contato não fornecido." },
      { status: 400 }
    );
  }

  try {
    await prisma.contact.delete({
      where: { id: String(id) },
    });

    return NextResponse.json(
      { message: "Contato excluído com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir contato:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao excluir o contato. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
