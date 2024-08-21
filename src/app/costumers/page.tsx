"use client";

import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <Sidebar />
    </div>
  );
}
