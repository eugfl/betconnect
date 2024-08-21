"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const requestResetPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type RequestResetPasswordFormValues = z.infer<
  typeof requestResetPasswordSchema
>;

export default function RequestResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestResetPasswordFormValues>({
    resolver: zodResolver(requestResetPasswordSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: RequestResetPasswordFormValues) => {
    try {
      const response = await fetch("/api/request-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (response.ok) {
        toast.success("Email de recuperação enviado com sucesso!");
        router.push("/");
      } else {
        const result = await response.json();
        toast.error(
          result.error || "Ocorreu um erro ao tentar enviar o email."
        );
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao tentar enviar o email.");
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
        <h1 className="font-semibold text-[#051723]">
          Solicitar Redefinição de Senha
        </h1>

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

        <Button
          type="submit"
          className="w-40 bg-[#051723] text-white hover:bg-[#051723]/90"
        >
          Enviar Email
        </Button>
        <Link href={"/"}>Voltar ao login</Link>
      </form>
    </div>
  );
}
