"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Token inválido");
      router.push("/request-reset-password");
    }
  }, [token, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post("/api/reset-password", { token, password });
      toast.success("Senha redefinida com sucesso");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao redefinir a senha");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 border border-[#051723] rounded shadow-md w-full max-w-sm flex flex-col items-center space-y-4"
    >
      <div className="flex items-center justify-center">
        <Image src={logo} alt="logo" className="w-[80px] h-[80px]" />
        <h1 className="text-4xl text-[#051723] font-bold">GFBET</h1>
      </div>
      <h1 className="font-semibold text-[#051723]">Redefinir Senha</h1>

      <Label htmlFor="password">Nova Senha:</Label>
      <Input
        type="password"
        placeholder="Digite sua nova senha"
        className="border border-[#051723]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button
        type="submit"
        className="w-40 bg-[#051723] text-white hover:bg-[#051723]/90"
      >
        Redefinir Senha
      </Button>
      <Link href={"/"}>Voltar ao login</Link>
    </form>
  );
};

export default function ResetPassword() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
