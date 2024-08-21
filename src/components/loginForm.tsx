"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../public/logo.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Ocorreu um erro ao tentar fazer login.");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push("/costumers");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar fazer login.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        method="POST"
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-sm flex flex-col items-center space-y-4"
      >
        <div className="flex items-center justify-center">
          <Image src={logo} alt="logo" className="w-[80px] h-[80px]" />
          <h1 className="text-4xl text-[#051723] font-bold">GFBET</h1>
        </div>
        <h1 className="font-semibold text-[#051723]">Login</h1>

        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          placeholder="Digite seu email"
          className="border border-[#051723]"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <Label htmlFor="password">Senha:</Label>
        <Input
          type="password"
          placeholder="Digite sua senha"
          className="border border-[#051723]"
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-red-500 text-sm">
            {errors.password.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-40 bg-[#051723] text-white hover:bg-[#051723]/90"
        >
          Entrar
        </Button>
        <p className="text-sm">
          Não possui conta?
          <Link href="/register"> Criar conta</Link>
        </p>
        <Link href="/recovery-password" className="text-sm">
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
}
