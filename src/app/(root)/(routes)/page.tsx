"use client"

import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export default function HomePage() {
  return (
    <main className="lms-home-page text-white">
      <h1 className="">HomePage</h1>
      <p>Adicione o seu conteúdo aqui...</p>
      <Button
        disabled={false}
        label={'Log Out'}
        onClick={() => signOut()}
      ></Button>
    </main>
  );
}
