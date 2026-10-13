"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import * as z from "zod";
import { login } from "@/lib/api/auth";
import { string } from "zod/v4";

// Fuera del componente: así no se vuelve a crear en cada render
const loginSchema = z.object({
  usuario: z.string().min(1, "El usuario no puede estar vacío"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { isValid, errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginSchema) => {
    setErrorGeneral(null);
    try {
      await login(data)
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {    
        setErrorGeneral(error.message)
      } else {
        setErrorGeneral(String(error));
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f2f3ec] p-6">
      <form
        noValidate
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-[#c9cdb8] bg-white p-8 shadow-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center text-xl font-bold text-[#3f4a2e]">
          Iniciar Sesión
        </h1>

        {errorGeneral && (
          <p className="rounded-md bg-red-50 p-2 text-center text-sm text-red-600">
            {errorGeneral}
          </p>
        )}

        <div>
          <label htmlFor="usuario" className="mb-1 block text-sm font-semibold text-[#3f4a2e]">
            Servidor
          </label>
          <select>
            <option>
              --- SELECCIONA UN SERVIDOR ---
            </option>
          </select>
          {errors.usuario && (
            <p className="mt-1 text-xs text-red-600">{errors.usuario.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="usuario" className="mb-1 block text-sm font-semibold text-[#3f4a2e]">
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            autoComplete="username"
            {...register("usuario")}
            className="w-full rounded-md border border-[#c9cdb8] bg-[#f7f8f3] p-2 text-sm text-black outline-none focus:border-[#4b5320] focus:ring-2 focus:ring-[#4b5320]/30"
          />
          {errors.usuario && (
            <p className="mt-1 text-xs text-red-600">{errors.usuario.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-[#3f4a2e]">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-md border border-[#c9cdb8] bg-[#f7f8f3] p-2 pr-10 text-sm text-black outline-none focus:border-[#4b5320] focus:ring-2 focus:ring-[#4b5320]/30"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7057] hover:text-[#4b5320]"
              tabIndex={-1}
            >
              {mostrarPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full rounded-md bg-[#4b5320] p-2 text-sm font-semibold text-white transition hover:bg-[#3f4a2e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}