"use client";

import { signOut, useSession } from "next-auth/react";
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
      <h1>Perfil do Usuário</h1>
      <p>Nome: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
