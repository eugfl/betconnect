import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clientes = await prisma.customer.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      {
        error:
          "Não foi possível buscar os clientes. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone } = await request.json();

    const existingCustomer = await prisma.customer.findFirst({
      where: { email },
    });

    if (existingCustomer) {
      return NextResponse.json(
        { error: "Este email já está em uso." },
        { status: 400 }
      );
    }

    const cliente = await prisma.customer.create({
      data: { fullName, email, phone },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      {
        error:
          "Ocorreu um erro ao criar o cliente. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }
}
