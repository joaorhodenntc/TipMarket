"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao registrar");

      // Faz login automático após o registro
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/dashboard");
    } catch (err) {
      //setError(err.message);
    } finally {
      setLoading(false);
    }
    console.log(form);
  };

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
      <h1 className="text-white text-center">Registro</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center justify-center"
      >
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
          <Label htmlFor="email" className="font-bold">
            Nome
          </Label>
          <Input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
          <Label htmlFor="email" className="font-bold">
            Email
          </Label>
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
          <Label htmlFor="email" className="font-bold">
            Senha
          </Label>
          <Input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <Button
          type="submit"
          className="bg-white p-2 text-black w-full hover:bg-gray-300 mt-2"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  );
}
