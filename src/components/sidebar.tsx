import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LogOut, Users, Phone } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="h-screen w-72 bg-transparent border-r border-r-[#0A1D27] shadow flex flex-col">
      <div className="flex items-center justify-center pt-8 pb-5 border-none shadow-none">
        <Image src={logo} alt="logo" className="h-16 w-16" />
        <h1 className="font-bold text-4xl">GFBET</h1>
      </div>

      <Separator className="w-60 mx-5 bg-[#0A1D27]" />

      <div className="pt-4 flex-grow">
        <p className="text-sm mx-5 mb-4">Bem-vindo, {session?.user?.name}!</p>

        <Button
          onClick={() => handleNavigation("/costumers")}
          className={`w-60 mx-5 mb-4 flex items-center justify-center gap-2 ${
            isActive("/costumers")
              ? "bg-[#0A1D27] text-white"
              : "bg-transparent text-[#0A1D27] border border-[#0A1D27] hover:bg-[#0A1D27] hover:text-white transition"
          } transition`}
        >
          <Users className="w-5 h-5" />
          Clientes
        </Button>

        <Button
          onClick={() => handleNavigation("/contacts")}
          className={`w-60 mx-5 mb-4 flex items-center justify-center gap-2 ${
            isActive("/contacts")
              ? "bg-[#0A1D27] text-white"
              : "bg-transparent text-[#0A1D27] border border-[#0A1D27] hover:bg-[#0A1D27] hover:text-white transition"
          } transition`}
        >
          <Phone className="w-5 h-5" />
          Contatos
        </Button>
      </div>

      <Button
        onClick={() => signOut()}
        className="w-60 mx-5 mb-5 bg-transparent text-[#0A1D27] border border-[#0A1D27] flex items-center justify-center gap-2 hover:bg-[#0A1D27] hover:text-white transition mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </Button>
    </div>
  );
}
