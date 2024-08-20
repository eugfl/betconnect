"use server";

import { prisma } from "@/lib/prisma";
import { RegisterFormValues } from "../register/page";
import bcrypt from "bcryptjs";

export const createUser = async (data: RegisterFormValues) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new Error("O email já está em uso.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return user;
};
