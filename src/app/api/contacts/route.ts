import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const customerId = url.searchParams.get("customerId");

  if (customerId) {
    try {
      const contacts = await prisma.contact.findMany({
        where: { customerId: String(customerId) },
      });
      return NextResponse.json(contacts);
    } catch (error) {
      console.error("Erro ao buscar contatos do cliente:", error);
      return NextResponse.json(
        {
          error:
            "Não foi possível buscar os contatos do cliente. Tente novamente mais tarde.",
        },
        { status: 500 }
      );
    }
  } else {
    try {
      const contacts = await prisma.contact.findMany();
      return NextResponse.json(contacts);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      return NextResponse.json(
        {
          error:
            "Não foi possível buscar os contatos. Tente novamente mais tarde.",
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, customerId } = await request.json();

    const newContact = await prisma.contact.create({
      data: {
        fullName,
        email,
        phone,
        customerId,
      },
    });

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao criar o contato. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
