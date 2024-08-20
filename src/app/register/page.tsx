"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "../actions/create-user";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Importando o useRouter

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve conter no mínimo 3 letras"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await createUser(data);
      toast.success("Usuário criado com sucesso!");
      router.push("/");
    } catch (error) {
      const createUserError = error as Error;
      if (createUserError.message === "O email já está em uso.") {
        toast.error(
          "Este e-mail já está registrado. Por favor, use outro e-mail."
        );
      } else {
        toast.error("Ocorreu um erro ao criar o usuário.");
      }
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-sm flex flex-col items-center space-y-4"
      >
        <div className="flex items-center justify-center">
          <Image src={logo} alt="logo" className="w-[80px] h-[80px]" />
          <h1 className="text-4xl text-[#051723] font-bold">GFBET</h1>
        </div>
        <h1 className="font-semibold text-[#051723]">Criar usuário</h1>

        <Label>Nome:</Label>
        <Input
          type="text"
          placeholder="Digite seu nome"
          className="border border-[#051723]"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        )}

        <Label>Email:</Label>
        <Input
          type="email"
          placeholder="Digite seu email"
          className="border border-[#051723]"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Label>Senha:</Label>
        <Input
          type="password"
          placeholder="Digite sua senha"
          className="border border-[#051723]"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        <Button type="submit" className="w-40">
          Criar
        </Button>
      </form>
    </div>
  );
}
