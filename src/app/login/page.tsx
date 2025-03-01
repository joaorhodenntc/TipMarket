"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-20">
      <a href="/">
        <Image
          src="/logo.png"
          width={100}
          height={100}
          alt="Logo"
          className="flex justify-start"
        />
      </a>

      <h1 className="text-white text-center">Login</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
          <Label htmlFor="email" className="font-bold">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
          <Label htmlFor="password" className="font-bold">
            Senha
          </Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
              fontWeight: "lighter",
              marginBottom: "-10px",
            }}
          >
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="bg-white p-2 text-black w-full hover:bg-gray-300 mt-2"
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}
